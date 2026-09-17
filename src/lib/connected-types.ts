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
  source_location?: string | null
  origin?: 'manual' | 'extraction'
  extraction_method?: 'manual' | 'deterministic' | 'ai'
  suggested_activity_id?: string | null
  suggestion_reason?: string | null
  confidence?: number | null
  revision: number
  review_status: 'pending' | 'verified'
  created_at?: string
  report: FieldReport | null
}

export interface IngestedReport {
  id: string
  project_id: string
  submitted_by: string
  report_date: string
  raw_text: string
  filename: string | null
  media_type: string | null
  source_size: number | null
  source_sha256: string | null
  source_kind: 'manual' | 'upload'
  processing_status: 'uploaded' | 'processing' | 'processed' | 'failed'
  processing_error: string | null
  extraction_method: 'manual' | 'deterministic' | 'ai' | null
  extraction_metadata: Record<string, unknown>
  created_at: string
}

export interface AuditItem {
  id: string
  project_id: string
  actor_id: string
  action: 'event_captured' | 'actual_verified' | 'membership_changed' | 'report_ingested'
  record_id: string
  detail: Record<string, unknown>
  created_at: string
}

export interface ProjectWorkspaceResponse {
  events: ProposedEvent[]
  activities: ScheduleActivity[]
  actuals: ScheduleActual[]
  audit: AuditItem[]
  reports?: IngestedReport[]
  limit: number
}

export interface ReportUploadInput {
  request_key: string
  report_date: string
  filename: string
  media_type: string
  source_size: number
  content_base64: string
}

export interface ReportUploadResponse {
  id: string
  candidate_count: number
  extraction_method: 'deterministic' | 'ai'
  ai_status: 'used' | 'unavailable' | 'failed'
  warnings: string[]
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
