import { z } from 'zod'

const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_URL: z.url().refine((value) => value.startsWith('https://') || value.startsWith('http://127.0.0.1'), {
    message: 'SUPABASE_URL must use HTTPS, except for the local Supabase address.',
  }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  SUPABASE_DB_URL: z.string().min(1),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().int().positive().max(65535).default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
})

export type ServerConfig = z.infer<typeof serverEnvironmentSchema>

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): ServerConfig {
  const parsed = serverEnvironmentSchema.safeParse(environment)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid SENTINEL API environment: ${details}`)
  }
  return parsed.data
}
