import cors from '@fastify/cors'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Fastify, { type FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { authenticateRequest } from './auth'
import type { ServerConfig } from './config'
import { createDatabase, type Database } from './database'
import { HttpError } from './errors'
import { registerReviewRoutes } from './routes/reviews'
import { registerScheduleRoutes } from './routes/schedule'
import { registerUploadRoutes } from './routes/uploads'

interface AppDependencies {
  database?: Database
  supabase?: SupabaseClient
}

interface MembershipRow {
  projectId: string
  projectName: string
  role: string
  disciplines: string[]
}

export async function buildApp(config: ServerConfig, overrides: AppDependencies = {}): Promise<FastifyInstance> {
  const database = overrides.database ?? createDatabase(config.SUPABASE_DB_URL)
  const supabase = overrides.supabase ?? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const app = Fastify({
    logger: { level: config.LOG_LEVEL },
    genReqId: () => crypto.randomUUID(),
  })

  await app.register(cors, {
    origin: config.WEB_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'Idempotency-Key'],
  })

  app.get('/health', async () => {
    await database`select 1 as ok`
    return { status: 'ok', service: 'sentinel-api' }
  })

  app.get('/v1/me', async (request) => {
    const user = await authenticateRequest(request, supabase)
    const profileRows = await database<{ name: string }[]>`
      select full_name as name from public.profiles where id = ${user.id} limit 1
    `
    const memberships = await database<MembershipRow[]>`
      select
        membership.project_id,
        project.name as project_name,
        membership.role,
        membership.disciplines
      from public.project_memberships membership
      join public.projects project on project.id = membership.project_id
      where membership.user_id = ${user.id}
        and membership.status = 'active'
      order by membership.created_at
    `
    return {
      id: user.id,
      email: user.email,
      name: profileRows[0]?.name || user.email.split('@')[0],
      memberships,
    }
  })

  await registerUploadRoutes(app, { database, supabase })
  await registerReviewRoutes(app, { database, supabase })
  await registerScheduleRoutes(app, { database, supabase })

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: 'INVALID_REQUEST',
        message: 'The request contains invalid data.',
        issues: error.issues,
        requestId: request.id,
      })
    }
    if (error instanceof HttpError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
        requestId: request.id,
      })
    }

    request.log.error({ err: error }, 'Unhandled request error')
    return reply.code(500).send({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected server error occurred.',
      requestId: request.id,
    })
  })

  app.addHook('onClose', async () => {
    await database.end({ timeout: 5 })
  })

  return app
}
