// ─────────────────────────────────────────────────────────────────────────────
// Core project entities
// ─────────────────────────────────────────────────────────────────────────────
export const PROJECT = {
  name: 'Infrastructure Expansion',
  week: 'Week 34',
  reportDate: '28 Aug 2026',
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI strip
// ─────────────────────────────────────────────────────────────────────────────
export interface ProjectKPI {
  id: string
  label: string
  value: string
  sub1: string
  sub2: string
  sub2Color?: 'warning' | 'danger' | 'neutral'
}

export const projectKPIs: ProjectKPI[] = [
  {
    id: 'execution',
    label: 'EXECUTION',
    value: '68.4%',
    sub1: 'Plan 71.2%',
    sub2: '2.8% behind plan',
    sub2Color: 'warning',
  },
  {
    id: 'started-late',
    label: 'STARTED LATE',
    value: '23',
    sub1: '',
    sub2: '5 require attention',
    sub2Color: 'warning',
  },
  {
    id: 'finished-late',
    label: 'FINISHED LATE',
    value: '11',
    sub1: '',
    sub2: '3 over 5 days',
    sub2Color: 'warning',
  },
  {
    id: 'needs-review',
    label: 'NEEDS REVIEW',
    value: '7',
    sub1: '',
    sub2: '3 low confidence',
    sub2Color: 'neutral',
  },
  {
    id: 'exceptions',
    label: 'EXCEPTIONS',
    value: '3',
    sub1: '',
    sub2: '1 conflict',
    sub2Color: 'danger',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Plan vs Actual chart — verified actuals only
// ─────────────────────────────────────────────────────────────────────────────
export interface PlanVsActualPoint {
  date: string
  plan: number
  actual: number
}

export const planVsActualData: PlanVsActualPoint[] = [
  { date: 'Aug 1', plan: 38, actual: 40 },
  { date: 'Aug 8', plan: 49, actual: 50 },
  { date: 'Aug 15', plan: 58, actual: 57 },
  { date: 'Aug 22', plan: 65, actual: 63 },
  { date: 'Aug 28', plan: 71.2, actual: 68.4 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Needs Attention items
// ─────────────────────────────────────────────────────────────────────────────
export type AttentionType = 'late-start' | 'conflict' | 'missing' | 'review'

export interface AttentionItem {
  id: string
  type: AttentionType
  typeLabel: string
  entity: string
  reason: string
  discipline: string
  location: string
  action: string
}

export const attentionItems: AttentionItem[] = [
  {
    id: 'erect-line-24-xx',
    type: 'late-start',
    typeLabel: 'LATE START',
    entity: 'ERECT LINE 24-XX',
    reason: 'Started 2 days late',
    discipline: 'Piping',
    location: 'Area B',
    action: 'View',
  },
  {
    id: 'equipment-alignment-p204',
    type: 'conflict',
    typeLabel: 'CONFLICT',
    entity: 'EQUIPMENT ALIGNMENT — P-204',
    reason: 'Conflicting Actual Start',
    discipline: 'Rotating Equipment',
    location: 'Utility Block',
    action: 'Resolve',
  },
  {
    id: 'cable-tray-utility',
    type: 'missing',
    typeLabel: 'MISSING',
    entity: 'CABLE TRAY INSTALLATION — UTILITY BLOCK',
    reason: 'Actual Start missing',
    discipline: 'Electrical',
    location: '',
    action: 'Inspect',
  },
  {
    id: 'foundation-block-c14',
    type: 'review',
    typeLabel: 'REVIEW',
    entity: 'FOUNDATION BLOCK C-14',
    reason: 'Match requires review',
    discipline: 'Civil',
    location: '',
    action: 'Review',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Recent Execution entries (mix of verified and pending)
// ─────────────────────────────────────────────────────────────────────────────
export type ExecutionStatus = 'verified' | 'awaiting-review' | 'pending'

export interface ExecutionEntry {
  id: string
  activity: string
  captureType: string
  discipline: string
  area: string
  date: string
  status: ExecutionStatus
}

export const recentExecutions: ExecutionEntry[] = [
  {
    id: 'exec-1',
    activity: 'Spool erection',
    captureType: 'Actual Start',
    discipline: 'Piping',
    area: 'Area B',
    date: '26 Aug 2026',
    status: 'verified',
  },
  {
    id: 'exec-2',
    activity: 'Pump P-204 alignment',
    captureType: 'Actual Start',
    discipline: 'Rotating Equipment',
    area: '',
    date: '28 Aug 2026',
    status: 'awaiting-review',
  },
  {
    id: 'exec-3',
    activity: 'Foundation Block C-14',
    captureType: 'Actual Finish',
    discipline: 'Civil',
    area: '',
    date: '27 Aug 2026',
    status: 'verified',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Discipline Performance
// ─────────────────────────────────────────────────────────────────────────────
export interface DisciplineRow {
  name: string
  plan: number
  actual: number
  variance: number
}

export const disciplineData: DisciplineRow[] = [
  { name: 'Piping', plan: 69, actual: 64, variance: -5 },
  { name: 'Civil', plan: 74, actual: 72, variance: -2 },
  { name: 'Rotating Equipment', plan: 70, actual: 68, variance: -2 },
  { name: 'Electrical', plan: 73, actual: 75, variance: 2 },
  { name: 'Instrumentation', plan: 66, actual: 61, variance: -5 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Review Health
// ─────────────────────────────────────────────────────────────────────────────
export const reviewHealth = {
  total: 7,
  items: [
    { label: 'Pending Reviews', value: 7 },
    { label: 'Low Confidence', value: 3 },
    { label: 'Ambiguous', value: 2 },
    { label: 'Incomplete', value: 2 },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Quality
// ─────────────────────────────────────────────────────────────────────────────
export const dataQualityMetrics = [
  { label: 'Source Coverage', value: '94%', numeric: 94, good: true },
  { label: 'Match Confidence', value: '89%', numeric: 89, good: true },
  { label: 'Missing Fields', value: '4.2%', numeric: 4.2, good: false },
  { label: 'Unmatched Rate', value: '2.8%', numeric: 2.8, good: false },
]

// ─────────────────────────────────────────────────────────────────────────────
// Recent Changes audit log
// ─────────────────────────────────────────────────────────────────────────────
export type ChangeType = 'updated' | 'verified' | 'extracted' | 'created' | 'resolved'

export interface ChangeEntry {
  id: string
  time: string
  changeType: ChangeType
  changeLabel: string
  entity: string
  detail: string
  actor: string
  actorIsSystem: boolean
}

export const recentChanges: ChangeEntry[] = [
  {
    id: 'chg-1',
    time: '10:44',
    changeType: 'updated',
    changeLabel: 'Actual Start updated',
    entity: 'ERECT LINE 24-XX',
    detail: '— → 26 Aug',
    actor: 'Arjun Mehta',
    actorIsSystem: false,
  },
  {
    id: 'chg-2',
    time: '10:44',
    changeType: 'verified',
    changeLabel: 'Match verified',
    entity: 'ACT-2026-0842',
    detail: 'ERECT LINE 24-XX',
    actor: 'Arjun Mehta',
    actorIsSystem: false,
  },
  {
    id: 'chg-3',
    time: '08:42',
    changeType: 'extracted',
    changeLabel: 'Actual extracted',
    entity: 'Pump P-204 alignment',
    detail: '',
    actor: 'SENTINEL',
    actorIsSystem: true,
  },
]
