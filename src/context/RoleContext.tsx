import { createContext, useContext, useState } from 'react'

export type UserRole =
  | 'site-supervisor'
  | 'discipline-engineer'
  | 'planner'
  | 'project-controls'
  | 'project-manager'
  | 'administrator'

export interface UserProfile {
  name: string
  email: string
  role: UserRole
  roleLabel: string
  project: string
  disciplines: string
  initials: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  'site-supervisor':     'Site Supervisor',
  'discipline-engineer': 'Discipline Engineer',
  'planner':             'Planner',
  'project-controls':    'Project Controls',
  'project-manager':     'Project Manager',
  'administrator':       'Administrator',
}

// The base identity never changes — only the simulated role changes
const BASE_ROLE: UserRole = 'planner'

// Which nav ids are visible per role (null = all)
export const ROLE_NAV: Record<UserRole, Set<string> | null> = {
  'site-supervisor': new Set([
    'dashboard', 'actuals', 'reports', 'schedule',
  ]),
  'discipline-engineer': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge',
  ]),
  'planner': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'review-queue', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge', 'audit-log',
  ]),
  'project-controls': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'review-queue', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge', 'audit-log',
  ]),
  'project-manager': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge',
    // No review-queue, audit-log, admin
  ]),
  // Administrator sees all system surfaces but NOT planner review workflow
  'administrator': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge', 'audit-log', 'admin',
  ]),
}

// Which actions are permitted per role
export const ROLE_CAN: Record<UserRole, Set<string>> = {
  'site-supervisor':     new Set(['capture', 'upload-report', 'clarification-response', 'view-actuals']),
  'discipline-engineer': new Set(['capture', 'upload-report', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights']),
  'planner':             new Set(['capture', 'upload-report', 'review-match', 'verify-actual', 'resolve-exception', 'view-audit', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights']),
  'project-controls':    new Set(['capture', 'upload-report', 'review-match', 'verify-actual', 'resolve-exception', 'view-audit', 'schedule-integrity', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights']),
  'project-manager':     new Set(['view-actuals', 'view-exceptions', 'view-performance', 'view-insights']),
  // Administrator has configuration authority but NOT field-execution or planner-verification authority
  'administrator':       new Set(['admin-config', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights', 'view-audit']),
}

interface RoleContextValue {
  user: UserProfile
  isSimulatedRole: boolean
  setRole: (role: UserRole) => void
  can: (action: string) => boolean
  canSeeNav: (navId: string) => boolean
}

const DEFAULT_USER: UserProfile = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@sentinel.demo',
  role: BASE_ROLE,
  roleLabel: ROLE_LABELS[BASE_ROLE],
  project: 'Infrastructure Expansion',
  disciplines: 'All',
  initials: 'AM',
}

const RoleContext = createContext<RoleContextValue>({
  user: DEFAULT_USER,
  isSimulatedRole: false,
  setRole: () => {},
  can: () => false,
  canSeeNav: () => true,
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER)
  const [isSimulatedRole, setIsSimulatedRole] = useState(false)

  function setRole(role: UserRole) {
    setUser((u) => ({
      ...u,
      role,
      roleLabel: ROLE_LABELS[role],
    }))
    setIsSimulatedRole(role !== BASE_ROLE)
  }

  function can(action: string) {
    return ROLE_CAN[user.role]?.has(action) ?? false
  }

  function canSeeNav(navId: string) {
    const allowed = ROLE_NAV[user.role]
    if (allowed === null) return true
    return allowed.has(navId)
  }

  return (
    <RoleContext.Provider value={{ user, isSimulatedRole, setRole, can, canSeeNav }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
