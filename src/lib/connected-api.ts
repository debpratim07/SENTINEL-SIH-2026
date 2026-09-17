import { supabase } from './supabase'
import type {
  ApprovalInput, AssignProjectMemberInput, IdentityResponse, ManualCaptureInput,
  ProjectMemberResponse, ProjectMembersResponse, ProjectWorkspaceResponse, SavedId,
  ReportUploadInput, ReportUploadResponse, UpdateProjectMemberInput,
} from './connected-types'

async function request<T>(path: string, body?: unknown): Promise<T> {
  if (!supabase) throw new Error('The project connection has not been configured.')
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) throw new Error('Sign in to continue.')
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30000),
  })
  const result: unknown = await response.json().catch(() => ({ error: 'The application service did not respond correctly.' }))
  if (!response.ok) {
    const message = typeof result === 'object' && result !== null && 'error' in result &&
      typeof result.error === 'string' ? result.error : 'The request failed.'
    throw new Error(message)
  }
  return result as T
}

export const getConnectedIdentity = () => request<IdentityResponse>('/api/me')
export const getProjectWorkspace = (projectId: string) =>
  request<ProjectWorkspaceResponse>(`/api/projects/${encodeURIComponent(projectId)}/workspace`)
export const captureManualEvent = (projectId: string, input: ManualCaptureInput) =>
  request<SavedId>(`/api/projects/${encodeURIComponent(projectId)}/events`, input)
export const uploadProjectReport = (projectId: string, input: ReportUploadInput) =>
  request<ReportUploadResponse>(`/api/projects/${encodeURIComponent(projectId)}/reports`, input)
export const approveActual = (projectId: string, input: ApprovalInput) =>
  request<SavedId>(`/api/projects/${encodeURIComponent(projectId)}/reviews`, input)
export const getProjectMembers = (projectId: string) =>
  request<ProjectMembersResponse>(`/api/projects/${encodeURIComponent(projectId)}/members`)
export const assignProjectMember = (projectId: string, input: AssignProjectMemberInput) =>
  request<ProjectMemberResponse>(`/api/projects/${encodeURIComponent(projectId)}/members/assign`, input)
export const updateProjectMember = (projectId: string, userId: string, input: UpdateProjectMemberInput) =>
  request<ProjectMemberResponse>(`/api/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`, input)
