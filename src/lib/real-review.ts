import type {
  ApprovalInput, ProjectRole, ProposedEvent, ScheduleActivity, ScheduleActual,
} from './connected-types'

export interface ApprovalDraft { activity_id: string; reason: string }
export interface PendingApprovalRequest { signature: string; key: string }

const reviewRoles: ReadonlySet<ProjectRole> = new Set(['planner', 'project-controls', 'administrator'])

export function canReviewActual(role: ProjectRole | null): boolean {
  return role !== null && reviewRoles.has(role)
}

export function eventsWithStatus(
  events: ProposedEvent[],
  status: ProposedEvent['review_status'],
): ProposedEvent[] {
  return events.filter(event => event.review_status === status)
}

export function eventReviewBlockReason(event: ProposedEvent): string | null {
  if (event.review_status !== 'pending') return 'This event has already been verified.'
  if (event.event_type === 'progress_observation') return 'Progress observations cannot create a dated schedule actual.'
  if (event.actual_date === null) return 'An explicitly reported actual date is required before approval.'
  if (!event.report) return 'The original report is unavailable, so this event cannot be verified safely.'
  if (!event.report.raw_text.includes(event.source_quote)) return 'The source quote no longer matches the original report.'
  return null
}

function actualFor(activity: ScheduleActivity, actuals: ScheduleActual[]): ScheduleActual | undefined {
  return actuals.find(value => value.activity_id === activity.id)
}

export function activityReviewBlockReason(
  activity: ScheduleActivity,
  event: ProposedEvent,
  actuals: ScheduleActual[],
): string | null {
  if (activity.level !== 'L6') return 'Only L6 activities are eligible.'
  if (activity.project_id !== event.project_id) return 'This activity belongs to another project.'
  const actual = actualFor(activity, actuals)
  if (event.event_type === 'start' && actual?.actual_start) return 'An actual start already exists.'
  if (event.event_type === 'finish' && actual?.actual_finish) return 'An actual finish already exists.'
  if (event.actual_date && event.event_type === 'start' && actual?.actual_finish && event.actual_date > actual.actual_finish) {
    return 'The proposed start is later than the verified finish.'
  }
  if (event.actual_date && event.event_type === 'finish' && actual?.actual_start && event.actual_date < actual.actual_start) {
    return 'The proposed finish is earlier than the verified start.'
  }
  return null
}

export function eligibleL6Activities(
  event: ProposedEvent,
  activities: ScheduleActivity[],
  actuals: ScheduleActual[],
): ScheduleActivity[] {
  if (eventReviewBlockReason(event)) return []
  return activities.filter(activity => activityReviewBlockReason(activity, event, actuals) === null)
}

export function buildApprovalInput(
  event: ProposedEvent,
  draft: ApprovalDraft,
  requestKey: string,
): ApprovalInput {
  return {
    event_id: event.id,
    activity_id: draft.activity_id,
    expected_revision: event.revision,
    request_key: requestKey,
    reason: draft.reason,
  }
}

export function validateApprovalDraft(draft: ApprovalDraft): string | null {
  if (!draft.activity_id) return 'Select an eligible L6 schedule activity.'
  if (!draft.reason.trim()) return 'Enter the human review reason.'
  if (draft.reason.length > 2000) return 'The review reason must be 2,000 characters or fewer.'
  return null
}

export function resolveApprovalRequest(
  previous: PendingApprovalRequest | null,
  event: ProposedEvent,
  draft: ApprovalDraft,
  createKey: () => string,
): PendingApprovalRequest {
  const signature = JSON.stringify({ event_id: event.id, revision: event.revision, ...draft })
  return previous?.signature === signature ? previous : { signature, key: createKey() }
}
