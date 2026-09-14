import type { ConnectedProject, IdentityResponse, ProjectMembership, ProjectRole } from './connected-types'

export interface ProjectAccess {
  project: ConnectedProject | null
  membership: ProjectMembership | null
  role: ProjectRole | null
  projects: ConnectedProject[]
}

// Only projects with a matching server-returned active membership are selectable.
export function resolveProjectAccess(identity: IdentityResponse | null, requestedId: string): ProjectAccess {
  if (!identity) return { project: null, membership: null, role: null, projects: [] }
  const memberships = new Map(identity.memberships.map(item => [item.project_id, item]))
  const projects = identity.projects.filter(project => memberships.has(project.id))
  const project = projects.find(item => item.id === requestedId) ?? projects[0] ?? null
  const membership = project ? memberships.get(project.id) ?? null : null
  return { project, membership, role: membership?.role ?? null, projects }
}
