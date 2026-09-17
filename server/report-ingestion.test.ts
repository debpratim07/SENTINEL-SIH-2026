import test from 'node:test'
import assert from 'node:assert/strict'
import { deterministicCandidates, parseUploadedReport, validateCandidates } from './report-ingestion.ts'
import type { ScheduleActivity } from '../src/lib/connected-types.ts'

const activities:ScheduleActivity[]=[{id:'00000000-0000-4000-8000-000000000001',project_id:'p',schedule_version_id:'v',external_id:'P-204',parent_id:null,level:'L6',name:'Pump P-204 alignment',discipline:'Mechanical',area:'Utility Block',equipment_ref:'P-204',planned_start:'2026-08-20',planned_finish:'2026-08-25'}]

test('valid UTF-8 text ingestion preserves content and hashes the source',async()=>{
  const content=Buffer.from('Pump P-204 alignment started on 24 August 2026.','utf8')
  const result=await parseUploadedReport({filename:'daily.txt',mediaType:'text/plain',sourceSize:content.length,contentBase64:content.toString('base64')})
  assert.equal(result.text,content.toString())
  assert.match(result.sha256,/^[0-9a-f]{64}$/)
})

test('invalid, mismatched, and unsupported uploads fail safely',async()=>{
  await assert.rejects(parseUploadedReport({filename:'daily.pdf',mediaType:'text/plain',sourceSize:1,contentBase64:'YQ=='}),/Unsupported report format/)
  await assert.rejects(parseUploadedReport({filename:'../daily.txt',mediaType:'text/plain',sourceSize:1,contentBase64:'YQ=='}),/valid name/)
  await assert.rejects(parseUploadedReport({filename:'daily.txt',mediaType:'text/plain',sourceSize:2,contentBase64:'YQ=='}),/size does not match/)
  const blank=Buffer.from('   \n')
  await assert.rejects(parseUploadedReport({filename:'blank.txt',mediaType:'text/plain',sourceSize:blank.length,contentBase64:blank.toString('base64')}),/No readable text/)
})

test('deterministic extraction is grounded and advisory',()=>{
  const text='Pump P-204 alignment started on 24 August 2026. Final tightening pending.'
  const result=deterministicCandidates(text,'2026-08-28',activities)
  assert.equal(result.candidates.length,2)
  assert.deepEqual(result.candidates[0],{event_type:'start',actual_date:'2026-08-24',source_quote:'Pump P-204 alignment started on 24 August 2026.',source_location:'Statement 1',suggested_activity_id:activities[0].id,suggestion_reason:'Exact activity or equipment reference appears in the source.',confidence:.89})
  assert.equal(result.candidates[1].event_type,'progress_observation')
})

test('structured output validation rejects invented evidence and out-of-project activities',()=>{
  assert.throws(()=>validateCandidates([{event_type:'start',actual_date:'2026-08-24',source_quote:'Invented',source_location:'1',suggested_activity_id:null,suggestion_reason:null,confidence:null}],'Original','2026-08-28',activities),/not grounded/)
  assert.throws(()=>validateCandidates([{event_type:'start',actual_date:'2026-08-24',source_quote:'Original',source_location:'1',suggested_activity_id:'00000000-0000-4000-8000-000000000002',suggestion_reason:null,confidence:.5}],'Original','2026-08-28',activities),/unavailable activity/)
})
