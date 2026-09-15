import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { ScheduleActivity, ScheduleActual } from './connected-types.ts'
import { joinSchedule, scheduleStatus, timelineBounds, verifiedActualRows } from './real-schedule.ts'

const l5: ScheduleActivity = { id: 'l5', project_id: 'p1', schedule_version_id: 'v1', external_id: 'L5-1', parent_id: null, level: 'L5', name: 'Parent', discipline: null, area: null, equipment_ref: null, planned_start: '2026-08-20', planned_finish: '2026-09-01' }
const l6: ScheduleActivity = { id: 'l6', project_id: 'p1', schedule_version_id: 'v1', external_id: 'L6-1', parent_id: 'l5', level: 'L6', name: 'Child', discipline: 'Piping', area: 'A', equipment_ref: null, planned_start: '2026-08-24', planned_finish: '2026-08-30' }
const other = { ...l6, id: 'other', project_id: 'p2', external_id: 'OTHER' }
const actual: ScheduleActual = { project_id: 'p1', activity_id: 'l6', actual_start: '2026-08-25', actual_finish: null, start_decision_id: 'd1', finish_decision_id: null }

test('schedule join is project scoped and preserves the real L5/L6 hierarchy', () => {
  const rows = joinSchedule('p1', [l5, l6, other], [actual])
  assert.deepEqual(rows.map(row => row.id), ['l5'])
  assert.deepEqual(rows[0].children.map(row => row.id), ['l6'])
  assert.equal(rows[0].actual, null)
  assert.equal(rows[0].children[0].actual?.actual_start, '2026-08-25')
})

test('display status is derived only from persisted actual values', () => {
  assert.equal(scheduleStatus(null), 'Not started')
  assert.equal(scheduleStatus(actual), 'Started')
  assert.equal(scheduleStatus({ ...actual, actual_finish: '2026-08-30' }), 'Completed')
})

test('verified actual list excludes empty, orphaned and wrong-project records', () => {
  const empty = { ...actual, activity_id: 'l5', actual_start: null }
  const orphan = { ...actual, activity_id: 'missing' }
  const wrongProject = { ...actual, project_id: 'p2' }
  assert.deepEqual(verifiedActualRows('p1', [l5, l6], [empty, orphan, wrongProject, actual]).map(row => row.id), ['l6'])
})

test('null finishes remain null and no L5 actual rollup is fabricated', () => {
  const rows = joinSchedule('p1', [l5, l6], [actual])
  assert.equal(rows[0].actual, null)
  assert.equal(rows[0].children[0].actual?.actual_finish, null)
})

test('timeline bounds use persisted dates without inventing missing values', () => {
  assert.deepEqual(timelineBounds([l6], [actual]), { start: '2026-08-24', finish: '2026-08-30' })
  assert.equal(timelineBounds([{ ...l6, planned_start: null, planned_finish: null }], [{ ...actual, actual_start: null }]), null)
})
