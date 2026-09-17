import { PROJECT_ROLES } from './connected-types.ts'
import type { ManagedProjectMember, ProjectRole, ProjectWorkspaceResponse } from './connected-types.ts'

export const PROJECT_ROLE_LABELS: Record<ProjectRole,string> = {
  'site-supervisor':'Site Supervisor','discipline-engineer':'Discipline Engineer',planner:'Planner',
  'project-controls':'Project Controls','project-manager':'Project Manager',administrator:'Administrator',
}

export const canManageTeam = (role: ProjectRole | null | undefined) => role === 'administrator'
export const isProjectRole = (value: unknown): value is ProjectRole => typeof value === 'string' && PROJECT_ROLES.includes(value as ProjectRole)
export const isExactAccountEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
export const activeAdministratorCount = (members: ManagedProjectMember[]) => members.filter(member => member.active && member.role === 'administrator').length
export const wouldRemoveLastAdministrator = (member: ManagedProjectMember, nextRole: ProjectRole, nextActive: boolean, members: ManagedProjectMember[]) =>
  member.active && member.role === 'administrator' && (!nextActive || nextRole !== 'administrator') && activeAdministratorCount(members) === 1

export function connectedOverview(workspace: ProjectWorkspaceResponse, canSeeAudit: boolean) {
  return {
    activities: workspace.activities.length,
    pendingEvents: workspace.events.filter(event => event.review_status === 'pending').length,
    verifiedEvents: workspace.events.filter(event => event.review_status === 'verified').length,
    actualBearingActivities: workspace.actuals.filter(actual => actual.actual_start !== null || actual.actual_finish !== null).length,
    recentAudit: canSeeAudit ? workspace.audit.length : null,
  }
}

export const PRIMARY_CONNECTED_ROUTES = ['dashboard','reports','actuals','schedule','review-queue','exceptions','performance','data-quality','execution-knowledge','integrations','audit-log','admin'] as const
