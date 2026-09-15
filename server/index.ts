import { createServer } from 'node:http'
import { createHandler } from './app.ts'
import { allowedOrigins } from './deployment-config.ts'

const url=process.env.VITE_SUPABASE_URL
const key=process.env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!url || !key || !key.startsWith('sb_publishable_')) throw new Error('Configure a Supabase URL and publishable key. Do not use a secret/service-role key.')
const origins=allowedOrigins()
const server=createServer(createHandler({url,key,origins}))
server.requestTimeout=30000
server.headersTimeout=10000
server.listen(Number(process.env.API_PORT ?? 5174),'127.0.0.1',()=>console.log('SENTINEL API listening on loopback.'))
