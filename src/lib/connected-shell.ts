import type { ProjectRole } from './connected-types'

const roleLabels: Record<ProjectRole, string> = {
  'site-supervisor': 'Site Supervisor',
  'discipline-engineer': 'Discipline Engineer',
  planner: 'Planner',
  'project-controls': 'Project Controls',
  'project-manager': 'Project Manager',
  administrator: 'Administrator',
}

export function roleLabel(role: ProjectRole | null): string {
  return role ? roleLabels[role] : 'No project role'
}

// The connected API supplies an email, not a person's name or discipline.
export function emailInitials(email: string): string {
  return email.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || '—'
}

// Shell navigation is presentation only. The API and RLS remain authoritative.
export function shellNavVisible(role: ProjectRole | null, navId: string): boolean {
  if (!role) return false
  if (navId === 'admin') return role === 'administrator'
  if (navId === 'review-queue' || navId === 'audit-log') {
    return ['planner', 'project-controls', 'administrator'].includes(role)
  }
  return true
}
