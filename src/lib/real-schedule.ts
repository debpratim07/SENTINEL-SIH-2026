import type { ScheduleActivity, ScheduleActual } from './connected-types'

export type ScheduleDisplayStatus = 'Completed' | 'Started' | 'Not started'

export interface ConnectedScheduleRow extends ScheduleActivity {
  actual: ScheduleActual | null
  status: ScheduleDisplayStatus
  children: ConnectedScheduleRow[]
}

export interface VerifiedActualRow {
  id: string
  activity: ScheduleActivity
  actual: ScheduleActual
}

export function scheduleStatus(actual: ScheduleActual | null | undefined): ScheduleDisplayStatus {
  if (actual?.actual_finish) return 'Completed'
  if (actual?.actual_start) return 'Started'
  return 'Not started'
}

export function joinSchedule(
  projectId: string,
  activities: ScheduleActivity[],
  actuals: ScheduleActual[],
): ConnectedScheduleRow[] {
  const scopedActivities = activities.filter(activity => activity.project_id === projectId)
  const scopedIds = new Set(scopedActivities.map(activity => activity.id))
  const actualByActivity = new Map(
    actuals
      .filter(actual => actual.project_id === projectId && scopedIds.has(actual.activity_id))
      .map(actual => [actual.activity_id, actual]),
  )
  const rows = new Map<string, ConnectedScheduleRow>(scopedActivities.map(activity => [activity.id, {
    ...activity,
    actual: actualByActivity.get(activity.id) ?? null,
    status: scheduleStatus(actualByActivity.get(activity.id)),
    children: [],
  }]))

  const roots: ConnectedScheduleRow[] = []
  for (const activity of scopedActivities) {
    const row = rows.get(activity.id)!
    const parent = activity.parent_id ? rows.get(activity.parent_id) : undefined
    if (parent && activity.level === 'L6') parent.children.push(row)
    else roots.push(row)
  }
  return roots
}

export function flattenSchedule(rows: ConnectedScheduleRow[], expanded: Set<string>, depth = 0) {
  const result: Array<{ row: ConnectedScheduleRow; depth: number; hasChildren: boolean }> = []
  for (const row of rows) {
    const hasChildren = row.children.length > 0
    result.push({ row, depth, hasChildren })
    if (hasChildren && expanded.has(row.id)) result.push(...flattenSchedule(row.children, expanded, depth + 1))
  }
  return result
}

export function verifiedActualRows(
  projectId: string,
  activities: ScheduleActivity[],
  actuals: ScheduleActual[],
): VerifiedActualRow[] {
  const activityById = new Map(
    activities.filter(activity => activity.project_id === projectId).map(activity => [activity.id, activity]),
  )
  return actuals.flatMap(actual => {
    if (actual.project_id !== projectId || (!actual.actual_start && !actual.actual_finish)) return []
    const activity = activityById.get(actual.activity_id)
    return activity ? [{ id: activity.id, activity, actual }] : []
  })
}

export function displayDate(value: string | null | undefined) {
  if (!value) return 'Not reported'
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function timelineBounds(activities: ScheduleActivity[], actuals: ScheduleActual[]) {
  const dates = [
    ...activities.flatMap(activity => [activity.planned_start, activity.planned_finish]),
    ...actuals.flatMap(actual => [actual.actual_start, actual.actual_finish]),
  ].filter((value): value is string => Boolean(value)).sort()
  return dates.length ? { start: dates[0], finish: dates[dates.length - 1] } : null
}
