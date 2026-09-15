import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHandler } from '../server/app.js'
import { allowedOrigins } from '../server/deployment-config.js'

let connectedHandler: ReturnType<typeof createHandler> | null = null

function restoreApiPath(req: IncomingMessage) {
  const requestUrl = new URL(req.url ?? '/api', 'http://localhost')
  const path = requestUrl.searchParams.get('__sentinel_path')
  if (!path) return

  requestUrl.searchParams.delete('__sentinel_path')
  const query = requestUrl.searchParams.toString()
  req.url = `/api/${path}${query ? `?${query}` : ''}`
}

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

  restoreApiPath(req)
  connectedHandler ??= createHandler({ url, key, origins: allowedOrigins() })
  await connectedHandler(req, res)
}
