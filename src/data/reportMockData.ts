export type ProcessingStatus = 'uploaded' | 'processing' | 'processed' | 'failed'
export type EventStatus =
  | 'strong-match'
  | 'needs-review'
  | 'incomplete'
  | 'verified'
  | 'unmatched'
  | 'awaiting-clarification'

export interface MatchingSignal {
  label: string
  strength: 'strong' | 'match' | 'compatible' | 'weak'
}

export interface ReportEvent {
  id: string
  sourceIndex: number
  sourceStatement: string
  activity: string
  eventType: string
  date: string | null
  discipline: string
  area: string
  line?: string
  suggestedMatch: string | null
  suggestedMatchMeta?: string
  confidence: number
  status: EventStatus
  isBulkEligible: boolean
  matchingSignals?: MatchingSignal[]
}

export interface Report {
  id: string
  filename: string
  date: string
  discipline: string
  area: string
  actualsFound: number
  processingStatus: ProcessingStatus
  strongMatches: number
  needsReview: number
  incomplete: number
  uploadedAt: string
  pages: number
  events: ReportEvent[]
}

export const SOURCE_STATEMENTS = [
  'Spool erected for Line 24-XX. Final bolt tightening pending.',
  'Pipe supports installed for Line 24-XX at grid B4.',
  'Hydrotest preparation commenced for Line 18-AB.',
  'Line 31-ZZ fabrication completed at fabrication yard.',
  'Material shifting carried out near Area B.',
  'Welding work started. Location confirmation pending.',
]

export const SIGNAL_STRENGTH_CONFIG: Record<
  MatchingSignal['strength'],
  { label: string; color: string; bg: string }
> = {
  strong:     { label: 'Strong',      color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  match:      { label: 'Match',       color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  compatible: { label: 'Compatible',  color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  weak:       { label: 'Weak',        color: 'var(--c-muted)', bg: 'var(--c-border)' },
}

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  { label: string; color: string; bg: string }
> = {
  'strong-match':         { label: 'Strong Match',        color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  'needs-review':         { label: 'Needs Review',        color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  'incomplete':           { label: 'Incomplete',          color: 'var(--c-muted)', bg: 'var(--c-border)' },
  'verified':             { label: 'Verified',            color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  'unmatched':            { label: 'Unmatched',           color: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
  'awaiting-clarification': { label: 'Awaiting Clarification', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
}

const primaryEvents: ReportEvent[] = [
  {
    id: 'ACT-2026-0842',
    sourceIndex: 1,
    sourceStatement: SOURCE_STATEMENTS[0],
    activity: 'Spool erection',
    eventType: 'Actual Start',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Area B',
    line: '24-XX',
    suggestedMatch: 'ERECT LINE 24-XX',
    suggestedMatchMeta: 'L6 · Piping · Area B',
    confidence: 96,
    status: 'strong-match',
    isBulkEligible: true,
    matchingSignals: [
      { label: 'Line Reference', strength: 'strong' },
      { label: 'Discipline',     strength: 'match' },
      { label: 'Area',           strength: 'match' },
      { label: 'Terminology',    strength: 'strong' },
      { label: 'Hierarchy',      strength: 'compatible' },
    ],
  },
  {
    id: 'ACT-2026-0849',
    sourceIndex: 2,
    sourceStatement: SOURCE_STATEMENTS[1],
    activity: 'Pipe support installation',
    eventType: 'Actual Finish',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Area B',
    line: '24-XX',
    suggestedMatch: 'INSTALL PIPE SUPPORT 24-XX',
    suggestedMatchMeta: 'L6 · Piping · Area B',
    confidence: 94,
    status: 'strong-match',
    isBulkEligible: true,
    matchingSignals: [
      { label: 'Line Reference', strength: 'strong' },
      { label: 'Discipline',     strength: 'match' },
      { label: 'Area',           strength: 'match' },
      { label: 'Terminology',    strength: 'strong' },
    ],
  },
  {
    id: 'ACT-2026-0850',
    sourceIndex: 3,
    sourceStatement: SOURCE_STATEMENTS[2],
    activity: 'Hydrotest preparation',
    eventType: 'Actual Start',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Area B',
    suggestedMatch: 'HYDROTEST LINE 18-AB',
    suggestedMatchMeta: 'L6 · Piping · Area B',
    confidence: 92,
    status: 'strong-match',
    isBulkEligible: true,
    matchingSignals: [
      { label: 'Line Reference', strength: 'strong' },
      { label: 'Discipline',     strength: 'match' },
      { label: 'Terminology',    strength: 'match' },
    ],
  },
  {
    id: 'ACT-2026-0851',
    sourceIndex: 4,
    sourceStatement: SOURCE_STATEMENTS[3],
    activity: 'Line fabrication',
    eventType: 'Actual Finish',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Fabrication Yard',
    suggestedMatch: 'FABRICATE LINE 31-ZZ',
    suggestedMatchMeta: 'L6 · Piping · Fabrication',
    confidence: 95,
    status: 'strong-match',
    isBulkEligible: true,
    matchingSignals: [
      { label: 'Line Reference', strength: 'strong' },
      { label: 'Discipline',     strength: 'match' },
      { label: 'Terminology',    strength: 'strong' },
    ],
  },
  {
    id: 'ACT-2026-0852',
    sourceIndex: 5,
    sourceStatement: SOURCE_STATEMENTS[4],
    activity: 'Material shifting',
    eventType: 'Progress Update',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Area B',
    suggestedMatch: 'MATERIAL HANDLING — AREA B',
    suggestedMatchMeta: 'L5 · Piping · Area B',
    confidence: 58,
    status: 'needs-review',
    isBulkEligible: false,
  },
  {
    id: 'ACT-2026-0853',
    sourceIndex: 6,
    sourceStatement: SOURCE_STATEMENTS[5],
    activity: 'Welding',
    eventType: 'Actual Start',
    date: '28 Aug 2026',
    discipline: 'Piping',
    area: 'Not reported',
    suggestedMatch: null,
    confidence: 0,
    status: 'incomplete',
    isBulkEligible: false,
  },
]

export const primaryReport: Report = {
  id: 'RPT-2026-0001',
  filename: 'Piping_DPR_28Aug.pdf',
  date: '28 Aug 2026',
  discipline: 'Piping',
  area: 'Area B',
  actualsFound: 6,
  processingStatus: 'processed',
  strongMatches: 4,
  needsReview: 1,
  incomplete: 1,
  uploadedAt: '28 Aug 2026 · 08:31',
  pages: 3,
  events: primaryEvents,
}

export const allReports: Report[] = [
  primaryReport,
  {
    id: 'RPT-2026-0000',
    filename: 'Civil_DPR_25Aug.pdf',
    date: '25 Aug 2026',
    discipline: 'Civil',
    area: 'Area A',
    actualsFound: 3,
    processingStatus: 'processed',
    strongMatches: 3,
    needsReview: 0,
    incomplete: 0,
    uploadedAt: '25 Aug 2026 · 07:14',
    pages: 2,
    events: [],
  },
  {
    id: 'RPT-2026-0002',
    filename: 'Electrical_DPR_27Aug.pdf',
    date: '27 Aug 2026',
    discipline: 'Electrical',
    area: 'Utility Block',
    actualsFound: 2,
    processingStatus: 'processed',
    strongMatches: 1,
    needsReview: 1,
    incomplete: 0,
    uploadedAt: '27 Aug 2026 · 16:55',
    pages: 2,
    events: [],
  },
]

export function findReport(id: string): Report | undefined {
  return allReports.find((r) => r.id === id)
}
