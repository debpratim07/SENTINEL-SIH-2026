import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createClient } from '@supabase/supabase-js'
import { createHandler } from './app.ts'

const project='00000000-0000-4000-8000-000000000001'
const user='00000000-0000-4000-8000-000000000010'
const key='00000000-0000-4000-8000-000000000099'
function mockClient(role:string|null='planner', valid=true, rpcError?:{code?:string;message?:string}) {
  const calls:{token?:string;rpc?:string;params?:Record<string,unknown>;authorization?:string}={}
  const factory=(_url:unknown,_key:unknown,options:unknown)=>{
    calls.authorization=(options as {global:{headers:{Authorization:string}}}).global.headers.Authorization
    return {
      auth:{getUser:async(token:string)=>{calls.token=token;return {data:{user:valid?{id:user,email:'test@example.invalid'}:null},error:valid?null:{message:'invalid'}}}},
      from:(table:string)=>{
        const data=table==='sentinel_memberships'?(role?{role}:null):
          table==='sentinel_projects'?{active_schedule_id:key}:
          table==='sentinel_activities'?[{id:key,project_id:project,schedule_version_id:key,external_id:'P-205',parent_id:null,level:'L6',name:'Erect process line',discipline:'Piping',area:'Area B',equipment_ref:'P-205',planned_start:'2026-08-25',planned_finish:'2026-08-28'}]:[]
        const query={select:()=>query,eq:()=>query,order:()=>query,limit:()=>query,
          maybeSingle:async()=>({data,error:null}),single:async()=>({data,error:null}),
          then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data,error:null}).then(resolve)}
        return query
      },
      rpc:async(name:string,params:Record<string,unknown>)=>{calls.rpc=name;calls.params=params;if(rpcError)return {data:null,error:rpcError};if(name==='sentinel_list_project_members')return {data:[{user_id:user,email:'test@example.invalid',role:'administrator',active:true,encrypted_password:'hidden'}],error:null};if(name==='sentinel_assign_project_member'||name==='sentinel_update_project_member')return {data:[{user_id:key,email:'member@example.invalid',role:params.p_role,active:name==='sentinel_assign_project_member'?true:params.p_active,encrypted_password:'hidden'}],error:null};return {data:key,error:null}}
    }
  }
  return {factory:factory as unknown as typeof createClient,calls}
}
async function request(options:{role?:string|null;valid?:boolean;method?:string;path?:string;headers?:Record<string,string>;raw?:string;rpcError?:{code?:string;message?:string}}={}) {
  const mock=mockClient(options.role===undefined?'planner':options.role,options.valid??true,options.rpcError)
  const handler=createHandler({url:'https://example.supabase.co',key:'sb_publishable_test',origins:['http://127.0.0.1:5173']},mock.factory)
  const req=Readable.from(options.raw===undefined?[]:[Buffer.from(options.raw)]) as unknown as IncomingMessage
  req.method=options.method??'GET';req.url=options.path??'/api/me';req.headers=options.headers??{authorization:'Bearer valid-token'}
  let status=0,output=''
  const response={headersSent:false,writeHead:(value:number)=>{status=value},end:(value:string)=>{output=value}} as unknown as ServerResponse
  await handler(req,response)
  return {status,data:JSON.parse(output),...mock}
}
const payload={request_key:key,report_date:'2026-08-28',text:'Started today.',event_type:'start',actual_date:'2026-08-28',source_quote:'Started today.'}
const post={method:'POST',path:`/api/projects/${project}/events`,headers:{authorization:'Bearer valid-token','content-type':'application/json'}}

test('API requires bearer authentication and verifies tokens remotely',async()=>{
  assert.equal((await request({headers:{}})).status,401)
  const invalid=await request({valid:false});assert.equal(invalid.status,401);assert.equal(invalid.calls.rpc,undefined)
  const valid=await request();assert.equal(valid.status,200);assert.equal(valid.calls.token,'valid-token');assert.equal(valid.calls.authorization,'Bearer valid-token')
})
test('API rejects unapproved origins and missing project membership',async()=>{
  assert.equal((await request({headers:{authorization:'Bearer valid-token',origin:'https://untrusted.invalid'}})).status,403)
  assert.equal((await request({...post,role:null,raw:JSON.stringify(payload)})).status,403)
})
test('capture preserves caller idempotency key and project scope',async()=>{
  const result=await request({...post,role:'site-supervisor',raw:JSON.stringify({...payload,role:'administrator'})})
  assert.equal(result.status,200);assert.equal(result.calls.rpc,'sentinel_capture_manual')
  assert.equal(result.calls.params?.p_project,project);assert.equal(result.calls.params?.p_request_key,key)
  assert.equal(result.calls.params?.role,undefined)
})
test('API cannot turn a client-provided role into approval authority',async()=>{
  const result=await request({...post,path:`/api/projects/${project}/reviews`,role:'site-supervisor',raw:JSON.stringify({role:'planner',event_id:key,activity_id:key,request_key:key,expected_revision:1,reason:'Checked'})})
  assert.equal(result.status,403);assert.equal(result.calls.rpc,undefined)
})
test('API rejects malformed JSON, impossible dates, invalid IDs and oversized manual evidence',async()=>{
  assert.equal((await request({...post,raw:'invalid'})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,actual_date:'2026-02-30'})})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,request_key:'bad'})})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,text:'x'.repeat(140000)})})).status,400)
})
test('report ingestion is server parsed, evidence grounded and pending for human review',async()=>{
  const source='P-205 started on 2026-08-25.'
  const result=await request({role:'discipline-engineer',method:'POST',path:`/api/projects/${project}/reports`,headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify({
    request_key:key,report_date:'2026-08-25',filename:'daily-report.txt',media_type:'text/plain',source_size:Buffer.byteLength(source),content_base64:Buffer.from(source).toString('base64'),
  })})
  assert.equal(result.status,200);assert.equal(result.calls.rpc,'sentinel_ingest_report')
  assert.equal(result.calls.params?.p_project,project);assert.equal(result.calls.params?.p_text,source)
  assert.equal(result.data.candidate_count,1);assert.equal(result.data.ai_status,'unavailable')
})
test('report ingestion rejects unsupported files and unauthorized roles',async()=>{
  const input={request_key:key,report_date:'2026-08-25',filename:'unsafe.exe',media_type:'application/octet-stream',source_size:4,content_base64:'dGVzdA=='}
  const route={method:'POST',path:`/api/projects/${project}/reports`,headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify(input)}
  assert.equal((await request({...route,role:'project-manager'})).status,403)
  assert.equal((await request({...route,role:'planner'})).status,422)
})
test('unrecognized routes and unsupported methods fail explicitly',async()=>{
  assert.equal((await request({path:'/api/admin/assign-role'})).status,404)
  assert.equal((await request({...post,method:'DELETE'})).status,405)
})

test('project administrators can capture and request guarded approval',async()=>{
  const captured=await request({...post,role:'administrator',raw:JSON.stringify(payload)})
  assert.equal(captured.status,200);assert.equal(captured.calls.rpc,'sentinel_capture_manual')
  const reviewed=await request({...post,path:`/api/projects/${project}/reviews`,role:'administrator',raw:JSON.stringify({event_id:key,activity_id:key,request_key:key,expected_revision:1,reason:'Evidence checked'})})
  assert.equal(reviewed.status,200);assert.equal(reviewed.calls.rpc,'sentinel_approve_actual')
})

test('administrator can list project members without sensitive auth fields',async()=>{
  const result=await request({role:'administrator',path:`/api/projects/${project}/members`})
  assert.equal(result.status,200);assert.equal(result.calls.rpc,'sentinel_list_project_members');assert.equal(result.data.members.length,1)
  assert.equal(result.data.members[0].email,'test@example.invalid');assert.equal(result.data.members[0].encrypted_password,undefined)
})
test('membership endpoints are administrator-only and project-scoped',async()=>{
  const forbidden=await request({role:'planner',path:`/api/projects/${project}/members`});assert.equal(forbidden.status,403);assert.equal(forbidden.calls.rpc,undefined)
  const wrong=await request({role:null,path:`/api/projects/${project}/members/assign`,method:'POST',headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify({email:'member@example.invalid',role:'planner'})});assert.equal(wrong.status,403)
})
test('administrator assigns, changes and deactivates membership through guarded RPCs',async()=>{
  const assign=await request({role:'administrator',path:`/api/projects/${project}/members/assign`,method:'POST',headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify({email:' MEMBER@example.invalid ',role:'discipline-engineer'})})
  assert.equal(assign.status,200);assert.equal(assign.calls.rpc,'sentinel_assign_project_member');assert.equal(assign.calls.params?.p_email,'member@example.invalid')
  const update=await request({role:'administrator',path:`/api/projects/${project}/members/${key}`,method:'POST',headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify({role:'planner',active:false})})
  assert.equal(update.status,200);assert.equal(update.calls.rpc,'sentinel_update_project_member');assert.equal(update.calls.params?.p_target_user,key);assert.equal(update.calls.params?.p_active,false)
})
test('membership API rejects bad email, role and reports account/last-admin failures truthfully',async()=>{
  const base={role:'administrator',path:`/api/projects/${project}/members/assign`,method:'POST',headers:{authorization:'Bearer valid-token','content-type':'application/json'}}
  assert.equal((await request({...base,raw:JSON.stringify({email:'bad',role:'planner'})})).status,400)
  assert.equal((await request({...base,raw:JSON.stringify({email:'member@example.invalid',role:'owner'})})).status,400)
  const unknown=await request({...base,raw:JSON.stringify({email:'missing@example.invalid',role:'planner'}),rpcError:{code:'P0002',message:'sentinel_account_not_found'}});assert.equal(unknown.status,404);assert.match(unknown.data.error,/No SENTINEL account/)
  const last=await request({role:'administrator',path:`/api/projects/${project}/members/${key}`,method:'POST',headers:{authorization:'Bearer valid-token','content-type':'application/json'},raw:JSON.stringify({role:'planner',active:false}),rpcError:{code:'23514',message:'last_active_administrator'}});assert.equal(last.status,409)
})
