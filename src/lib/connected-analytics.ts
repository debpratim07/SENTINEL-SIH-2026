import type { ProposedEvent, ProjectWorkspaceResponse, ScheduleActivity, ScheduleActual } from './connected-types.ts'

export interface ProgressPoint { date: string; label: string; plan: number; actual: number }
export interface DisciplineMetric { name: string; plan: number; actual: number; variance: number; activities: number }
export interface AttentionItem {
  id: string
  kind: 'late-start' | 'late-finish' | 'missing-actual' | 'review' | 'data-quality'
  label: string
  entity: string
  reason: string
  discipline: string
  area: string
  route: 'schedule' | 'review-queue' | 'exceptions'
  recordId?: string
}
export interface DerivedException {
  id: string
  kind: 'date-order' | 'missing-actual' | 'unreviewable-event' | 'duplicate-evidence'
  severity: 'critical' | 'attention'
  title: string
  detail: string
  activityId?: string
  eventId?: string
  discipline?: string | null
  area?: string | null
}
export interface DataQualityMetric { label: string; value: number | null; detail: string; favorable: boolean }

const round = (value: number) => Math.round(value * 10) / 10
const l6 = (activities: ScheduleActivity[]) => activities.filter(activity => activity.level === 'L6')
const byActivity = (actuals: ScheduleActual[]) => new Map(actuals.map(actual => [actual.activity_id, actual]))
const onOrBefore = (value: string | null | undefined, date: string) => Boolean(value && value <= date)
const pct = (part: number, total: number) => total ? round(part * 100 / total) : null
const labelDate = (date: string) => new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`))

export function latestProjectDate(workspace: ProjectWorkspaceResponse, fallback = new Date().toISOString().slice(0,10)): string {
  const values = [
    ...workspace.activities.flatMap(activity => [activity.planned_start, activity.planned_finish]),
    ...workspace.actuals.flatMap(actual => [actual.actual_start, actual.actual_finish]),
    ...workspace.events.flatMap(event => [event.actual_date, event.report?.report_date]),
  ].filter((value): value is string => Boolean(value))
  return values.reduce((latest,value)=>value>latest?value:latest,fallback)
}

export function progressAt(workspace: ProjectWorkspaceResponse, asOf: string) {
  const activities=l6(workspace.activities), actuals=byActivity(workspace.actuals)
  const planned=activities.flatMap(activity => [activity.planned_start,activity.planned_finish]).filter(Boolean).length
  const plannedDue=activities.reduce((count,activity)=>count+Number(onOrBefore(activity.planned_start,asOf))+Number(onOrBefore(activity.planned_finish,asOf)),0)
  const verified=activities.reduce((count,activity)=>{
    const actual=actuals.get(activity.id)
    return count+Number(Boolean(activity.planned_start&&onOrBefore(actual?.actual_start,asOf)))+Number(Boolean(activity.planned_finish&&onOrBefore(actual?.actual_finish,asOf)))
  },0)
  const plan=pct(plannedDue,planned), actual=pct(verified,planned)
  return { plan, actual, variance:plan===null||actual===null?null:round(actual-plan), denominator:planned }
}

export function progressSeries(workspace: ProjectWorkspaceResponse, asOf: string): ProgressPoint[] {
  const dates=[
    ...l6(workspace.activities).flatMap(activity=>[activity.planned_start,activity.planned_finish]),
    ...workspace.actuals.flatMap(actual=>[actual.actual_start,actual.actual_finish]),asOf,
  ].filter((value):value is string=>typeof value==='string'&&value<=asOf)
  const unique=[...new Set(dates)].sort()
  const selected=unique.length<=8?unique:unique.filter((_,index)=>index===0||index===unique.length-1||index%Math.ceil(unique.length/7)===0)
  return selected.map(date=>{const value=progressAt(workspace,date);return {date,label:labelDate(date),plan:value.plan??0,actual:value.actual??0}})
}

export function disciplinePerformance(workspace: ProjectWorkspaceResponse, asOf: string): DisciplineMetric[] {
  const grouped=new Map<string,ScheduleActivity[]>()
  for(const activity of l6(workspace.activities)){
    const key=activity.discipline?.trim()||'Not reported'
    grouped.set(key,[...(grouped.get(key)??[]),activity])
  }
  return [...grouped.entries()].map(([name,activities])=>{
    const ids=new Set(activities.map(activity=>activity.id))
    const scoped:ProjectWorkspaceResponse={
      ...workspace,activities,actuals:workspace.actuals.filter(actual=>ids.has(actual.activity_id)),
    }
    const value=progressAt(scoped,asOf)
    return {name,plan:value.plan??0,actual:value.actual??0,variance:value.variance??0,activities:activities.length}
  }).sort((a,b)=>a.name.localeCompare(b.name))
}

export function deriveExceptions(workspace: ProjectWorkspaceResponse, asOf: string): DerivedException[] {
  const result:DerivedException[]=[]
  const actuals=byActivity(workspace.actuals)
  for(const activity of l6(workspace.activities)){
    const actual=actuals.get(activity.id)
    if(actual?.actual_start&&actual.actual_finish&&actual.actual_start>actual.actual_finish) result.push({
      id:`date-order:${activity.id}`,kind:'date-order',severity:'critical',title:`${activity.external_id} has impossible actual dates`,
      detail:`Actual start ${actual.actual_start} is after actual finish ${actual.actual_finish}.`,activityId:activity.id,discipline:activity.discipline,area:activity.area,
    })
    if(activity.planned_finish&&activity.planned_finish<asOf&&!actual?.actual_finish) result.push({
      id:`missing-finish:${activity.id}`,kind:'missing-actual',severity:'attention',title:`${activity.external_id} is missing an actual finish`,
      detail:`Planned finish was ${activity.planned_finish}; no verified actual finish is recorded.`,activityId:activity.id,discipline:activity.discipline,area:activity.area,
    })
  }
  for(const event of workspace.events.filter(item=>item.review_status==='pending')) if(event.event_type==='progress_observation'||!event.actual_date) result.push({
    id:`unreviewable:${event.id}`,kind:'unreviewable-event',severity:'attention',title:'Captured evidence needs clarification',
    detail:event.event_type==='progress_observation'?'A progress observation cannot update schedule actuals.':'A start or finish was captured without a reported date.',eventId:event.id,
  })
  const evidence=new Map<string,ProposedEvent>()
  for(const event of workspace.events.filter(item=>item.review_status==='pending')){
    const key=[event.event_type,event.actual_date??'',event.source_quote.trim().toLowerCase()].join('|')
    const previous=evidence.get(key)
    if(previous) result.push({id:`duplicate:${event.id}`,kind:'duplicate-evidence',severity:'attention',title:'Possible duplicate field evidence',detail:'Another pending event has the same type, date, and source quote.',eventId:event.id})
    else evidence.set(key,event)
  }
  return result
}

export function attentionItems(workspace: ProjectWorkspaceResponse, asOf: string): AttentionItem[] {
  const result:AttentionItem[]=[]
  const actuals=byActivity(workspace.actuals)
  for(const activity of l6(workspace.activities)){
    const actual=actuals.get(activity.id)
    if(activity.planned_start&&actual?.actual_start&&actual.actual_start>activity.planned_start) result.push({id:`late-start:${activity.id}`,kind:'late-start',label:'LATE START',entity:activity.external_id,reason:`Started ${daysBetween(activity.planned_start,actual.actual_start)} day(s) late`,discipline:activity.discipline??'Not reported',area:activity.area??'',route:'schedule',recordId:activity.id})
    if(activity.planned_finish&&actual?.actual_finish&&actual.actual_finish>activity.planned_finish) result.push({id:`late-finish:${activity.id}`,kind:'late-finish',label:'LATE FINISH',entity:activity.external_id,reason:`Finished ${daysBetween(activity.planned_finish,actual.actual_finish)} day(s) late`,discipline:activity.discipline??'Not reported',area:activity.area??'',route:'schedule',recordId:activity.id})
    if(activity.planned_finish&&activity.planned_finish<asOf&&!actual?.actual_finish) result.push({id:`missing:${activity.id}`,kind:'missing-actual',label:'MISSING',entity:activity.external_id,reason:'Actual finish not reported',discipline:activity.discipline??'Not reported',area:activity.area??'',route:'exceptions',recordId:`missing-finish:${activity.id}`})
  }
  for(const event of workspace.events.filter(item=>item.review_status==='pending')) result.push({id:`review:${event.id}`,kind:'review',label:'REVIEW',entity:event.source_quote,reason:event.actual_date?'Human verification required':'Reported date needs clarification',discipline:'Field evidence',area:event.report?.report_date??'',route:'review-queue',recordId:event.id})
  return result.sort((a,b)=>a.kind.localeCompare(b.kind)||a.entity.localeCompare(b.entity))
}

export function analyticsSummary(workspace: ProjectWorkspaceResponse, asOf: string) {
  const value=progressAt(workspace,asOf), actuals=byActivity(workspace.actuals), activities=l6(workspace.activities)
  const startedLate=activities.filter(activity=>activity.planned_start&&actuals.get(activity.id)?.actual_start&&actuals.get(activity.id)!.actual_start!>activity.planned_start).length
  const finishedLate=activities.filter(activity=>activity.planned_finish&&actuals.get(activity.id)?.actual_finish&&actuals.get(activity.id)!.actual_finish!>activity.planned_finish).length
  return {...value,startedLate,finishedLate,needsReview:workspace.events.filter(event=>event.review_status==='pending').length,exceptions:deriveExceptions(workspace,asOf).length}
}

export function dataQuality(workspace: ProjectWorkspaceResponse): DataQualityMetric[] {
  const activities=l6(workspace.activities), plannedSlots=activities.length*2
  const plannedKnown=activities.reduce((count,item)=>count+Number(Boolean(item.planned_start))+Number(Boolean(item.planned_finish)),0)
  const actualDates=workspace.actuals.reduce((count,item)=>count+Number(Boolean(item.actual_start))+Number(Boolean(item.actual_finish)),0)
  const decisionLinks=workspace.actuals.reduce((count,item)=>count+Number(Boolean(item.start_decision_id))+Number(Boolean(item.finish_decision_id)),0)
  const datedEvents=workspace.events.filter(event=>event.event_type!=='progress_observation')
  const reports=workspace.reports??[]
  return [
    {label:'Schedule date completeness',value:pct(plannedKnown,plannedSlots),detail:`${plannedKnown} of ${plannedSlots} planned milestone dates are present.`,favorable:true},
    {label:'Event date completeness',value:pct(datedEvents.filter(event=>event.actual_date).length,datedEvents.length),detail:`${datedEvents.filter(event=>event.actual_date).length} of ${datedEvents.length} start/finish events include a date.`,favorable:true},
    {label:'Human review completion',value:pct(workspace.events.filter(event=>event.review_status==='verified').length,workspace.events.length),detail:`${workspace.events.filter(event=>event.review_status==='verified').length} of ${workspace.events.length} captured events are verified.`,favorable:true},
    {label:'Verified actual provenance',value:pct(decisionLinks,actualDates),detail:`${decisionLinks} of ${actualDates} actual dates retain decision links.`,favorable:true},
    {label:'Report processing success',value:pct(reports.filter(report=>report.processing_status==='processed').length,reports.length),detail:reports.length?`${reports.filter(report=>report.processing_status==='processed').length} of ${reports.length} reports processed successfully.`:'No uploaded reports are available yet.',favorable:true},
  ]
}

export function executionKnowledge(workspace: ProjectWorkspaceResponse) {
  const actuals=byActivity(workspace.actuals)
  const samples=l6(workspace.activities).flatMap(activity=>{
    const actual=actuals.get(activity.id)
    if(!activity.planned_start||!activity.planned_finish||!actual?.actual_start||!actual.actual_finish)return []
    return [{activityId:activity.id,externalId:activity.external_id,discipline:activity.discipline??'Not reported',plannedDays:daysBetween(activity.planned_start,activity.planned_finish)+1,actualDays:daysBetween(actual.actual_start,actual.actual_finish)+1}]
  })
  return {
    samples,
    averagePlannedDays:samples.length?round(samples.reduce((sum,item)=>sum+item.plannedDays,0)/samples.length):null,
    averageActualDays:samples.length?round(samples.reduce((sum,item)=>sum+item.actualDays,0)/samples.length):null,
  }
}

export function daysBetween(start:string,finish:string){return Math.round((Date.parse(`${finish}T00:00:00Z`)-Date.parse(`${start}T00:00:00Z`))/86400000)}
