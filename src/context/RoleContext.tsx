import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  hasPermission,
  permissions,
  userRoles,
  type Permission,
  type UserRole,
} from '@sentinel/domain'
import { environment } from '../lib/environment'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export type { UserRole } from '@sentinel/domain'

export interface UserProfile {
  name: string
  email: string
  role: UserRole
  roleLabel: string
  project: string
  projectId: string
  disciplines: string
  initials: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  'site-supervisor': 'Site Supervisor',
  'discipline-engineer': 'Discipline Engineer',
  planner: 'Planner',
  'project-controls': 'Project Controls',
  'project-manager': 'Project Manager',
  administrator: 'Administrator',
}

const BASE_DEMO_ROLE: UserRole = 'planner'

export const ROLE_NAV: Record<UserRole, Set<string>> = {
  'site-supervisor': new Set(['dashboard', 'actuals', 'reports', 'schedule']),
  'discipline-engineer': new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge',
  ]),
  planner: new Set([
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
  ]),
  administrator: new Set([
    'dashboard', 'actuals', 'reports', 'schedule', 'exceptions',
    'performance', 'data-quality', 'exec-knowledge', 'audit-log', 'admin',
  ]),
}

interface RoleContextValue {
  user: UserProfile
  membershipLoading: boolean
  isSimulatedRole: boolean
  canSimulateRoles: boolean
  setRole: (role: UserRole) => void
  can: (action: string) => boolean
  canSeeNav: (navId: string) => boolean
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SE'
}

function defaultProfile(name = 'Arjun Mehta', email = 'arjun.mehta@sentinel.demo'): UserProfile {
  return {
    name,
    email,
    role: BASE_DEMO_ROLE,
    roleLabel: ROLE_LABELS[BASE_DEMO_ROLE],
    project: 'Infrastructure Expansion',
    projectId: '20000000-0000-4000-8000-000000000001',
    disciplines: 'All',
    initials: initialsFor(name),
  }
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const canSimulateRoles = auth.isDemoMode && environment.roleSimulationEnabled
  const [user, setUser] = useState<UserProfile>(() => defaultProfile())
  const [membershipLoading, setMembershipLoading] = useState(false)
  const [isSimulatedRole, setIsSimulatedRole] = useState(false)

  useEffect(() => {
    if (!auth.user) return

    const baseRole: UserRole = auth.isDemoMode ? BASE_DEMO_ROLE : 'site-supervisor'
    setUser({
      ...defaultProfile(auth.user.name, auth.user.email),
      role: baseRole,
      roleLabel: ROLE_LABELS[baseRole],
    })
    setIsSimulatedRole(false)

    if (!supabase) return
    let active = true
    setMembershipLoading(true)

    void (async () => {
      try {
        const { data } = await supabase
          .from('project_memberships')
          .select('project_id, role, disciplines, projects(name)')
          .eq('user_id', auth.user!.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle()
        if (!active || !data) return
        const role = userRoles.includes(data.role as UserRole) ? data.role as UserRole : 'site-supervisor'
        const relatedProject = data.projects as unknown as { name?: string } | { name?: string }[] | null
        const projectName = Array.isArray(relatedProject) ? relatedProject[0]?.name : relatedProject?.name
        setUser((current) => ({
          ...current,
          role,
          roleLabel: ROLE_LABELS[role],
          project: projectName ?? 'SENTINEL Project',
          projectId: data.project_id,
          disciplines: Array.isArray(data.disciplines) && data.disciplines.length
            ? data.disciplines.join(', ')
            : 'All',
        }))
      } finally {
        if (active) setMembershipLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [auth.user, auth.isDemoMode])

  function setRole(role: UserRole) {
    if (!canSimulateRoles) return
    setUser((current) => ({ ...current, role, roleLabel: ROLE_LABELS[role] }))
    setIsSimulatedRole(role !== BASE_DEMO_ROLE)
  }

  function can(action: string) {
    if (!(permissions as readonly string[]).includes(action)) return false
    return hasPermission(user.role, action as Permission)
  }

  function canSeeNav(navId: string) {
    if (navId === 'profile') return true
    return ROLE_NAV[user.role].has(navId)
  }

  const value = useMemo<RoleContextValue>(() => ({
    user,
    membershipLoading,
    isSimulatedRole,
    canSimulateRoles,
    setRole,
    can,
    canSeeNav,
  }), [user, membershipLoading, isSimulatedRole, canSimulateRoles])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole must be used within RoleProvider')
  return context
}
