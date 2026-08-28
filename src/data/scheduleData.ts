export type ScheduleStatus =
  | 'not-started'
  | 'in-progress'
  | 'started-late'
  | 'finished-late'
  | 'needs-review'
  | 'missing-actual'
  | 'conflict'
  | 'complete'

export type TrustLevel = 'verified' | 'ai-suggested' | 'conflict' | 'unverified' | 'missing'

export const STATUS_CONFIG: Record<ScheduleStatus, { label: string; color: string; bg: string }> = {
  'not-started':    { label: 'Not Started',    color: 'var(--c-muted)',   bg: 'var(--c-border)' },
  'in-progress':    { label: 'In Progress',    color: '#2563EB',           bg: 'rgba(37,99,235,0.10)' },
  'started-late':   { label: 'Started Late',   color: '#D97706',           bg: 'rgba(217,119,6,0.12)' },
  'finished-late':  { label: 'Finished Late',  color: '#D97706',           bg: 'rgba(217,119,6,0.12)' },
  'needs-review':   { label: 'Needs Review',   color: '#7C3AED',           bg: 'rgba(124,58,237,0.10)' },
  'missing-actual': { label: 'Missing Actual', color: 'var(--c-subtle)',  bg: 'var(--c-border)' },
  'conflict':       { label: 'Conflict',       color: '#DC2626',           bg: 'rgba(220,38,38,0.10)' },
  'complete':       { label: 'Complete',       color: '#16A34A',           bg: 'rgba(22,163,74,0.10)' },
}

export const TRUST_CONFIG: Record<TrustLevel, { label: string; color: string; bg: string }> = {
  'verified':     { label: 'Verified',      color: '#16A34A',           bg: 'rgba(22,163,74,0.10)' },
  'ai-suggested': { label: 'AI Suggested',  color: '#D97706',           bg: 'rgba(245,158,11,0.10)' },
  'conflict':     { label: 'Conflict',      color: '#DC2626',           bg: 'rgba(220,38,38,0.10)' },
  'unverified':   { label: 'Unverified',    color: 'var(--c-muted)',   bg: 'var(--c-border)' },
  'missing':      { label: 'Not reported',  color: 'var(--c-subtle)',  bg: 'transparent' },
}

export interface LinkedActual {
  id: string
  event: string
  date: string
  source: string
  status: 'verified' | 'pending' | 'ai-suggested'
  reviewedBy?: string
}

export interface MatchEvent {
  timestamp: string
  event: string
  detail?: string
  by?: string
}

export interface FieldContext {
  text: string
  source: string
  reportedDate: string
  reportedTime: string
  trust: TrustLevel
}

export interface ScheduleActivity {
  id: string
  label: string
  level: 'L3' | 'L4' | 'L5' | 'L6'
  discipline: string
  area: string
  plannedStart: string | null
  plannedFinish: string | null
  actualStart: string | null
  actualStartConflict?: string[]
  actualFinish: string | null
  startVarianceDays: number | null
  finishVarianceDays: number | null
  status: ScheduleStatus
  trust: TrustLevel
  isGroup?: boolean
  children?: ScheduleActivity[]
  latestFieldContext?: FieldContext
  linkedActuals?: LinkedActual[]
  matchHistory?: MatchEvent[]
  dataTrust?: {
    scheduleMatch: string
    matchConfidence: number
    reviewedBy: string
    reviewDate: string
    sourceEvidence: string
  }
  scheduleUpdate?: {
    field: string
    oldValue: string
    newValue: string
    status: string
    updatedDate: string
    updatedTime: string
  }
  auditEvents?: { timestamp: string; event: string; detail?: string; by?: string }[]
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [, m, d] = iso.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d} ${months[m - 1]}`
}

export function fmtDateLong(iso: string | null | undefined): string {
  if (!iso) return 'Not reported'
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d} ${months[m - 1]} ${y}`
}

export const scheduleTree: ScheduleActivity[] = [
  {
    id: 'piping-works',
    label: 'PIPING WORKS',
    level: 'L3',
    discipline: 'Piping',
    area: 'Multiple',
    plannedStart: '2026-08-18',
    plannedFinish: '2026-09-05',
    actualStart: '2026-08-26',
    actualFinish: null,
    startVarianceDays: null,
    finishVarianceDays: null,
    status: 'in-progress',
    trust: 'verified',
    isGroup: true,
    children: [
      {
        id: 'area-b-piping',
        label: 'AREA B PIPING',
        level: 'L5',
        discipline: 'Piping',
        area: 'Area B',
        plannedStart: '2026-08-20',
        plannedFinish: '2026-09-05',
        actualStart: '2026-08-26',
        actualFinish: null,
        startVarianceDays: null,
        finishVarianceDays: null,
        status: 'in-progress',
        trust: 'verified',
        isGroup: true,
        children: [
          {
            id: 'erect-line-24-xx',
            label: 'ERECT LINE 24-XX',
            level: 'L6',
            discipline: 'Piping',
            area: 'Area B',
            plannedStart: '2026-08-24',
            plannedFinish: '2026-08-30',
            actualStart: '2026-08-26',
            actualFinish: null,
            startVarianceDays: 2,
            finishVarianceDays: null,
            status: 'started-late',
            trust: 'verified',
            latestFieldContext: {
              text: 'Spool erected in Area B. Final bolt tightening pending.',
              source: 'Supervisor Update',
              reportedDate: '26 Aug 2026',
              reportedTime: '08:42',
              trust: 'verified',
            },
            linkedActuals: [
              {
                id: 'ACT-2026-0842',
                event: 'Actual Start',
                date: '26 Aug 2026',
                source: 'Supervisor Update',
                status: 'verified',
                reviewedBy: 'Arjun Mehta',
              },
            ],
            dataTrust: {
              scheduleMatch: 'Verified',
              matchConfidence: 91,
              reviewedBy: 'Arjun Mehta',
              reviewDate: '28 Aug 2026',
              sourceEvidence: 'Available',
            },
            matchHistory: [
              { timestamp: '26 Aug 08:42', event: 'Actual captured', detail: 'ACT-2026-0842' },
              { timestamp: '26 Aug 08:43', event: 'SENTINEL suggested', detail: 'ERECT LINE 24-XX · 91%' },
              { timestamp: '28 Aug 10:44', event: 'Match verified', by: 'Arjun Mehta' },
            ],
            scheduleUpdate: {
              field: 'Actual Start',
              oldValue: '—',
              newValue: '26 Aug 2026',
              status: 'Applied',
              updatedDate: '28 Aug 2026',
              updatedTime: '10:44',
            },
            auditEvents: [
              { timestamp: '28 Aug · 10:44', event: 'Match verified', by: 'Arjun Mehta' },
              { timestamp: '28 Aug · 10:44', event: 'Actual Start updated', detail: '26 Aug 2026' },
            ],
          },
          {
            id: 'install-pipe-support-24-xx',
            label: 'INSTALL PIPE SUPPORT 24-XX',
            level: 'L6',
            discipline: 'Piping',
            area: 'Area B',
            plannedStart: '2026-08-28',
            plannedFinish: '2026-09-03',
            actualStart: null,
            actualFinish: null,
            startVarianceDays: null,
            finishVarianceDays: null,
            status: 'not-started',
            trust: 'missing',
          },
          {
            id: 'hydrotest-line-24-xx',
            label: 'HYDROTEST LINE 24-XX',
            level: 'L6',
            discipline: 'Piping',
            area: 'Area B',
            plannedStart: '2026-09-01',
            plannedFinish: '2026-09-05',
            actualStart: null,
            actualFinish: null,
            startVarianceDays: null,
            finishVarianceDays: null,
            status: 'not-started',
            trust: 'missing',
          },
        ],
      },
    ],
  },
  {
    id: 'rotating-equipment',
    label: 'ROTATING EQUIPMENT',
    level: 'L3',
    discipline: 'Rotating Equipment',
    area: 'Utility Block',
    plannedStart: '2026-08-24',
    plannedFinish: '2026-09-08',
    actualStart: null,
    actualFinish: null,
    startVarianceDays: null,
    finishVarianceDays: null,
    status: 'in-progress',
    trust: 'conflict',
    isGroup: true,
    children: [
      {
        id: 'utility-block-group',
        label: 'UTILITY BLOCK',
        level: 'L5',
        discipline: 'Rotating Equipment',
        area: 'Utility Block',
        plannedStart: '2026-08-24',
        plannedFinish: '2026-09-08',
        actualStart: null,
        actualFinish: null,
        startVarianceDays: null,
        finishVarianceDays: null,
        status: 'in-progress',
        trust: 'conflict',
        isGroup: true,
        children: [
          {
            id: 'equipment-alignment-p204',
            label: 'EQUIPMENT ALIGNMENT — P-204',
            level: 'L6',
            discipline: 'Rotating Equipment',
            area: 'Utility Block',
            plannedStart: '2026-08-27',
            plannedFinish: '2026-08-29',
            actualStart: null,
            actualStartConflict: ['2026-08-26', '2026-08-27'],
            actualFinish: null,
            startVarianceDays: null,
            finishVarianceDays: null,
            status: 'conflict',
            trust: 'conflict',
          },
          {
            id: 'p204-installation',
            label: 'P-204 INSTALLATION',
            level: 'L6',
            discipline: 'Rotating Equipment',
            area: 'Utility Block',
            plannedStart: '2026-08-24',
            plannedFinish: '2026-08-27',
            actualStart: '2026-08-24',
            actualFinish: null,
            startVarianceDays: 0,
            finishVarianceDays: null,
            status: 'in-progress',
            trust: 'verified',
          },
          {
            id: 'p204-commissioning',
            label: 'P-204 COMMISSIONING',
            level: 'L6',
            discipline: 'Rotating Equipment',
            area: 'Utility Block',
            plannedStart: '2026-08-30',
            plannedFinish: '2026-09-04',
            actualStart: null,
            actualFinish: null,
            startVarianceDays: null,
            finishVarianceDays: null,
            status: 'not-started',
            trust: 'missing',
          },
        ],
      },
    ],
  },
  {
    id: 'civil-works',
    label: 'CIVIL WORKS',
    level: 'L3',
    discipline: 'Civil',
    area: 'Multiple',
    plannedStart: '2026-08-20',
    plannedFinish: '2026-08-26',
    actualStart: null,
    actualFinish: null,
    startVarianceDays: null,
    finishVarianceDays: null,
    status: 'needs-review',
    trust: 'ai-suggested',
    isGroup: true,
    children: [
      {
        id: 'foundation-block-c14',
        label: 'FOUNDATION BLOCK C-14',
        level: 'L6',
        discipline: 'Civil',
        area: 'Area A',
        plannedStart: '2026-08-20',
        plannedFinish: '2026-08-26',
        actualStart: null,
        actualFinish: null,
        startVarianceDays: null,
        finishVarianceDays: null,
        status: 'needs-review',
        trust: 'ai-suggested',
      },
    ],
  },
  {
    id: 'electrical',
    label: 'ELECTRICAL',
    level: 'L3',
    discipline: 'Electrical',
    area: 'Utility Block',
    plannedStart: '2026-08-25',
    plannedFinish: '2026-08-31',
    actualStart: null,
    actualFinish: null,
    startVarianceDays: null,
    finishVarianceDays: null,
    status: 'missing-actual',
    trust: 'missing',
    isGroup: true,
    children: [
      {
        id: 'cable-tray-installation',
        label: 'CABLE TRAY INSTALLATION — UTILITY BLOCK',
        level: 'L6',
        discipline: 'Electrical',
        area: 'Utility Block',
        plannedStart: '2026-08-25',
        plannedFinish: '2026-08-31',
        actualStart: null,
        actualFinish: null,
        startVarianceDays: null,
        finishVarianceDays: null,
        status: 'missing-actual',
        trust: 'missing',
      },
    ],
  },
]

export function flattenTree(
  activities: ScheduleActivity[],
  expandedIds: Set<string>,
  depth = 0
): { activity: ScheduleActivity; depth: number; hasChildren: boolean; isExpanded: boolean }[] {
  const rows: { activity: ScheduleActivity; depth: number; hasChildren: boolean; isExpanded: boolean }[] = []
  for (const activity of activities) {
    const hasChildren = !!(activity.children && activity.children.length > 0)
    const isExpanded = expandedIds.has(activity.id)
    rows.push({ activity, depth, hasChildren, isExpanded })
    if (hasChildren && isExpanded) {
      rows.push(...flattenTree(activity.children!, expandedIds, depth + 1))
    }
  }
  return rows
}

export function flattenAll(tree: ScheduleActivity[]): ScheduleActivity[] {
  const result: ScheduleActivity[] = []
  function traverse(items: ScheduleActivity[]) {
    for (const item of items) {
      result.push(item)
      if (item.children) traverse(item.children)
    }
  }
  traverse(tree)
  return result
}

export function findActivity(id: string): ScheduleActivity | undefined {
  return flattenAll(scheduleTree).find((a) => a.id === id)
}

export function getAllGroupIds(tree: ScheduleActivity[]): Set<string> {
  const ids = new Set<string>()
  function traverse(items: ScheduleActivity[]) {
    for (const item of items) {
      if (item.isGroup) ids.add(item.id)
      if (item.children) traverse(item.children)
    }
  }
  traverse(tree)
  return ids
}

export const defaultExpandedIds = getAllGroupIds(scheduleTree)
