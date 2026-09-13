import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Real PostgreSQL SQL/RLS in WASM. This does not emulate Supabase Auth HTTP/JWT
// verification and cannot prove multi-connection lock behaviour.
let db;
const id = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const P = id(1), Q = id(2), V = id(3), W = id(4), OLD = id(5);
const SUP = id(10), PLAN = id(11), PM = id(12), ADMIN = id(13), OTHER = id(14), CONTROL = id(15), ENG = id(16), REVOKED = id(17);
const roles = [[SUP,'site-supervisor'],[PLAN,'planner'],[PM,'project-manager'],[ADMIN,'administrator'],[CONTROL,'project-controls'],[ENG,'discipline-engineer']];
const A = id(20), B = id(21), QA = id(22), L5 = id(23), STALE = id(24), D = id(25);
let seq = 100;
const next = () => id(seq++);
async function as(user, sql, params = []) {
  await db.exec('begin; set local role authenticated;');
  try {
    await db.query("select set_config('request.jwt.claim.sub',$1,true)", [user ?? '']);
    const result = await db.query(sql, params);
    await db.exec('commit');
    return result;
  } catch (e) { await db.exec('rollback'); throw e; }
}
async function capture(user = SUP, kind = 'start', date = '2026-08-26', key = next(), project = P, text = 'Alignment started on 26 August.') {
  const result = await as(user, 'select public.sentinel_capture_manual($1,$2,$3,$4,$5,$6,$7) as id',
    [project,key,'2026-08-28',text,kind,date,text]);
  return result.rows[0].id;
}
async function approve(event, activity = A, user = PLAN, key = next(), revision = 1, project = P, reason = 'Evidence and activity checked.') {
  const result = await as(user, 'select public.sentinel_approve_actual($1,$2,$3,$4,$5,$6) as id',
    [project,event,activity,revision,key,reason]);
  return result.rows[0].id;
}
async function count(table) { return Number((await db.query(`select count(*) as n from public.${table}`)).rows[0].n); }

before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth, public to authenticated,anon;
    grant execute on function auth.uid() to authenticated,anon;
  `);
  await db.exec(await readFile(new URL('../migrations/001_manual_reconciliation.sql', import.meta.url), 'utf8'));
  await db.exec(await readFile(new URL('../migrations/002_administrator_workflow.sql', import.meta.url), 'utf8'));
  for (const user of [SUP,PLAN,PM,ADMIN,OTHER,CONTROL,ENG,REVOKED]) await db.query('insert into auth.users values($1)',[user]);
  await db.query('insert into public.sentinel_projects(id,name) values($1,$2),($3,$4)',[P,'Synthetic project A',Q,'Synthetic project B']);
  for (const [user, role] of roles) await db.query('insert into public.sentinel_memberships(project_id,user_id,role) values($1,$2,$3)',[P,user,role]);
  await db.query("insert into public.sentinel_memberships values($1,$2,'planner',true),($3,$4,'planner',false)",[Q,OTHER,P,REVOKED]);
  await db.query('insert into public.sentinel_schedule_versions(id,project_id,label) values($1,$2,$3),($4,$5,$6),($7,$2,$8)',[V,P,'v1',W,Q,'v1',OLD,'old']);
  await db.query('update public.sentinel_projects set active_schedule_id=$1 where id=$2',[V,P]);
  await db.query('update public.sentinel_projects set active_schedule_id=$1 where id=$2',[W,Q]);
  for (const [activity,project,version,level] of [[A,P,V,'L6'],[B,P,V,'L6'],[D,P,V,'L6'],[QA,Q,W,'L6'],[L5,P,V,'L5'],[STALE,P,OLD,'L6']]) {
    await db.query('insert into public.sentinel_activities(id,project_id,schedule_version_id,external_id,level,name) values($1,$2,$3,$4,$5,$6)',[activity,project,version,activity,level,'Synthetic alignment']);
  }
});
after(async () => { await db?.close(); });

test('migration enables RLS on all ten new tables', async () => {
  const result = await db.query("select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relkind='r' and relname like 'sentinel_%'");
  assert.equal(result.rows.length,10);
  assert.ok(result.rows.every(r => r.relrowsecurity));
});
test('project members see only their own projects and memberships', async () => {
  for (const [user] of roles) {
    assert.deepEqual((await as(user,'select id from public.sentinel_projects')).rows,[{id:P}]);
    assert.equal((await as(user,'select * from public.sentinel_memberships')).rows.length,1);
    assert.equal((await as(user,'select * from public.sentinel_activities where project_id=$1',[Q])).rows.length,0);
  }
  assert.deepEqual((await as(OTHER,'select id from public.sentinel_projects')).rows,[{id:Q}]);
  assert.equal((await as(REVOKED,'select * from public.sentinel_projects')).rows.length,0);
  assert.equal((await as(null,'select * from public.sentinel_projects')).rows.length,0);
});
test('anonymous clients cannot read or invoke write functions', async () => {
  await db.exec('begin; set local role anon;');
  try { await assert.rejects(db.query('select * from public.sentinel_projects'), /permission denied/); }
  finally { await db.exec('rollback'); }
  await db.exec('begin; set local role anon;');
  try { await assert.rejects(db.query('select public.sentinel_capture_manual($1,$2,$3,$4,$5,$6,$7)',[P,next(),'2026-08-28','x','start','2026-08-26','x']),/permission denied/); }
  finally { await db.exec('rollback'); }
});
test('no authenticated role can directly modify any application table', async () => {
  const tables = (await db.query("select tablename from pg_tables where schemaname='public' and tablename like 'sentinel_%'")).rows;
  for (const {tablename} of tables) {
    for (const privilege of ['INSERT','UPDATE','DELETE','TRUNCATE']) {
      assert.equal((await db.query('select has_table_privilege($1,$2,$3) as allowed',['authenticated',`public.${tablename}`,privilege])).rows[0].allowed,false);
    }
  }
  await assert.rejects(as(PLAN,"update public.sentinel_memberships set role='administrator'"), /permission denied/);
});
test('capture persists evidence and retry returns the same event', async () => {
  const key=next(), initial=await count('sentinel_reports');
  const first=await capture(SUP,'start','2026-08-26',key);
  assert.equal(await capture(SUP,'start','2026-08-26',key),first);
  assert.equal(await count('sentinel_reports'),initial+1);
  await assert.rejects(capture(SUP,'start','2026-08-27',key), /idempotency_key_reused/);
  assert.equal((await as(SUP,'select review_status from public.sentinel_events where id=$1',[first])).rows[0].review_status,'pending');
});
test('capture enforces permissions, source quote grounding and report date bounds', async () => {
  for (const user of [PM,OTHER,REVOKED]) await assert.rejects(capture(user),/project_permission_denied/);
  await assert.rejects(capture(null),/authentication_required/);
  await assert.rejects(capture(SUP,'start','2026-08-29'),/invalid_capture/);
  await assert.rejects(as(SUP,'select public.sentinel_capture_manual($1,$2,$3,$4,$5,$6,$7)',[P,next(),'2026-08-28','Original report','start','2026-08-26','Invented quote']),/invalid_capture/);
  await capture(ENG,'progress_observation',null);
});
test('unauthorized roles and cross-project approval are rejected without writes', async () => {
  const event = await capture();
  const initial = await count('sentinel_review_decisions');
  for (const user of [SUP,ENG,PM,OTHER,REVOKED]) await assert.rejects(approve(event,A,user), /project_permission_denied/);
  await assert.rejects(approve(event,QA), /activity_not_found_in_project/);
  await assert.rejects(approve(event,A,OTHER,next(),1,Q), /event_not_found/);
  assert.equal(await count('sentinel_review_decisions'),initial);
});
test('stale versions, L5 ambiguity, missing dates and partial observations cannot become actuals', async () => {
  const event = await capture();
  await assert.rejects(approve(event,A,PLAN,next(),2), /stale_or_already_reviewed/);
  await assert.rejects(approve(event,STALE), /schedule_version_is_stale/);
  await assert.rejects(approve(event,L5), /granularity_requires_review/);
  await assert.rejects(approve(await capture(SUP,'start',null)), /actual_date_not_supported/);
  await assert.rejects(approve(await capture(SUP,'progress_observation','2026-08-26')), /actual_date_not_supported/);
});
test('planner acceptance persists the actual, provenance, event revision and audit once', async () => {
  const event=await capture(), key=next();
  const decision=await approve(event,A,PLAN,key);
  assert.equal(await approve(event,A,PLAN,key),decision);
  const actual=(await as(PM,'select actual_start::text,start_decision_id from public.sentinel_schedule_actuals where activity_id=$1',[A])).rows[0];
  assert.deepEqual(actual,{actual_start:'2026-08-26',start_decision_id:decision});
  assert.deepEqual((await as(SUP,'select review_status,revision from public.sentinel_events where id=$1',[event])).rows[0],{review_status:'verified',revision:2});
  assert.equal((await as(PLAN,"select * from public.sentinel_audit_events where record_id=$1 and action='actual_verified'",[event])).rows.length,1);
  await assert.rejects(approve(event,A,PLAN,next()),/stale_or_already_reviewed/);
  await assert.rejects(approve(event,B,PLAN,key),/idempotency_key_reused/);
});
test('conflicting or duplicate actuals cannot overwrite existing dates', async () => {
  for (const date of ['2026-08-26','2026-08-27']) {
    const event=await capture(SUP,'start',date);
    await assert.rejects(approve(event), /existing_actual_requires/);
    assert.equal((await as(PLAN,'select review_status from public.sentinel_events where id=$1',[event])).rows[0].review_status,'pending');
  }
  assert.equal((await db.query('select actual_start::text from public.sentinel_schedule_actuals where activity_id=$1',[A])).rows[0].actual_start,'2026-08-26');
});
test('finish before start is rejected; valid finish can be approved by project controls', async () => {
  await assert.rejects(approve(await capture(SUP,'finish','2026-08-25')),/finish_before_start/);
  const event=await capture(SUP,'finish','2026-08-28');
  await approve(event,A,CONTROL);
  assert.equal((await as(PM,'select actual_finish::text from public.sentinel_schedule_actuals where activity_id=$1',[A])).rows[0].actual_finish,'2026-08-28');
});
test('finish without start preserves unknown start instead of inventing a date', async () => {
  await approve(await capture(SUP,'finish','2026-08-27'),B);
  const actual=(await as(PM,'select actual_start,actual_finish::text from public.sentinel_schedule_actuals where activity_id=$1',[B])).rows[0];
  assert.deepEqual(actual,{actual_start:null,actual_finish:'2026-08-27'});
  await assert.rejects(approve(await capture(SUP,'start','2026-08-28'),B),/finish_before_start/);
});
test('a failed final audit insert rolls back decision, actual and event verification', async () => {
  const event=await capture();
  const beforeCount=await count('sentinel_review_decisions');
  await db.exec(`create function public.test_fail_audit() returns trigger language plpgsql as $$ begin
    if new.action='actual_verified' then raise exception 'injected audit failure'; end if; return new; end $$;
    create trigger test_fail_audit before insert on public.sentinel_audit_events for each row execute function public.test_fail_audit();`);
  try { await assert.rejects(approve(event,D), /injected audit failure/); }
  finally { await db.exec('drop trigger test_fail_audit on public.sentinel_audit_events; drop function public.test_fail_audit();'); }
  assert.equal(await count('sentinel_review_decisions'),beforeCount);
  assert.equal((await db.query('select * from public.sentinel_schedule_actuals where activity_id=$1',[D])).rows.length,0);
  assert.deepEqual((await db.query('select review_status,revision from public.sentinel_events where id=$1',[event])).rows[0],{review_status:'pending',revision:1});
});
test('audit visibility follows role rules and project isolation', async () => {
  for (const user of [PLAN,CONTROL,ADMIN]) assert.ok((await as(user,'select * from public.sentinel_audit_events')).rows.length>0);
  for (const user of [SUP,ENG,PM,OTHER,REVOKED]) assert.equal((await as(user,'select * from public.sentinel_audit_events')).rows.length,0);
});

test('synthetic seed is repeatable and creates no identities or verified actuals', async () => {
  const users=Number((await db.query('select count(*) as n from auth.users')).rows[0].n);
  const actuals=await count('sentinel_schedule_actuals');
  const seed=await readFile(new URL('../seeds/001_synthetic_schedule.sql',import.meta.url),'utf8');
  await db.exec(seed);await db.exec(seed);
  const demo='26122000-0000-4000-8000-000000000001';
  assert.equal((await db.query('select * from public.sentinel_activities where project_id=$1',[demo])).rows.length,4);
  assert.equal(Number((await db.query('select count(*) as n from auth.users')).rows[0].n),users);
  assert.equal(await count('sentinel_schedule_actuals'),actuals);
  assert.equal((await as(PLAN,'select * from public.sentinel_projects where id=$1',[demo])).rows.length,0);
});

test('administrator can capture and approve in their project without bypassing isolation or direct-write guards', async () => {
  const event=await capture(ADMIN);
  await approve(event,D,ADMIN);
  assert.equal((await as(ADMIN,'select actual_start::text from public.sentinel_schedule_actuals where activity_id=$1',[D])).rows[0].actual_start,'2026-08-26');
  await assert.rejects(capture(ADMIN,'start','2026-08-26',next(),Q),/project_permission_denied/);
  await assert.rejects(approve(event,QA,ADMIN,next(),1,Q),/project_permission_denied/);
  await assert.rejects(as(ADMIN,"update public.sentinel_memberships set role='planner'"),/permission denied/);
  await assert.rejects(as(ADMIN,"select public.sentinel_require_role($1,array['planner'])",[P]),/permission denied/);
  await assert.rejects(approve(await capture(ADMIN,'start',null),D,ADMIN),/actual_date_not_supported/);
});
