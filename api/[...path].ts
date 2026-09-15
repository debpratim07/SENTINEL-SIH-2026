import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHandler } from '../server/app.ts'
import { allowedOrigins } from '../server/deployment-config.ts'

let connectedHandler: ReturnType<typeof createHandler> | null = null

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key || !key.startsWith('sb_publishable_')) {
    res.writeHead(503, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(JSON.stringify({ error: 'The application service is not configured.' }))
    return
  }

  connectedHandler ??= createHandler({ url, key, origins: allowedOrigins() })
  await connectedHandler(req, res)
}
