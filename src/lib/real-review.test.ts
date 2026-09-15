import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { ProposedEvent, ScheduleActivity, ScheduleActual } from './connected-types.ts'
import {
  buildApprovalInput, canReviewActual, eligibleL6Activities, eventsWithStatus,
  eventReviewBlockReason, resolveApprovalRequest,
} from './real-review.ts'

const event: ProposedEvent = {
  id: 'event-1', project_id: 'project-1', report_id: 'report-1', event_type: 'start',
  actual_date: '2026-08-25', source_quote: 'P-205 alignment started', revision: 4,
  review_status: 'pending', report: { report_date: '2026-08-30', raw_text: 'P-205 alignment started on site.' },
}
const l6: ScheduleActivity = {
  id: 'activity-1', project_id: 'project-1', schedule_version_id: 'version-1',
  external_id: 'SYN-L6-P205', parent_id: null, level: 'L6', name: 'Pump P-205 alignment',
  discipline: 'Rotating Equipment', area: 'Utility Block', equipment_ref: 'P-205',
  planned_start: '2026-08-25', planned_finish: '2026-08-30',
}
const emptyActuals: ScheduleActual[] = []

test('queue filtering uses only real pending and verified statuses', () => {
  const verified = { ...event, id: 'event-2', review_status: 'verified' as const }
  assert.deepEqual(eventsWithStatus([event, verified], 'pending').map(value => value.id), ['event-1'])
  assert.deepEqual(eventsWithStatus([event, verified], 'verified').map(value => value.id), ['event-2'])
})

test('review capability follows backend membership roles', () => {
  assert.equal(canReviewActual('administrator'), true)
  assert.equal(canReviewActual('planner'), true)
  assert.equal(canReviewActual('site-supervisor'), false)
  assert.equal(canReviewActual('project-manager'), false)
})

test('only real eligible L6 activities are selectable', () => {
  const l5 = { ...l6, id: 'activity-l5', level: 'L5' as const }
  const existing = [{ project_id: 'project-1', activity_id: l6.id, actual_start: '2026-08-24', actual_finish: null, start_decision_id: 'decision-1', finish_decision_id: null }]
  assert.deepEqual(eligibleL6Activities(event, [l5, l6], emptyActuals).map(value => value.id), [l6.id])
  assert.deepEqual(eligibleL6Activities(event, [l6], existing), [])
})

test('unsupported and undated events never fabricate approval eligibility', () => {
  assert.match(eventReviewBlockReason({ ...event, event_type: 'progress_observation' }) ?? '', /cannot create/)
  assert.match(eventReviewBlockReason({ ...event, actual_date: null }) ?? '', /required/)
  assert.deepEqual(eligibleL6Activities({ ...event, actual_date: null }, [l6], emptyActuals), [])
})

test('approval payload preserves event revision and explicit human input', () => {
  const input = buildApprovalInput(event, { activity_id: l6.id, reason: 'Human verified evidence.' }, 'request-1')
  assert.equal(input.expected_revision, 4)
  assert.equal(input.activity_id, l6.id)
  assert.equal(input.reason, 'Human verified evidence.')
})

test('unchanged approval retries reuse a request key and changed decisions do not', () => {
  let count = 0
  const createKey = () => `request-${++count}`
  const draft = { activity_id: l6.id, reason: 'Human verified evidence.' }
  const first = resolveApprovalRequest(null, event, draft, createKey)
  const retry = resolveApprovalRequest(first, event, draft, createKey)
  const changed = resolveApprovalRequest(retry, event, { ...draft, reason: 'Different human reason.' }, createKey)
  assert.equal(first.key, retry.key)
  assert.notEqual(first.key, changed.key)
  assert.equal(count, 2)
})
