import { createClient } from '@supabase/supabase-js'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'

export interface Config { url: string; key: string; origins: string[] }
class HttpError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const projectRoles = new Set(['site-supervisor','discipline-engineer','planner','project-controls','project-manager','administrator'])
function uuid(value: unknown): string {
  if (typeof value !== 'string' || !uuidPattern.test(value)) throw new HttpError(400, 'A valid record identifier is required.')
  return value
}
function text(value: unknown, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new HttpError(400, 'Check the required text fields and their length.')
  return value
}
function date(value: unknown, nullable = false): string | null {
  if (nullable && (value === null || value === '')) return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value) throw new HttpError(400, 'Use a valid date in YYYY-MM-DD format.')
  return value
}
async function body(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Send JSON content.')
  const chunks: Buffer[] = []; let size=0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 131072) throw new HttpError(413, 'This report is too large for manual capture.')
    chunks.push(Buffer.from(chunk))
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value
  } catch { throw new HttpError(400, 'The request is not valid JSON.') }
}
function databaseError(error: { code?: string; message?: string }): never {
  const message=error.message ?? ''
  if (error.code === '42501') throw new HttpError(403, 'Your account does not have permission for this action.')
  if (message.includes('sentinel_account_not_found')) throw new HttpError(404, 'No SENTINEL account exists for this email yet. Ask the user to create an account before assigning project access.')
  if (message.includes('last_active_administrator')) throw new HttpError(409, 'Every project must retain at least one active Administrator.')
  if (message.includes('project_membership_not_found')) throw new HttpError(404, 'That project membership does not exist.')
  if (error.code === 'P0002') throw new HttpError(404, 'That record is not available in this project.')
  if (message.includes('existing_actual_requires')) throw new HttpError(409, 'This activity already has that actual. Review the conflicting or duplicate report; no date was overwritten.')
  if (error.code === '40001' || error.code === '23505') throw new HttpError(409, 'The record changed or was already reviewed. Refresh before continuing.')
  if (message.includes('actual_date_not_supported')) throw new HttpError(422, 'A supported start or finish date is required. Partial observations cannot update actual dates.')
  if (message.includes('granularity_requires')) throw new HttpError(422, 'This first release supports L6 approvals. L5 work needs further review.')
  if (message.includes('finish_before_start')) throw new HttpError(422, 'Actual finish cannot be earlier than actual start.')
  if (message.includes('idempotency_key_reused')) throw new HttpError(409, 'This request was already used with different input. Refresh and try again.')
  if (error.code === '22023' || error.code?.startsWith('23')) throw new HttpError(422, 'Check the report, source evidence, identifiers and dates.')
  throw new HttpError(503, 'The database is temporarily unavailable. Your request may be retried safely.')
}

export function createHandler(config: Config, makeClient: typeof createClient = createClient) {
  const windows = new Map<string, {count:number; resets:number}>()
  return async (req: IncomingMessage, res: ServerResponse) => {
    const requestId=randomUUID()
    const send=(status:number, data:unknown) => {
      res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Request-Id':requestId})
      res.end(JSON.stringify(data))
    }
    try {
      const pathname=new URL(req.url ?? '/', 'http://localhost').pathname
      if (req.headers.origin && !config.origins.includes(req.headers.origin)) throw new HttpError(403,'This application origin is not allowed.')
      if (req.method === 'GET' && pathname === '/api/health') return send(200,{status:'ok',service:'sentinel-api'})
      const token=req.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1]
      if (!token) throw new HttpError(401,'Sign in to continue.')
      const client=makeClient(config.url,config.key,{
        auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
        global:{headers:{Authorization:`Bearer ${token}`}, fetch: (input,init) => fetch(input,{...init,signal:AbortSignal.timeout(15000)})}
      })
      const {data: identity,error:authError}=await client.auth.getUser(token)
      if (authError || !identity.user) throw new HttpError(401,'Your session is invalid or expired. Sign in again.')
      const now=Date.now(), rateKey=identity.user.id
      // In-process protection for the first single-instance deployment.
      for (const [key,value] of windows) if (value.resets <= now) windows.delete(key)
      const window=windows.get(rateKey) ?? {count:0,resets:now+60000}
      if (++window.count > 120) throw new HttpError(429,'Too many requests. Please wait a minute.')
      windows.set(rateKey,window)
      if (req.method === 'GET' && pathname === '/api/me') {
        const [memberships,projects]=await Promise.all([
          client.from('sentinel_memberships').select('project_id,role').eq('user_id',identity.user.id).eq('active',true),
          client.from('sentinel_projects').select('id,name,timezone,active_schedule_id')
        ])
        if (memberships.error) databaseError(memberships.error)
        if (projects.error) databaseError(projects.error)
        return send(200,{user:{id:identity.user.id,email:identity.user.email},memberships:memberships.data,projects:projects.data})
      }
      const match=pathname.match(/^\/api\/projects\/([^/]+)\/(workspace|events|reviews|members)(?:\/([^/]+))?$/)
      if (!match) throw new HttpError(404,'This endpoint does not exist.')
      const project=uuid(match[1]), action=match[2], target=match[3]
      const member=await client.from('sentinel_memberships').select('role').eq('project_id',project).eq('user_id',identity.user.id).eq('active',true).maybeSingle()
      if (member.error) databaseError(member.error)
      if (!member.data) throw new HttpError(403,'You do not have access to this project.')
      const role=member.data.role as string
      if (action === 'members') {
        if (role !== 'administrator') throw new HttpError(403,'Only a project Administrator can manage Team Access.')
        if (req.method === 'GET' && !target) {
          const result=await client.rpc('sentinel_list_project_members',{p_project:project})
          if (result.error) databaseError(result.error)
          const members=(Array.isArray(result.data) ? result.data : []).map((item:Record<string,unknown>)=>({
            user_id:item.user_id,email:item.email,role:item.role,active:item.active,
          }))
          return send(200,{members})
        }
        if (req.method !== 'POST') throw new HttpError(405,'This method is not supported.')
        const input=await body(req)
        if (!projectRoles.has(String(input.role))) throw new HttpError(400,'Choose a supported project role.')
        let result
        if (target === 'assign') {
          const email=text(input.email,320).trim().toLowerCase()
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400,'Enter a valid exact account email.')
          result=await client.rpc('sentinel_assign_project_member',{p_project:project,p_email:email,p_role:input.role})
        } else if (target) {
          if (typeof input.active !== 'boolean') throw new HttpError(400,'Choose whether project access is active.')
          result=await client.rpc('sentinel_update_project_member',{
            p_project:project,p_target_user:uuid(target),p_role:input.role,p_active:input.active,
          })
        } else throw new HttpError(404,'This endpoint does not exist.')
        if (result.error) databaseError(result.error)
        const item=Array.isArray(result.data) ? result.data[0] : result.data
        if (!item) throw new HttpError(503,'The membership service did not return the saved member.')
        return send(200,{member:{user_id:item.user_id,email:item.email,role:item.role,active:item.active}})
      }
      if (req.method === 'GET' && action === 'workspace') {
        const current=await client.from('sentinel_projects').select('active_schedule_id').eq('id',project).single()
        if (current.error) databaseError(current.error)
        const [events,activities,actuals,audit]=await Promise.all([
          client.from('sentinel_events').select('*,report:sentinel_reports(raw_text,report_date)').eq('project_id',project).order('created_at',{ascending:false}).limit(200),
          client.from('sentinel_activities').select('*').eq('project_id',project).eq('schedule_version_id',current.data.active_schedule_id ?? '00000000-0000-0000-0000-000000000000').order('external_id').limit(200),
          client.from('sentinel_schedule_actuals').select('*').eq('project_id',project).limit(200),
          ['planner','project-controls','administrator'].includes(role)
            ? client.from('sentinel_audit_events').select('*').eq('project_id',project).order('created_at',{ascending:false}).limit(50)
            : Promise.resolve({data:[],error:null})
        ])
        for (const result of [events,activities,actuals,audit]) if (result.error) databaseError(result.error)
        return send(200,{events:events.data,activities:activities.data,actuals:actuals.data,audit:audit.data,limit:200})
      }
      if (req.method !== 'POST') throw new HttpError(405,'This method is not supported.')
      const input=await body(req)
      let result
      if (action === 'events') {
        if (!['site-supervisor','discipline-engineer','planner','project-controls','administrator'].includes(role)) throw new HttpError(403,'Your role cannot capture progress.')
        const kind=input.event_type
        if (!['start','finish','progress_observation'].includes(String(kind))) throw new HttpError(400,'Choose a supported event type.')
        result=await client.rpc('sentinel_capture_manual',{
          p_project:project,p_request_key:uuid(input.request_key),p_report_date:date(input.report_date),
          p_text:text(input.text,50000),p_event_type:kind,p_actual_date:date(input.actual_date,true),p_source_quote:text(input.source_quote,50000)
        })
      } else if (action === 'reviews') {
        if (!['planner','project-controls','administrator'].includes(role)) throw new HttpError(403,'Only a planner, project controls reviewer or project administrator can approve actuals.')
        if (!Number.isInteger(input.expected_revision) || Number(input.expected_revision)<1) throw new HttpError(400,'A valid event revision is required.')
        result=await client.rpc('sentinel_approve_actual',{
          p_project:project,p_event:uuid(input.event_id),p_activity:uuid(input.activity_id),
          p_expected_revision:input.expected_revision,p_request_key:uuid(input.request_key),p_reason:text(input.reason,2000)
        })
      } else throw new HttpError(405,'This method is not supported.')
      if (result.error) databaseError(result.error)
      send(200,{id:result.data})
    } catch (error) {
      if (res.headersSent) return
      const status=error instanceof HttpError ? error.status : 503
      const message=error instanceof HttpError ? error.message : 'The service is unavailable. Please retry shortly.'
      // Do not log tokens, passwords, report text or query bodies.
      if (status >= 500) console.error(JSON.stringify({requestId,status,event:'api_request_failed'}))
      send(status,{error:message,requestId})
    }
  }
}
