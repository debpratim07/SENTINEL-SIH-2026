import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createClient } from '@supabase/supabase-js'
import { createHandler } from './app.ts'

const project='00000000-0000-4000-8000-000000000001'
const user='00000000-0000-4000-8000-000000000010'
const key='00000000-0000-4000-8000-000000000099'
function mockClient(role:string|null='planner', valid=true) {
  const calls:{token?:string;rpc?:string;params?:Record<string,unknown>;authorization?:string}={}
  const factory=(_url:unknown,_key:unknown,options:unknown)=>{
    calls.authorization=(options as {global:{headers:{Authorization:string}}}).global.headers.Authorization
    return {
      auth:{getUser:async(token:string)=>{calls.token=token;return {data:{user:valid?{id:user,email:'test@example.invalid'}:null},error:valid?null:{message:'invalid'}}}},
      from:(table:string)=>{
        const data=table==='sentinel_memberships'?(role?{role}:null):[]
        const query={select:()=>query,eq:()=>query,order:()=>query,limit:()=>query,
          maybeSingle:async()=>({data,error:null}),single:async()=>({data,error:null}),
          then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data,error:null}).then(resolve)}
        return query
      },
      rpc:async(name:string,params:Record<string,unknown>)=>{calls.rpc=name;calls.params=params;return {data:key,error:null}}
    }
  }
  return {factory:factory as unknown as typeof createClient,calls}
}
async function request(options:{role?:string|null;valid?:boolean;method?:string;path?:string;headers?:Record<string,string>;raw?:string}={}) {
  const mock=mockClient(options.role===undefined?'planner':options.role,options.valid??true)
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
test('API rejects malformed JSON, impossible dates, invalid IDs and oversized reports',async()=>{
  assert.equal((await request({...post,raw:'invalid'})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,actual_date:'2026-02-30'})})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,request_key:'bad'})})).status,400)
  assert.equal((await request({...post,raw:JSON.stringify({...payload,text:'x'.repeat(140000)})})).status,413)
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
