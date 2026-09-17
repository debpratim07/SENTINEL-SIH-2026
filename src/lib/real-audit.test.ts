import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AuditItem } from './connected-types.ts'
import { auditActionLabel, auditDetailFields, canViewAudit, filterAudit, formatAuditTimestamp, projectAudit } from './real-audit.ts'

const capture: AuditItem = { id: 'a1', project_id: 'p1', actor_id: 'u1', action: 'event_captured', record_id: 'e1', detail: { report_id: 'r1', method: 'manual' }, created_at: '2026-08-30T10:00:00Z' }
const approval: AuditItem = { id: 'a2', project_id: 'p1', actor_id: 'u2', action: 'actual_verified', record_id: 'e2', detail: { decision_id: 'd1', activity_id: 'act1', actual_date: '2026-08-25', previous_actual_finish: null, reason: 'Evidence checked.' }, created_at: '2026-08-31T10:00:00Z' }

test('audit visibility follows the existing backend roles only', () => {
  assert.equal(canViewAudit('administrator'), true); assert.equal(canViewAudit('planner'), true); assert.equal(canViewAudit('project-controls'), true)
  assert.equal(canViewAudit('site-supervisor'), false); assert.equal(canViewAudit('project-manager'), false); assert.equal(canViewAudit(null), false)
})

test('audit mapping is project scoped and has only real action labels', () => {
  assert.deepEqual(projectAudit('p1', [capture, { ...capture, id: 'a3', project_id: 'p2' }]).map(item => item.id), ['a1'])
  assert.equal(auditActionLabel('event_captured'), 'Field Event Captured')
  assert.equal(auditActionLabel('actual_verified'), 'Actual Verified')
  assert.equal(auditActionLabel('membership_changed'), 'Membership Changed')
  assert.equal(auditActionLabel('report_ingested'), 'Report Ingested')
})

test('detail rendering orders known real fields and safely omits nested values', () => {
  const fields = auditDetailFields({ reason: 'Checked', decision_id: 'd1', previous_actual_start: null, nested: { confidence: 99 }, count: 2 })
  assert.deepEqual(fields.map(field => field.label), ['Decision ID', 'Previous actual start', 'Human review reason', 'Count'])
  assert.equal(fields.find(field => field.label === 'Previous actual start')?.value, 'Not previously reported')
  assert.equal(fields.some(field => field.key === 'nested'), false)
})

test('search, action and date filters operate only on persisted audit values', () => {
  assert.deepEqual(filterAudit([capture, approval], 'Evidence checked', '', '').map(item => item.id), ['a2'])
  assert.deepEqual(filterAudit([capture, approval], '', 'event_captured', '').map(item => item.id), ['a1'])
  assert.deepEqual(filterAudit([capture, approval], '', '', '2026-08-31').map(item => item.id), ['a2'])
  assert.deepEqual(filterAudit([], '', '', ''), [])
})

test('timestamps use real instants and invalid values remain visible', () => {
  assert.match(formatAuditTimestamp(capture.created_at, 'UTC'), /30 Aug 2026/)
  assert.equal(formatAuditTimestamp('not-a-time', 'UTC'), 'not-a-time')
})
