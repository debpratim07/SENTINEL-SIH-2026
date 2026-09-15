// These shapes describe the existing connected API. They are not prototype fixtures.
export type ProjectRole =
  | 'site-supervisor'
  | 'discipline-engineer'
  | 'planner'
  | 'project-controls'
  | 'project-manager'
  | 'administrator'

export const PROJECT_ROLES: readonly ProjectRole[] = [
  'site-supervisor', 'discipline-engineer', 'planner', 'project-controls',
  'project-manager', 'administrator',
]

export interface AuthenticatedIdentity {
  id: string
  email: string
}

export interface ProjectMembership {
  project_id: string
  role: ProjectRole
}

export interface ConnectedProject {
  id: string
  name: string
  timezone: string
  active_schedule_id: string | null
}

export interface IdentityResponse {
  user: AuthenticatedIdentity
  memberships: ProjectMembership[]
  projects: ConnectedProject[]
}

export interface ScheduleActivity {
  id: string
  project_id: string
  schedule_version_id: string
  external_id: string
  parent_id: string | null
  level: 'L5' | 'L6'
  name: string
  discipline: string | null
  area: string | null
  equipment_ref: string | null
  planned_start: string | null
  planned_finish: string | null
}

export interface ScheduleActual {
  project_id: string
  activity_id: string
  actual_start: string | null
  actual_finish: string | null
  start_decision_id: string | null
  finish_decision_id: string | null
}

export interface FieldReport {
  raw_text: string
  report_date: string
}

export interface ProposedEvent {
  id: string
  project_id: string
  report_id: string
  event_type: 'start' | 'finish' | 'progress_observation'
  actual_date: string | null
  source_quote: string
  revision: number
  review_status: 'pending' | 'verified'
  report: FieldReport | null
}

export interface AuditItem {
  id: string
  project_id: string
  actor_id: string
  action: 'event_captured' | 'actual_verified' | 'membership_changed'
  record_id: string
  detail: Record<string, unknown>
  created_at: string
}

export interface ProjectWorkspaceResponse {
  events: ProposedEvent[]
  activities: ScheduleActivity[]
  actuals: ScheduleActual[]
  audit: AuditItem[]
  limit: number
}

export interface ManualCaptureInput {
  request_key: string
  report_date: string
  text: string
  event_type: ProposedEvent['event_type']
  actual_date: string | null
  source_quote: string
}

export interface ApprovalInput {
  event_id: string
  activity_id: string
  expected_revision: number
  request_key: string
  reason: string
}

export interface SavedId {
  id: string
}

export interface ManagedProjectMember {
  user_id: string
  email: string
  role: ProjectRole
  active: boolean
}

export interface ProjectMembersResponse { members: ManagedProjectMember[] }
export interface ProjectMemberResponse { member: ManagedProjectMember }
export interface AssignProjectMemberInput { email: string; role: ProjectRole }
export interface UpdateProjectMemberInput { role: ProjectRole; active: boolean }
