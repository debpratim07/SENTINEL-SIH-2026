export type ActualStatus =
  | 'verified'
  | 'ai-suggested'
  | 'needs-review'
  | 'incomplete'
  | 'unmatched'
  | 'conflicting'
  | 'awaiting-clarification'
  | 'duplicate'

export type ExceptionType = 'conflicting' | 'incomplete' | 'unmatched' | 'duplicate'

export type WorkflowStatus =
  | 'open'
  | 'under-review'
  | 'awaiting-clarification'
  | 'resolved'
  | 'kept-unmatched'
  | 'flagged-schedule-review'

export interface Actual {
  id: string
  activityName: string
  eventType: string
  discipline: string | null
  area: string | null
  date: string | null
  source: string
  scheduleLink: string | null
  scheduleLinkId?: string
  status: ActualStatus
  reviewedBy?: string
  confidence?: number
  exceptionId?: string
}

export interface Exception {
  id: string
  type: ExceptionType
  activityName: string
  actualId: string
  discipline: string | null
  area: string | null
  source: string
  workflowStatus: WorkflowStatus
  owner?: string
  scheduleCandidateName?: string
  scheduleCandidateId?: string
  scheduleActivityId?: string
  historicalConfidence?: number
}

export const ACTUALS: Actual[] = [
  {
    id: 'ACT-2026-0842',
    activityName: 'Spool erection',
    eventType: 'Actual Start',
    discipline: 'Piping',
    area: 'Area B',
    date: '26 Aug 2026',
    source: 'Supervisor Update',
    scheduleLink: 'ERECT LINE 24-XX',
    scheduleLinkId: 'erect-line-24-xx',
    status: 'verified',
    reviewedBy: 'Arjun Mehta',
    confidence: 91,
  },
  {
    id: 'ACT-2026-0851',
    activityName: 'Pump P-204 alignment',
    eventType: 'Actual Start',
    discipline: 'Rotating Equipment',
    area: 'Utility Block',
    date: null,
    source: 'Supervisor Update',
    scheduleLink: 'EQUIPMENT ALIGNMENT — P-204',
    scheduleLinkId: 'equipment-alignment-p204',
    status: 'conflicting',
    exceptionId: 'EXC-001',
  },
  {
    id: 'ACT-2026-0839',
    activityName: 'Foundation work',
    eventType: 'Actual Finish',
    discipline: 'Civil',
    area: null,
    date: '27 Aug 2026',
    source: 'Daily Progress Report',
    scheduleLink: 'FOUNDATION BLOCK C-14',
    scheduleLinkId: 'foundation-block-c14',
    status: 'needs-review',
    confidence: 72,
  },
  {
    id: 'ACT-2026-0855',
    activityName: 'Cable tray installation',
    eventType: 'Actual Start',
    discipline: 'Electrical',
    area: 'Utility Block',
    date: null,
    source: 'Supervisor Update',
    scheduleLink: 'CABLE TRAY INSTALLATION — UTILITY BLOCK',
    scheduleLinkId: 'cable-tray-installation',
    status: 'incomplete',
    exceptionId: 'EXC-004',
  },
  {
    id: 'ACT-2026-0860',
    activityName: 'Material shifting',
    eventType: 'Actual Start',
    discipline: null,
    area: 'Area B',
    date: '27 Aug 2026',
    source: 'Daily Progress Report',
    scheduleLink: null,
    status: 'unmatched',
    exceptionId: 'EXC-003',
  },
  {
    id: 'ACT-2026-0844',
    activityName: 'Welding work',
    eventType: 'Actual Start',
    discipline: 'Piping',
    area: null,
    date: '26 Aug 2026',
    source: 'Daily Progress Report',
    scheduleLink: null,
    status: 'awaiting-clarification',
    exceptionId: 'EXC-002',
  },
  {
    id: 'ACT-2026-0847',
    activityName: 'Insulation application',
    eventType: 'Actual Start',
    discipline: 'Piping',
    area: 'Area B',
    date: '25 Aug 2026',
    source: 'Supervisor Update',
    scheduleLink: 'INSULATE LINE 24-XX',
    status: 'ai-suggested',
    confidence: 76,
  },
  {
    id: 'ACT-2026-0849',
    activityName: 'Grounding installation',
    eventType: 'Actual Start',
    discipline: 'Electrical',
    area: 'Area B',
    date: '25 Aug 2026',
    source: 'Daily Progress Report',
    scheduleLink: 'GROUNDING — AREA B',
    status: 'verified',
    reviewedBy: 'Priya Nair',
    confidence: 88,
  },
  {
    id: 'ACT-2026-0858',
    activityName: 'Pump P-204 alignment',
    eventType: 'Actual Start',
    discipline: 'Rotating Equipment',
    area: 'Utility Block',
    date: '27 Aug 2026',
    source: 'Daily Progress Report',
    scheduleLink: 'EQUIPMENT ALIGNMENT — P-204',
    status: 'duplicate',
    exceptionId: 'EXC-005',
  },
]

export const EXCEPTIONS: Exception[] = [
  {
    id: 'EXC-001',
    type: 'conflicting',
    activityName: 'EQUIPMENT ALIGNMENT — P-204',
    actualId: 'ACT-2026-0851',
    discipline: 'Rotating Equipment',
    area: 'Utility Block',
    source: 'Multiple',
    workflowStatus: 'open',
    scheduleActivityId: 'equipment-alignment-p204',
  },
  {
    id: 'EXC-002',
    type: 'incomplete',
    activityName: 'Welding work started',
    actualId: 'ACT-2026-0844',
    discipline: 'Piping',
    area: null,
    source: 'Daily Progress Report',
    workflowStatus: 'awaiting-clarification',
    owner: 'Arjun Mehta',
  },
  {
    id: 'EXC-003',
    type: 'unmatched',
    activityName: 'Material shifting near Area B',
    actualId: 'ACT-2026-0860',
    discipline: null,
    area: 'Area B',
    source: 'Daily Progress Report',
    workflowStatus: 'open',
    scheduleCandidateName: 'MATERIAL HANDLING — AREA B',
    scheduleCandidateId: 'MAT-HANDLE-AREA-B',
    historicalConfidence: 58,
  },
  {
    id: 'EXC-004',
    type: 'incomplete',
    activityName: 'Cable tray installation',
    actualId: 'ACT-2026-0855',
    discipline: 'Electrical',
    area: 'Utility Block',
    source: 'Supervisor Update',
    workflowStatus: 'open',
    scheduleActivityId: 'cable-tray-installation',
  },
  {
    id: 'EXC-005',
    type: 'duplicate',
    activityName: 'Pump P-204 alignment',
    actualId: 'ACT-2026-0858',
    discipline: 'Rotating Equipment',
    area: 'Utility Block',
    source: 'Daily Progress Report',
    workflowStatus: 'open',
    scheduleActivityId: 'equipment-alignment-p204',
  },
]

export const ACTUAL_STATUS_CONFIG: Record<ActualStatus, { label: string; bg: string; color: string }> = {
  verified:                 { label: 'Verified',               bg: 'rgba(22,163,74,0.09)',   color: '#16A34A' },
  'ai-suggested':           { label: 'AI Suggested',           bg: 'rgba(124,58,237,0.09)',  color: '#7C3AED' },
  'needs-review':           { label: 'Needs Review',           bg: 'rgba(217,119,6,0.10)',   color: '#B45309' },
  incomplete:               { label: 'Incomplete',             bg: 'rgba(100,116,139,0.10)', color: '#64748B' },
  unmatched:                { label: 'Unmatched',              bg: 'rgba(100,116,139,0.10)', color: '#64748B' },
  conflicting:              { label: 'Conflicting',            bg: 'rgba(220,38,38,0.08)',   color: '#DC2626' },
  'awaiting-clarification': { label: 'Awaiting Clarification', bg: 'rgba(124,58,237,0.09)',  color: '#7C3AED' },
  duplicate:                { label: 'Duplicate',              bg: 'rgba(217,119,6,0.09)',   color: '#B45309' },
}

export const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; bg: string; color: string }> = {
  open:                       { label: 'Open',                      bg: 'rgba(220,38,38,0.08)',   color: '#DC2626' },
  'under-review':             { label: 'Under Review',              bg: 'rgba(217,119,6,0.10)',   color: '#B45309' },
  'awaiting-clarification':   { label: 'Awaiting Clarification',    bg: 'rgba(124,58,237,0.09)',  color: '#7C3AED' },
  resolved:                   { label: 'Resolved',                  bg: 'rgba(22,163,74,0.09)',   color: '#16A34A' },
  'kept-unmatched':           { label: 'Kept Unmatched',            bg: 'rgba(100,116,139,0.10)', color: '#64748B' },
  'flagged-schedule-review':  { label: 'Flagged for Schedule Review', bg: 'rgba(217,119,6,0.10)', color: '#B45309' },
}

export const EXCEPTION_TYPE_CONFIG: Record<ExceptionType, { label: string; bg: string; color: string }> = {
  conflicting: { label: 'Conflicting', bg: 'rgba(220,38,38,0.08)',   color: '#DC2626' },
  incomplete:  { label: 'Incomplete',  bg: 'rgba(100,116,139,0.10)', color: '#64748B' },
  unmatched:   { label: 'Unmatched',   bg: 'rgba(100,116,139,0.10)', color: '#64748B' },
  duplicate:   { label: 'Duplicate',   bg: 'rgba(217,119,6,0.09)',   color: '#B45309' },
}
