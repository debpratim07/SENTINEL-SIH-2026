import { test } from 'node:test'
import assert from 'node:assert/strict'
import { activeAdministratorCount, canManageTeam, connectedOverview, isExactAccountEmail, PRIMARY_CONNECTED_ROUTES, wouldRemoveLastAdministrator } from './real-admin.ts'
import type { ManagedProjectMember, ProjectWorkspaceResponse } from './connected-types.ts'

const admin: ManagedProjectMember={user_id:'a',email:'admin@example.com',role:'administrator',active:true}
test('team management is administrator-only and validates exact account email',()=>{
  assert.equal(canManageTeam('administrator'),true); assert.equal(canManageTeam('planner'),false)
  assert.equal(isExactAccountEmail(' person@example.com '),true); assert.equal(isExactAccountEmail('person'),false)
})
test('last active administrator guard is deterministic',()=>{
  assert.equal(activeAdministratorCount([admin]),1)
  assert.equal(wouldRemoveLastAdministrator(admin,'planner',true,[admin]),true)
  assert.equal(wouldRemoveLastAdministrator(admin,'administrator',false,[admin]),true)
  assert.equal(wouldRemoveLastAdministrator(admin,'administrator',true,[admin]),false)
})
test('connected overview uses persisted workspace values only',()=>{
  const workspace={activities:[{}],events:[{review_status:'pending'},{review_status:'verified'}],actuals:[{actual_start:'2026-01-01',actual_finish:null},{actual_start:null,actual_finish:null}],audit:[{},{}]} as ProjectWorkspaceResponse
  assert.deepEqual(connectedOverview(workspace,true),{activities:1,pendingEvents:1,verifiedEvents:1,actualBearingActivities:1,recentAudit:2})
  assert.equal(connectedOverview(workspace,false).recentAudit,null)
})
test('primary navigation contains connected product routes only',()=>{
  assert.deepEqual([...PRIMARY_CONNECTED_ROUTES],['dashboard','reports','actuals','schedule','review-queue','exceptions','performance','data-quality','execution-knowledge','integrations','audit-log','admin'])
  for(const route of ['prototype','mock-reports','exec-knowledge']) assert.equal(PRIMARY_CONNECTED_ROUTES.includes(route as never),false)
})
