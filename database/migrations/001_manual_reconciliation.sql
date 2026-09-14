-- SIH26122 foundation. Additive migration; no existing objects are replaced.
-- Apply once as database owner. Auth identities/memberships are provisioned separately.
begin;

create table public.sentinel_schema_versions (
  version text primary key, applied_at timestamptz not null default now()
);
create table public.sentinel_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  timezone text not null default 'Asia/Kolkata',
  active_schedule_id uuid,
  created_at timestamptz not null default now()
);
create table public.sentinel_memberships (
  project_id uuid not null references public.sentinel_projects(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('site-supervisor','discipline-engineer','planner','project-controls','project-manager','administrator')),
  active boolean not null default true,
  primary key (project_id,user_id)
);
create table public.sentinel_schedule_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.sentinel_projects(id),
  label text not null,
  created_at timestamptz not null default now(),
  unique (project_id,id)
);
alter table public.sentinel_projects add constraint sentinel_active_schedule_project_fk
  foreign key (id,active_schedule_id) references public.sentinel_schedule_versions(project_id,id);
create table public.sentinel_activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  schedule_version_id uuid not null,
  external_id text not null check (length(btrim(external_id)) between 1 and 200),
  parent_id uuid,
  level text not null check (level in ('L5','L6')),
  name text not null check (length(btrim(name)) between 1 and 500),
  discipline text, area text, equipment_ref text,
  planned_start date, planned_finish date,
  foreign key (project_id,schedule_version_id) references public.sentinel_schedule_versions(project_id,id),
  unique (project_id,id), unique (project_id,schedule_version_id,id),
  unique (schedule_version_id,external_id),
  foreign key (project_id,schedule_version_id,parent_id) references public.sentinel_activities(project_id,schedule_version_id,id),
  check (parent_id is distinct from id),
  check (planned_start is null or planned_finish is null or planned_finish >= planned_start)
);
create table public.sentinel_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.sentinel_projects(id),
  submitted_by uuid not null references auth.users(id),
  capture_key uuid not null,
  report_date date not null,
  raw_text text not null check (length(btrim(raw_text)) between 1 and 50000),
  capture_payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (project_id,id), unique (project_id,submitted_by,capture_key)
);
create table public.sentinel_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  report_id uuid not null,
  event_index integer not null default 1 check (event_index > 0),
  event_type text not null check (event_type in ('start','finish','progress_observation')),
  actual_date date,
  source_quote text not null check (length(btrim(source_quote)) between 1 and 50000),
  revision integer not null default 1 check (revision > 0),
  review_status text not null default 'pending' check (review_status in ('pending','verified')),
  created_at timestamptz not null default now(),
  foreign key (project_id,report_id) references public.sentinel_reports(project_id,id),
  unique (project_id,id), unique (report_id,event_index)
);
create table public.sentinel_review_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  event_id uuid not null,
  activity_id uuid not null,
  actor_id uuid not null references auth.users(id),
  request_key uuid not null,
  expected_revision integer not null,
  event_type text not null check (event_type in ('start','finish')),
  actual_date date not null,
  reason text not null check (length(btrim(reason)) between 1 and 2000),
  created_at timestamptz not null default now(),
  foreign key (project_id,event_id) references public.sentinel_events(project_id,id),
  foreign key (project_id,activity_id) references public.sentinel_activities(project_id,id),
  unique (actor_id,request_key), unique (event_id), unique (project_id,id),
  unique (project_id,activity_id,id)
);
create table public.sentinel_schedule_actuals (
  project_id uuid not null,
  activity_id uuid not null,
  actual_start date, actual_finish date,
  start_decision_id uuid, finish_decision_id uuid,
  primary key (project_id,activity_id),
  foreign key (project_id,activity_id) references public.sentinel_activities(project_id,id),
  foreign key (project_id,activity_id,start_decision_id) references public.sentinel_review_decisions(project_id,activity_id,id),
  foreign key (project_id,activity_id,finish_decision_id) references public.sentinel_review_decisions(project_id,activity_id,id),
  check ((actual_start is null) = (start_decision_id is null)),
  check ((actual_finish is null) = (finish_decision_id is null)),
  check (actual_start is null or actual_finish is null or actual_finish >= actual_start)
);
create table public.sentinel_audit_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.sentinel_projects(id),
  actor_id uuid not null references auth.users(id),
  action text not null check (action in ('event_captured','actual_verified')),
  record_id uuid not null,
  detail jsonb not null,
  created_at timestamptz not null default now()
);
create index sentinel_membership_user on public.sentinel_memberships(user_id,project_id) where active;
create index sentinel_pending_events on public.sentinel_events(project_id,created_at) where review_status = 'pending';
create index sentinel_audit_project_time on public.sentinel_audit_events(project_id,created_at);

-- RLS helper only reveals the caller's own membership, never another user's role.
create function public.sentinel_current_role(p_project uuid) returns text
language sql stable security definer set search_path = '' as $$
  select m.role from public.sentinel_memberships m
  where m.project_id = p_project and m.user_id = auth.uid() and m.active;
$$;

-- Lock membership during a write so revocation and an approval cannot race.
create function public.sentinel_require_role(p_project uuid, p_roles text[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := auth.uid(); v_role text;
begin
  if v_actor is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select m.role into v_role from public.sentinel_memberships m
    where m.project_id=p_project and m.user_id=v_actor and m.active for share;
  if v_role is null or not (v_role = any(p_roles)) then
    raise exception 'project_permission_denied' using errcode='42501';
  end if;
  return v_actor;
end;
$$;

create function public.sentinel_capture_manual(
  p_project uuid, p_request_key uuid, p_report_date date, p_text text,
  p_event_type text, p_actual_date date, p_source_quote text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid; v_payload jsonb; v_report public.sentinel_reports%rowtype; v_event uuid;
begin
  v_actor := public.sentinel_require_role(p_project,array['site-supervisor','discipline-engineer','planner','project-controls']);
  if p_request_key is null or p_report_date is null or p_text is null or p_source_quote is null
     or length(btrim(p_text)) not between 1 and 50000
     or length(btrim(p_source_quote)) not between 1 and 50000
     or strpos(p_text,p_source_quote)=0
     or p_event_type is null or p_event_type not in ('start','finish','progress_observation')
     or (p_actual_date is not null and p_actual_date > p_report_date) then
    raise exception 'invalid_capture_or_unsupported_evidence' using errcode='22023';
  end if;
  v_payload := jsonb_build_object('report_date',p_report_date,'text',p_text,
    'event_type',p_event_type,'actual_date',p_actual_date,'source_quote',p_source_quote);
  -- Unique constraint serializes concurrent retries without creating extra reports.
  insert into public.sentinel_reports(project_id,submitted_by,capture_key,report_date,raw_text,capture_payload)
    values(p_project,v_actor,p_request_key,p_report_date,p_text,v_payload)
    on conflict (project_id,submitted_by,capture_key) do nothing returning * into v_report;
  if v_report.id is null then
    select * into strict v_report from public.sentinel_reports
      where project_id=p_project and submitted_by=v_actor and capture_key=p_request_key;
    if v_report.capture_payload is distinct from v_payload then
      raise exception 'idempotency_key_reused_with_different_input' using errcode='22023';
    end if;
    select id into strict v_event from public.sentinel_events where report_id=v_report.id and event_index=1;
    return v_event;
  end if;
  insert into public.sentinel_events(project_id,report_id,event_type,actual_date,source_quote)
    values(p_project,v_report.id,p_event_type,p_actual_date,p_source_quote) returning id into v_event;
  insert into public.sentinel_audit_events(project_id,actor_id,action,record_id,detail)
    values(p_project,v_actor,'event_captured',v_event,jsonb_build_object('report_id',v_report.id,'method','manual'));
  return v_event;
end;
$$;

create function public.sentinel_approve_actual(
  p_project uuid, p_event uuid, p_activity uuid, p_expected_revision integer,
  p_request_key uuid, p_reason text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid; v_event public.sentinel_events%rowtype;
  v_previous public.sentinel_review_decisions%rowtype;
  v_activity public.sentinel_activities%rowtype;
  v_actual public.sentinel_schedule_actuals%rowtype;
  v_schedule uuid; v_decision uuid;
begin
  v_actor := public.sentinel_require_role(p_project,array['planner','project-controls']);
  if p_request_key is null or p_event is null or p_activity is null or p_expected_revision is null
     or p_reason is null or length(btrim(p_reason)) not between 1 and 2000 then
    raise exception 'invalid_approval_request' using errcode='22023';
  end if;
  select * into v_event from public.sentinel_events
    where id=p_event and project_id=p_project for update;
  if not found then raise exception 'event_not_found' using errcode='P0002'; end if;
  select * into v_previous from public.sentinel_review_decisions where actor_id=v_actor and request_key=p_request_key;
  if found then
    if v_previous.project_id is distinct from p_project or v_previous.event_id is distinct from p_event
       or v_previous.activity_id is distinct from p_activity or v_previous.expected_revision is distinct from p_expected_revision
       or v_previous.reason is distinct from p_reason then
      raise exception 'idempotency_key_reused_with_different_input' using errcode='22023';
    end if;
    return v_previous.id;
  end if;
  if v_event.revision <> p_expected_revision or v_event.review_status <> 'pending' then
    raise exception 'stale_or_already_reviewed_event' using errcode='40001';
  end if;
  if v_event.event_type not in ('start','finish') or v_event.actual_date is null then
    raise exception 'actual_date_not_supported' using errcode='22023';
  end if;
  select active_schedule_id into v_schedule from public.sentinel_projects where id=p_project for share;
  -- Serialize all updates for an activity, including when no actuals row exists yet.
  select * into v_activity from public.sentinel_activities where id=p_activity and project_id=p_project for update;
  if not found then raise exception 'activity_not_found_in_project' using errcode='P0002'; end if;
  if v_activity.schedule_version_id is distinct from v_schedule then
    raise exception 'schedule_version_is_stale' using errcode='40001';
  end if;
  -- First release writes L6 actuals only. L5 rollups need separate tested rules.
  if v_activity.level <> 'L6' then raise exception 'granularity_requires_review' using errcode='22023'; end if;
  select * into v_actual from public.sentinel_schedule_actuals where project_id=p_project and activity_id=p_activity;
  if (v_event.event_type='start' and v_actual.actual_start is not null)
     or (v_event.event_type='finish' and v_actual.actual_finish is not null) then
    raise exception 'existing_actual_requires_conflict_or_duplicate_review' using errcode='23505';
  end if;
  if (v_event.event_type='start' and v_actual.actual_finish is not null and v_event.actual_date > v_actual.actual_finish)
     or (v_event.event_type='finish' and v_actual.actual_start is not null and v_event.actual_date < v_actual.actual_start) then
    raise exception 'finish_before_start' using errcode='22023';
  end if;
  -- Even a pending contradicting report linked by a human must be resolved later.
  -- This foundation never overwrites a previously verified date.
  insert into public.sentinel_review_decisions(project_id,event_id,activity_id,actor_id,request_key,expected_revision,event_type,actual_date,reason)
    values(p_project,p_event,p_activity,v_actor,p_request_key,p_expected_revision,v_event.event_type,v_event.actual_date,p_reason)
    returning id into v_decision;
  insert into public.sentinel_schedule_actuals(project_id,activity_id) values(p_project,p_activity)
    on conflict (project_id,activity_id) do nothing;
  if v_event.event_type='start' then
    update public.sentinel_schedule_actuals set actual_start=v_event.actual_date,start_decision_id=v_decision
      where project_id=p_project and activity_id=p_activity;
  else
    update public.sentinel_schedule_actuals set actual_finish=v_event.actual_date,finish_decision_id=v_decision
      where project_id=p_project and activity_id=p_activity;
  end if;
  update public.sentinel_events set review_status='verified',revision=revision+1 where id=p_event;
  insert into public.sentinel_audit_events(project_id,actor_id,action,record_id,detail)
    values(p_project,v_actor,'actual_verified',p_event,jsonb_build_object(
      'decision_id',v_decision,'activity_id',p_activity,'event_type',v_event.event_type,
      'actual_date',v_event.actual_date,'previous_actual_start',v_actual.actual_start,
      'previous_actual_finish',v_actual.actual_finish,'reason',p_reason));
  return v_decision;
end;
$$;

-- Secure all tables explicitly; Supabase legacy default grants are not trusted.
do $$
declare t text;
begin
  foreach t in array array['sentinel_schema_versions','sentinel_projects','sentinel_memberships',
    'sentinel_schedule_versions','sentinel_activities','sentinel_reports','sentinel_events',
    'sentinel_review_decisions','sentinel_schedule_actuals','sentinel_audit_events'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    if t <> 'sentinel_schema_versions' then
      execute format('grant select on public.%I to authenticated',t);
    end if;
  end loop;
end $$;
create policy sentinel_projects_read on public.sentinel_projects for select to authenticated
  using (public.sentinel_current_role(id) is not null);
create policy sentinel_memberships_read on public.sentinel_memberships for select to authenticated
  using (user_id=(select auth.uid()) and active);
do $$
declare t text;
begin
  foreach t in array array['sentinel_schedule_versions','sentinel_activities','sentinel_reports',
    'sentinel_events','sentinel_review_decisions','sentinel_schedule_actuals'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.sentinel_current_role(project_id) is not null)',t||'_read',t);
  end loop;
end $$;
create policy sentinel_audit_read on public.sentinel_audit_events for select to authenticated
  using (public.sentinel_current_role(project_id) in ('planner','project-controls','administrator'));

revoke all on function public.sentinel_current_role(uuid) from public,anon,authenticated;
revoke all on function public.sentinel_require_role(uuid,text[]) from public,anon,authenticated;
revoke all on function public.sentinel_capture_manual(uuid,uuid,date,text,text,date,text) from public,anon,authenticated;
revoke all on function public.sentinel_approve_actual(uuid,uuid,uuid,integer,uuid,text) from public,anon,authenticated;
grant execute on function public.sentinel_current_role(uuid) to authenticated;
grant execute on function public.sentinel_capture_manual(uuid,uuid,date,text,text,date,text) to authenticated;
grant execute on function public.sentinel_approve_actual(uuid,uuid,uuid,integer,uuid,text) to authenticated;

insert into public.sentinel_schema_versions(version) values ('001_manual_reconciliation');
commit;
