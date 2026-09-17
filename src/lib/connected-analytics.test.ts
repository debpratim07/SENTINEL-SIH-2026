import test from 'node:test'
import assert from 'node:assert/strict'
import { analyticsSummary, attentionItems, dataQuality, deriveExceptions, executionKnowledge, progressAt, progressSeries } from './connected-analytics.ts'
import type { ProjectWorkspaceResponse } from './connected-types.ts'

const workspace:ProjectWorkspaceResponse={
  limit:200,reports:[],audit:[],
  activities:[
    {id:'a',project_id:'p',schedule_version_id:'v',external_id:'A-1',parent_id:null,level:'L6',name:'Install pump',discipline:'Mechanical',area:'Block A',equipment_ref:'P-1',planned_start:'2026-08-01',planned_finish:'2026-08-05'},
    {id:'b',project_id:'p',schedule_version_id:'v',external_id:'B-1',parent_id:null,level:'L6',name:'Test pump',discipline:'Mechanical',area:'Block A',equipment_ref:'P-1',planned_start:'2026-08-06',planned_finish:'2026-08-10'},
  ],
  actuals:[
    {project_id:'p',activity_id:'a',actual_start:'2026-08-02',actual_finish:'2026-08-06',start_decision_id:'d1',finish_decision_id:'d2'},
    {project_id:'p',activity_id:'b',actual_start:null,actual_finish:null,start_decision_id:null,finish_decision_id:null},
  ],
  events:[
    {id:'e1',project_id:'p',report_id:'r1',event_type:'start',actual_date:'2026-08-02',source_quote:'Installation started.',revision:2,review_status:'verified',created_at:'2026-08-02T10:00:00Z',report:{raw_text:'Installation started.',report_date:'2026-08-02'}},
    {id:'e2',project_id:'p',report_id:'r2',event_type:'finish',actual_date:null,source_quote:'Testing complete; date not stated.',revision:1,review_status:'pending',created_at:'2026-08-11T10:00:00Z',report:{raw_text:'Testing complete; date not stated.',report_date:'2026-08-11'}},
  ],
}

test('milestone progress is deterministic and unknowns are not invented',()=>{
  assert.deepEqual(progressAt(workspace,'2026-08-10'),{plan:100,actual:50,variance:-50,denominator:4})
  assert.equal(progressSeries(workspace,'2026-08-10').at(-1)?.actual,50)
})

test('summary, attention and exceptions use only persisted conditions',()=>{
  assert.deepEqual(analyticsSummary(workspace,'2026-08-11'),{plan:100,actual:50,variance:-50,denominator:4,startedLate:1,finishedLate:1,needsReview:1,exceptions:2})
  assert.ok(attentionItems(workspace,'2026-08-11').some(item=>item.kind==='review'))
  assert.deepEqual(deriveExceptions(workspace,'2026-08-11').map(item=>item.kind).sort(),['missing-actual','unreviewable-event'])
})

test('data quality exposes component ratios and safe unavailable values',()=>{
  const metrics=dataQuality(workspace)
  assert.equal(metrics.find(item=>item.label==='Schedule date completeness')?.value,100)
  assert.equal(metrics.find(item=>item.label==='Report processing success')?.value,null)
})

test('execution knowledge requires completed verified start and finish pairs',()=>{
  const knowledge=executionKnowledge(workspace)
  assert.equal(knowledge.samples.length,1)
  assert.equal(knowledge.averagePlannedDays,5)
  assert.equal(knowledge.averageActualDays,5)
})
