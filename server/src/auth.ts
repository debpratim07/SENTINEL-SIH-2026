import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { FastifyRequest } from 'fastify'
import { hasPermission, type Permission, type UserRole } from '@sentinel/domain'
import type { Database } from './database'
import { HttpError } from './errors'

export interface RequestUser {
  id: string
  email: string
}

export interface Membership {
  projectId: string
  role: UserRole
  disciplines: string[]
}

function bearerToken(request: FastifyRequest): string {
  const header = request.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'A valid bearer token is required.', 'UNAUTHENTICATED')
  }
  return header.slice('Bearer '.length).trim()
}

function requestUserFromSupabase(user: User): RequestUser {
  if (!user.email) throw new HttpError(401, 'The authenticated account has no email address.', 'INVALID_ACCOUNT')
  return { id: user.id, email: user.email }
}

export async function authenticateRequest(
  request: FastifyRequest,
  supabase: SupabaseClient,
): Promise<RequestUser> {
  const { data, error } = await supabase.auth.getUser(bearerToken(request))
  if (error || !data.user) {
    throw new HttpError(401, 'The session has expired or is invalid.', 'UNAUTHENTICATED')
  }
  return requestUserFromSupabase(data.user)
}

export async function requireProjectPermission(
  database: Database,
  userId: string,
  projectId: string,
  permission: Permission,
): Promise<Membership> {
  const rows = await database<Membership[]>`
    select project_id, role, disciplines
    from public.project_memberships
    where project_id = ${projectId}
      and user_id = ${userId}
      and status = 'active'
    limit 1
  `
  const membership = rows[0]
  if (!membership || !hasPermission(membership.role, permission)) {
    throw new HttpError(403, 'You do not have permission to perform this action.', 'FORBIDDEN')
  }
  return membership
}
