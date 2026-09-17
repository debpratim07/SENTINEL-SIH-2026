import test from 'node:test'
import assert from 'node:assert/strict'
import { extractReportIntelligence, intelligenceConfig } from './intelligence.ts'
import type { ScheduleActivity } from '../src/lib/connected-types.ts'

const activities:ScheduleActivity[]=[{id:'00000000-0000-4000-8000-000000000001',project_id:'p',schedule_version_id:'v',external_id:'P-204',parent_id:null,level:'L6',name:'Pump alignment',discipline:'Mechanical',area:'Utility',equipment_ref:'P-204',planned_start:null,planned_finish:null}]
const text='Pump P-204 alignment started on 2026-08-24.'

test('missing provider configuration is explicit and uses deterministic extraction',async()=>{
  assert.equal(intelligenceConfig({}),null)
  const result=await extractReportIntelligence({text,reportDate:'2026-08-28',activities,config:null})
  assert.equal(result.aiStatus,'unavailable')
  assert.equal(result.method,'deterministic')
  assert.equal(result.candidates.length,1)
})

test('valid provider output is schema validated and source grounded',async()=>{
  const fetchImpl=async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({candidates:[{event_type:'start',actual_date:'2026-08-24',source_quote:text,source_location:'Line 1',suggested_activity_id:activities[0].id,suggestion_reason:'Exact reference',confidence:.98}]})}}]}),{status:200,headers:{'Content-Type':'application/json'}})
  const result=await extractReportIntelligence({text,reportDate:'2026-08-28',activities,config:{endpoint:'https://provider.invalid',key:'secret',model:'model'},fetchImpl:fetchImpl as typeof fetch})
  assert.equal(result.aiStatus,'used')
  assert.equal(result.method,'ai')
  assert.equal(result.candidates[0].source_quote,text)
})

test('malformed provider output cannot become a fake success',async()=>{
  const fetchImpl=async()=>new Response(JSON.stringify({choices:[{message:{content:'not json'}}]}),{status:200,headers:{'Content-Type':'application/json'}})
  const result=await extractReportIntelligence({text,reportDate:'2026-08-28',activities,config:{endpoint:'https://provider.invalid',key:'secret',model:'model'},fetchImpl:fetchImpl as typeof fetch})
  assert.equal(result.aiStatus,'failed')
  assert.equal(result.method,'deterministic')
  assert.match(result.warnings.at(-1)??'',/malformed JSON/)
})

test('provider timeout is explicit and safely falls back without fake AI success',async()=>{
  const fetchImpl=async()=>{throw new Error('provider timeout')}
  const result=await extractReportIntelligence({text,reportDate:'2026-08-28',activities,config:{endpoint:'https://provider.invalid',key:'secret',model:'model'},fetchImpl:fetchImpl as typeof fetch})
  assert.equal(result.aiStatus,'failed')
  assert.equal(result.method,'deterministic')
  assert.match(result.warnings.at(-1)??'',/timeout.*Deterministic extraction/)
})
