import type { ScheduleActivitySummary } from '@sentinel/domain'
import type { ScheduleActivity, ScheduleStatus, TrustLevel } from './scheduleData'

function safeGroupId(prefix: string, value: string): string {
  return `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
}

function earliest(values: Array<string | null>): string | null {
  return values.filter((value): value is string => Boolean(value)).sort()[0] ?? null
}

function latest(values: Array<string | null>): string | null {
  return values.filter((value): value is string => Boolean(value)).sort().at(-1) ?? null
}

function groupStatus(children: ScheduleActivity[]): ScheduleStatus {
  if (children.every((child) => child.status === 'complete')) return 'complete'
  if (children.some((child) => child.status === 'conflict')) return 'conflict'
  if (children.some((child) => child.status === 'needs-review')) return 'needs-review'
  if (children.some((child) => child.status !== 'not-started')) return 'in-progress'
  return 'not-started'
}

function groupTrust(children: ScheduleActivity[]): TrustLevel {
  if (children.some((child) => child.trust === 'conflict')) return 'conflict'
  if (children.some((child) => child.trust === 'verified')) return 'verified'
  if (children.every((child) => child.trust === 'missing')) return 'missing'
  return 'unverified'
}

function createGroup(
  id: string,
  label: string,
  level: 'L3' | 'L4',
  discipline: string,
  area: string,
  children: ScheduleActivity[],
): ScheduleActivity {
  return {
    id,
    label,
    level,
    discipline,
    area,
    plannedStart: earliest(children.map((child) => child.plannedStart)),
    plannedFinish: latest(children.map((child) => child.plannedFinish)),
    actualStart: earliest(children.map((child) => child.actualStart)),
    actualFinish: children.every((child) => child.actualFinish)
      ? latest(children.map((child) => child.actualFinish))
      : null,
    startVarianceDays: null,
    finishVarianceDays: null,
    status: groupStatus(children),
    trust: groupTrust(children),
    isGroup: true,
    children,
  }
}

export function scheduleResponseToTree(rows: ScheduleActivitySummary[]): ScheduleActivity[] {
  const byDiscipline = new Map<string, Map<string, ScheduleActivity[]>>()

  for (const row of rows) {
    const activity: ScheduleActivity = {
      id: row.id,
      label: row.name,
      level: row.level,
      discipline: row.discipline,
      area: row.area,
      plannedStart: row.plannedStart,
      plannedFinish: row.plannedFinish,
      actualStart: row.actualStart,
      actualFinish: row.actualFinish,
      startVarianceDays: row.startVarianceDays,
      finishVarianceDays: row.finishVarianceDays,
      status: row.status,
      trust: row.trust,
    }
    const areas = byDiscipline.get(row.discipline) ?? new Map<string, ScheduleActivity[]>()
    const activities = areas.get(row.area) ?? []
    activities.push(activity)
    areas.set(row.area, activities)
    byDiscipline.set(row.discipline, areas)
  }

  return [...byDiscipline.entries()].map(([discipline, areas]) => {
    const areaGroups = [...areas.entries()].map(([area, children]) => createGroup(
      safeGroupId('area', `${discipline}-${area}`),
      area.toUpperCase(),
      'L4',
      discipline,
      area,
      children,
    ))
    return createGroup(
      safeGroupId('discipline', discipline),
      discipline.toUpperCase(),
      'L3',
      discipline,
      areas.size === 1 ? [...areas.keys()][0]! : 'Multiple',
      areaGroups,
    )
  })
}

function csvCell(value: string | number | null): string {
  const text = value === null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function scheduleTreeToCsv(tree: ScheduleActivity[]): string {
  const columns = [
    'Activity', 'Level', 'Discipline', 'Area', 'Planned Start', 'Planned Finish',
    'Actual Start', 'Actual Finish', 'Start Variance Days', 'Finish Variance Days', 'Status', 'Trust',
  ]
  const rows = flattenLeaves(tree).map((activity) => [
    activity.label,
    activity.level,
    activity.discipline,
    activity.area,
    activity.plannedStart,
    activity.plannedFinish,
    activity.actualStart,
    activity.actualFinish,
    activity.startVarianceDays,
    activity.finishVarianceDays,
    activity.status,
    activity.trust,
  ])
  return [columns, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
}

function flattenLeaves(tree: ScheduleActivity[]): ScheduleActivity[] {
  return tree.flatMap((activity) => activity.isGroup ? flattenLeaves(activity.children ?? []) : [activity])
}
