export type ReviewStatus = 'needs-review' | 'ambiguous' | 'incomplete' | 'unmatched'

export interface SignalStrength {
  label: string
  strength: 'Strong' | 'Match' | 'Compatible' | 'Weak' | 'Missing'
}

export interface Candidate {
  activity: string
  confidence: number
  tier: string
  discipline: string
  area: string
}

export interface ReviewItem {
  id: string
  // Field evidence
  fieldText: string
  source: string
  sourceDate: string
  sourceTime: string
  // Extracted actual
  extractedActivity: string
  extractedEvent: string
  extractedDate: string
  extractedDiscipline: string
  extractedArea: string | null
  extractedLineRef: string | null
  // Suggested match
  suggestedActivity: string | null
  suggestedTier: string | null
  suggestedDiscipline: string | null
  suggestedArea: string | null
  confidence: number
  confidenceLabel: string
  // Signals
  signals: SignalStrength[]
  signalExplanation: string
  // Alternatives
  alternatives: Candidate[]
  // Schedule context
  scheduleContext: {
    activity: string
    plannedStart: string
    plannedFinish: string
    currentActualStart: string
    currentStatus: string
  } | null
  // Meta
  status: ReviewStatus
  isBulkEligible: boolean
}

export const reviewItems: ReviewItem[] = [
  {
    id: 'ACT-2026-0842',
    fieldText: 'Spool erected in Area B. Final bolt tightening pending.',
    source: 'Supervisor Update',
    sourceDate: '26 Aug 2026',
    sourceTime: '08:42',
    extractedActivity: 'Spool erection',
    extractedEvent: 'Actual Start',
    extractedDate: '26 Aug 2026',
    extractedDiscipline: 'Piping',
    extractedArea: 'Area B',
    extractedLineRef: '24-XX',
    suggestedActivity: 'ERECT LINE 24-XX',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Piping',
    suggestedArea: 'Area B',
    confidence: 91,
    confidenceLabel: 'Strong match',
    signals: [
      { label: 'Line Reference', strength: 'Strong' },
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Match' },
      { label: 'Terminology', strength: 'Strong' },
      { label: 'Hierarchy', strength: 'Compatible' },
    ],
    signalExplanation:
      'This candidate ranks highest because the line reference, discipline and area align with the reported execution event.',
    alternatives: [
      { activity: 'INSTALL PIPE SUPPORT 24-XX', confidence: 46, tier: 'L6', discipline: 'Piping', area: 'Area B' },
      { activity: 'HYDROTEST LINE 24-XX', confidence: 18, tier: 'L6', discipline: 'Piping', area: 'Area B' },
    ],
    scheduleContext: {
      activity: 'ERECT LINE 24-XX',
      plannedStart: '24 Aug',
      plannedFinish: '30 Aug',
      currentActualStart: 'Not reported',
      currentStatus: 'Not Started',
    },
    status: 'needs-review',
    isBulkEligible: true,
  },
  {
    id: 'ACT-2026-0843',
    fieldText: 'Pump P-204 alignment started this morning. Crew of three on site.',
    source: 'Supervisor Update',
    sourceDate: '28 Aug 2026',
    sourceTime: '09:15',
    extractedActivity: 'Pump P-204 alignment',
    extractedEvent: 'Actual Start',
    extractedDate: '28 Aug 2026',
    extractedDiscipline: 'Rotating Equipment',
    extractedArea: 'Utility Block',
    extractedLineRef: null,
    suggestedActivity: 'EQUIPMENT ALIGNMENT — P-204',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Rotating Equipment',
    suggestedArea: 'Utility Block',
    confidence: 93,
    confidenceLabel: 'Strong match',
    signals: [
      { label: 'Equipment ID', strength: 'Strong' },
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Match' },
      { label: 'Terminology', strength: 'Strong' },
      { label: 'Hierarchy', strength: 'Compatible' },
    ],
    signalExplanation:
      'Equipment P-204, discipline and area all correspond to this schedule activity with high terminological alignment.',
    alternatives: [
      { activity: 'P-204 INSTALLATION', confidence: 42, tier: 'L6', discipline: 'Rotating Equipment', area: 'Utility Block' },
      { activity: 'P-204 COMMISSIONING', confidence: 21, tier: 'L6', discipline: 'Rotating Equipment', area: 'Utility Block' },
    ],
    scheduleContext: {
      activity: 'EQUIPMENT ALIGNMENT — P-204',
      plannedStart: '28 Aug',
      plannedFinish: '29 Aug',
      currentActualStart: 'Not reported',
      currentStatus: 'Not Started',
    },
    status: 'needs-review',
    isBulkEligible: true,
  },
  {
    id: 'ACT-2026-0844',
    fieldText: 'Cable work started.',
    source: 'Supervisor Update',
    sourceDate: '27 Aug 2026',
    sourceTime: '14:03',
    extractedActivity: 'Cable pulling',
    extractedEvent: 'Actual Start',
    extractedDate: '27 Aug 2026',
    extractedDiscipline: 'Electrical',
    extractedArea: null,
    extractedLineRef: null,
    suggestedActivity: 'ELECTRICAL CABLE PULLING — ZONE 3',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Electrical',
    suggestedArea: null,
    confidence: 47,
    confidenceLabel: 'Low confidence',
    signals: [
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Missing' },
      { label: 'Activity', strength: 'Weak' },
      { label: 'Terminology', strength: 'Weak' },
      { label: 'Hierarchy', strength: 'Compatible' },
    ],
    signalExplanation:
      'Discipline matches, but area and specific activity are not reported, leaving the match ambiguous across multiple electrical activities.',
    alternatives: [
      { activity: 'ELECTRICAL CABLE PULLING — ZONE 4', confidence: 31, tier: 'L6', discipline: 'Electrical', area: 'Zone 4' },
      { activity: 'CABLE TRAY INSTALLATION', confidence: 18, tier: 'L6', discipline: 'Electrical', area: 'Not reported' },
    ],
    scheduleContext: null,
    status: 'incomplete',
    isBulkEligible: false,
  },
  {
    id: 'ACT-2026-0845',
    fieldText: 'Valve installation completed in the utility corridor near the pump room.',
    source: 'DPR Extract',
    sourceDate: '25 Aug 2026',
    sourceTime: '16:30',
    extractedActivity: 'Valve installation',
    extractedEvent: 'Actual Finish',
    extractedDate: '25 Aug 2026',
    extractedDiscipline: 'Piping',
    extractedArea: 'Utility Block',
    extractedLineRef: null,
    suggestedActivity: 'INSTALL VALVE V-312',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Piping',
    suggestedArea: 'Utility Block',
    confidence: 34,
    confidenceLabel: 'Low confidence',
    signals: [
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Match' },
      { label: 'Valve ID', strength: 'Missing' },
      { label: 'Terminology', strength: 'Weak' },
      { label: 'Hierarchy', strength: 'Weak' },
    ],
    signalExplanation:
      'Multiple valve activities exist in this area. Without a valve tag number, it is not possible to determine which schedule item this corresponds to.',
    alternatives: [
      { activity: 'INSTALL VALVE V-318', confidence: 31, tier: 'L6', discipline: 'Piping', area: 'Utility Block' },
      { activity: 'INSTALL VALVE V-291', confidence: 28, tier: 'L6', discipline: 'Piping', area: 'Utility Block' },
    ],
    scheduleContext: null,
    status: 'ambiguous',
    isBulkEligible: false,
  },
  {
    id: 'ACT-2026-0846',
    fieldText: 'Scaffolding erected around vessel V-701. Ready for insulation crew.',
    source: 'Supervisor Update',
    sourceDate: '27 Aug 2026',
    sourceTime: '11:22',
    extractedActivity: 'Scaffolding erection',
    extractedEvent: 'Actual Finish',
    extractedDate: '27 Aug 2026',
    extractedDiscipline: 'Structural',
    extractedArea: 'Tank Farm',
    extractedLineRef: null,
    suggestedActivity: 'ERECT SCAFFOLDING TF-04',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Structural',
    suggestedArea: 'Tank Farm',
    confidence: 52,
    confidenceLabel: 'Low confidence',
    signals: [
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Match' },
      { label: 'Vessel ID', strength: 'Weak' },
      { label: 'Terminology', strength: 'Match' },
      { label: 'Hierarchy', strength: 'Compatible' },
    ],
    signalExplanation:
      'Area and discipline match, but multiple scaffolding activities exist in Tank Farm. The vessel ID V-701 partially narrows the search.',
    alternatives: [
      { activity: 'ERECT SCAFFOLDING TF-07', confidence: 41, tier: 'L6', discipline: 'Structural', area: 'Tank Farm' },
      { activity: 'ERECT SCAFFOLDING TF-02', confidence: 29, tier: 'L6', discipline: 'Structural', area: 'Tank Farm' },
    ],
    scheduleContext: null,
    status: 'ambiguous',
    isBulkEligible: false,
  },
  {
    id: 'ACT-2026-0847',
    fieldText: 'Concrete blinding layer complete in Block 3. Ready for rebar.',
    source: 'DPR Extract',
    sourceDate: '26 Aug 2026',
    sourceTime: '17:05',
    extractedActivity: 'Foundation blinding',
    extractedEvent: 'Actual Finish',
    extractedDate: '26 Aug 2026',
    extractedDiscipline: 'Civil',
    extractedArea: 'Area A',
    extractedLineRef: null,
    suggestedActivity: 'CONCRETE BLINDING — BLOCK 3',
    suggestedTier: 'L6',
    suggestedDiscipline: 'Civil',
    suggestedArea: 'Area A',
    confidence: 68,
    confidenceLabel: 'Moderate match',
    signals: [
      { label: 'Discipline', strength: 'Match' },
      { label: 'Area', strength: 'Match' },
      { label: 'Block Reference', strength: 'Strong' },
      { label: 'Terminology', strength: 'Match' },
      { label: 'Hierarchy', strength: 'Compatible' },
    ],
    signalExplanation:
      'Block 3 reference aligns well. Moderate confidence due to multiple civil activities in this area sharing similar descriptions.',
    alternatives: [
      { activity: 'BLINDING CONCRETE — BLOCK 3A', confidence: 44, tier: 'L6', discipline: 'Civil', area: 'Area A' },
      { activity: 'CONCRETE FOUNDATIONS — BLOCK 3', confidence: 22, tier: 'L6', discipline: 'Civil', area: 'Area A' },
    ],
    scheduleContext: {
      activity: 'CONCRETE BLINDING — BLOCK 3',
      plannedStart: '25 Aug',
      plannedFinish: '26 Aug',
      currentActualStart: '25 Aug',
      currentStatus: 'In Progress',
    },
    status: 'incomplete',
    isBulkEligible: false,
  },
  {
    id: 'ACT-2026-0848',
    fieldText: 'Some welding work happening near the Tank Farm area.',
    source: 'Supervisor Update',
    sourceDate: '25 Aug 2026',
    sourceTime: '13:48',
    extractedActivity: 'Welding',
    extractedEvent: 'Progress Note',
    extractedDate: '25 Aug 2026',
    extractedDiscipline: 'Structural',
    extractedArea: 'Tank Farm',
    extractedLineRef: null,
    suggestedActivity: null,
    suggestedTier: null,
    suggestedDiscipline: null,
    suggestedArea: null,
    confidence: 0,
    confidenceLabel: 'No match found',
    signals: [],
    signalExplanation: 'Insufficient detail to match this update to a schedule activity. Planner review required.',
    alternatives: [],
    scheduleContext: null,
    status: 'unmatched',
    isBulkEligible: false,
  },
]
