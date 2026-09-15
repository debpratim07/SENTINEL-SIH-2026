import type { ManualCaptureInput, ProjectRole, ProposedEvent } from './connected-types'

export type ManualCaptureDraft = Omit<ManualCaptureInput, 'request_key'>

export interface PendingCaptureRequest {
  signature: string
  key: string
}

const captureRoles: ReadonlySet<ProjectRole> = new Set([
  'site-supervisor',
  'discipline-engineer',
  'planner',
  'project-controls',
  'administrator',
])

const eventTypes: ReadonlySet<ProposedEvent['event_type']> = new Set([
  'start',
  'finish',
  'progress_observation',
])

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
}

export function canCaptureProgress(role: ProjectRole | null): boolean {
  return role !== null && captureRoles.has(role)
}

export function validateManualCapture(draft: ManualCaptureDraft): string | null {
  if (!isDate(draft.report_date)) return 'Choose a valid report date.'
  if (!draft.text.trim()) return 'Enter the raw field update.'
  if (draft.text.length > 50000) return 'The field update must be 50,000 characters or fewer.'
  if (!eventTypes.has(draft.event_type)) return 'Choose a supported event type.'
  if (draft.actual_date !== null && !isDate(draft.actual_date)) return 'Choose a valid actual date or leave it unknown.'
  if (draft.actual_date !== null && draft.actual_date > draft.report_date) return 'The actual date cannot be later than the report date.'
  if (!draft.source_quote.trim()) return 'Copy the exact supporting words from the raw field update.'
  if (draft.source_quote.length > 50000) return 'The source quote must be 50,000 characters or fewer.'
  if (!draft.text.includes(draft.source_quote)) return 'The source quote must match an exact part of the raw field update.'
  return null
}

export function buildManualCaptureInput(
  draft: ManualCaptureDraft,
  requestKey: string,
): ManualCaptureInput {
  return {
    request_key: requestKey,
    report_date: draft.report_date,
    text: draft.text,
    event_type: draft.event_type,
    actual_date: draft.actual_date,
    source_quote: draft.source_quote,
  }
}

export function resolveCaptureRequest(
  previous: PendingCaptureRequest | null,
  draft: ManualCaptureDraft,
  createKey: () => string,
): PendingCaptureRequest {
  const signature = JSON.stringify(draft)
  return previous?.signature === signature ? previous : { signature, key: createKey() }
}
