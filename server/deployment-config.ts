const localOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173']

function origin(value: string | undefined): string | null {
  if (!value) return null
  const candidate = value.includes('://') ? value : `https://${value}`
  try {
    const parsed = new URL(candidate)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.origin : null
  } catch {
    return null
  }
}

export function allowedOrigins(environment: NodeJS.ProcessEnv = process.env): string[] {
  const configured = (environment.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => origin(value.trim()))
    .filter((value): value is string => Boolean(value))

  const vercel = [
    environment.VERCEL_URL,
    environment.VERCEL_BRANCH_URL,
    environment.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .map(origin)
    .filter((value): value is string => Boolean(value))

  return [...new Set([...configured, ...vercel, ...(configured.length || vercel.length ? [] : localOrigins)])]
}
