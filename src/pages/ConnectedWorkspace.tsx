import { useEffect, useRef, useState } from 'react'
import { useConnectedAuth } from '../context/ConnectedAuthContext'
import { useConnectedProject } from '../context/ConnectedProjectContext'
import { approveActual, captureManualEvent, getProjectWorkspace } from '../lib/connected-api'
import type { ProposedEvent, ProjectWorkspaceResponse, ScheduleActivity } from '../lib/connected-types'
import './connected-workspace.css'

const empty:ProjectWorkspaceResponse={events:[],activities:[],actuals:[],audit:[],limit:200}
const readable=(value:string)=>value.replace(/[_-]/g,' ')

function AccountForm({initialError=''}:{initialError?:string}) {
  const auth=useConnectedAuth()
  const [signup,setSignup]=useState(false), [busy,setBusy]=useState(false)
  const [message,setMessage]=useState(''), [error,setError]=useState(initialError)
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!auth.configured || busy) return
    const form=new FormData(e.currentTarget)
    const email=String(form.get('email')??'').trim(), password=String(form.get('password')??'')
    setBusy(true); setError(''); setMessage('')
    try {
      if(signup){
        const result=await auth.signUp(email,password)
        if(result.confirmationRequired)setMessage('Check your email for the account confirmation, then return here and sign in. Project access is assigned separately.')
      }else await auth.signIn(email,password)
    } catch (e) { setError(e instanceof Error?e.message:'Unable to sign in. Please retry.') }
    finally { setBusy(false) }
  }
  return <main className="sw-account"><div className="sw-card">
    <p className="sw-eyebrow">SENTINEL · PROJECT WORKSPACE</p>
    <h1>{signup?'Create your account':'Welcome back'}</h1>
    <p className="sw-muted">Use your project account to capture and verify progress.</p>
    {!auth.configured && <p role="alert">The project connection needs to be configured before you can sign in.</p>}
    <form onSubmit={submit}>
      <label>Email<input name="email" type="email" autoComplete="email" required disabled={busy}/></label>
      <label>Password<input name="password" type="password" autoComplete={signup?'new-password':'current-password'} minLength={signup?12:undefined} required disabled={busy}/></label>
      {signup && <p className="sw-muted">Use at least 12 characters. Creating an account does not grant access to any project.</p>}
      {error && <p className="sw-error" role="alert">{error}</p>}
      {message && <p className="sw-notice" role="status">{message}</p>}
      <button className="sw-primary" disabled={busy||!auth.configured}>{busy?'Please wait…':signup?'Create account':'Sign in'}</button>
    </form>
    <button className="sw-link" disabled={busy} onClick={()=>{setSignup(!signup);setError('');setMessage('')}}>{signup?'Already have an account? Sign in':'Create an account'}</button>
    <a className="sw-link" href="/">View the original prototype with sample data</a>
  </div></main>
}

function CaptureForm({project,onSaved}:{project:string;onSaved:()=>Promise<void>}) {
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('')
  const pending=useRef<{signature:string;key:string}|null>(null)
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return
    const form=e.currentTarget, fields=new FormData(form)
    const payload={
      report_date:String(fields.get('report_date')??''),text:String(fields.get('text')??''),
      event_type:String(fields.get('event_type')??'') as ProposedEvent['event_type'],
      actual_date:String(fields.get('actual_date')||'')||null,
      source_quote:String(fields.get('source_quote')??''),
    }
    const signature=JSON.stringify(payload)
    if (pending.current?.signature!==signature) pending.current={signature,key:crypto.randomUUID()}
    setBusy(true);setMessage('');setError('')
    try {
      await captureManualEvent(project,{...payload,request_key:pending.current.key})
      form.reset();pending.current=null;setMessage('Report and proposed event saved. A planner must review the actual before it changes the schedule.')
      await onSaved()
    } catch(e) {setError(e instanceof Error?e.message:'Unable to save. Please retry.')}
    finally {setBusy(false)}
  }
  return <section className="sw-card"><p className="sw-eyebrow">CAPTURE</p><h2>Log field progress</h2>
    <p className="sw-muted">Enter the observation and its evidence. Leave an actual date blank if it was not reported.</p>
    <form onSubmit={submit}><fieldset disabled={busy}>
      <label>Report date<input name="report_date" type="date" required/></label>
      <label>Original report<textarea name="text" maxLength={50000} rows={4} required placeholder="Paste the original supervisor update."/></label>
      <label>Supporting quote<textarea name="source_quote" maxLength={50000} rows={2} required placeholder="Copy the exact sentence that supports this event."/></label>
      <div className="sw-fields"><label>Event type<select name="event_type"><option value="start">Actual start</option><option value="finish">Actual finish</option><option value="progress_observation">Partial progress observation</option></select></label>
      <label>Reported actual date<input name="actual_date" type="date"/></label></div>
      {error&&<p className="sw-error" role="alert">{error}</p>}{message&&<p className="sw-notice" role="status">{message}</p>}
      <button className="sw-primary">{busy?'Saving…':'Save for review'}</button>
    </fieldset></form>
  </section>
}

function ReviewEvent({event,activities,project,canReview,onSaved}:{event:ProposedEvent;activities:ScheduleActivity[];project:string;canReview:boolean;onSaved:()=>Promise<void>}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('')
  const pending=useRef<{signature:string;key:string}|null>(null)
  const supported=event.actual_date && ['start','finish'].includes(event.event_type)
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();if(busy)return
    const fields=new FormData(e.currentTarget)
    const payload={event_id:event.id,expected_revision:event.revision,activity_id:String(fields.get('activity_id')??''),reason:String(fields.get('reason')??'')}
    const signature=JSON.stringify(payload)
    if(pending.current?.signature!==signature)pending.current={signature,key:crypto.randomUUID()}
    setBusy(true);setError('')
    try {await approveActual(project,{...payload,request_key:pending.current.key});await onSaved()}
    catch(e){setError(e instanceof Error?e.message:'Approval failed. Please retry.')}
    finally{setBusy(false)}
  }
  return <article className="sw-event"><div className="sw-row"><strong>{readable(event.event_type)}</strong><span className={`sw-badge ${event.review_status==='verified'?'sw-verified':''}`}>{event.review_status==='verified'?'Verified':'Awaiting review'}</span></div>
    <blockquote>{event.source_quote}</blockquote>
    <p className="sw-muted">Report: {event.report?.report_date??'Not reported'} · Actual: {event.actual_date??'Not reported'}</p>
    <details><summary>View original report</summary><p className="sw-evidence">{event.report?.raw_text??'Evidence unavailable. Do not approve.'}</p></details>
    {event.review_status==='pending'&&canReview&&(supported&&event.report ? <form onSubmit={submit}><fieldset disabled={busy}>
      <label>Schedule activity<select name="activity_id" required defaultValue=""><option value="" disabled>Select the matching L6 activity</option>{activities.filter(a=>a.level==='L6').map(a=><option key={a.id} value={a.id}>{a.external_id} · {a.name} · {a.area??'Area not reported'}</option>)}</select></label>
      <label>Review reason<input name="reason" maxLength={2000} required placeholder="Explain how the evidence supports this activity and date."/></label>
      <button className="sw-primary">{busy?'Verifying…':'Verify and save actual'}</button>
    </fieldset></form>:<p className="sw-muted">Further clarification is needed before an actual date can be approved.</p>)}
    {error&&<p className="sw-error" role="alert">{error}</p>}
  </article>
}

export default function ConnectedWorkspace({authError=''}:{authError?:string}) {
  const auth=useConnectedAuth()
  const access=useConnectedProject()
  const project=access.project?.id??''
  const scope=`${auth.user?.id??''}:${project}`
  const [workspace,setWorkspace]=useState<{scope:string;data:ProjectWorkspaceResponse}>({scope:'',data:empty})
  const data=workspace.scope===scope?workspace.data:empty
  const [error,setError]=useState(''),[loading,setLoading]=useState(false)
  const generation=useRef(0)
  async function refresh(){
    if(!project)return
    const version=++generation.current;setLoading(true);setError('')
    try{const value=await getProjectWorkspace(project);if(version===generation.current)setWorkspace({scope,data:value})}
    catch(e){if(version===generation.current)setError(e instanceof Error?e.message:'Unable to load this project.')}
    finally{if(version===generation.current)setLoading(false)}
  }
  useEffect(()=>{setWorkspace({scope:'',data:empty});setError('');void refresh();return()=>{generation.current++}},[project,auth.user?.id])
  async function signOut(){
    try{await auth.signOut()}catch(cause){setError(cause instanceof Error?cause.message:'Unable to sign out.')}
  }
  if(auth.loading)return <div className="sw-account">Loading your session…</div>
  if(!auth.session)return <div className="sentinel-workspace"><AccountForm initialError={authError}/></div>
  const role=access.role??''
  const canCapture=['site-supervisor','discipline-engineer','planner','project-controls','administrator'].includes(role)
  const canReview=['planner','project-controls','administrator'].includes(role)
  const canAudit=['planner','project-controls','administrator'].includes(role)
  return <div className="sentinel-workspace"><header className="sw-header"><div><a href="/workspace" className="sw-wordmark">SENTINEL<span>●</span></a><p className="sw-muted">Field progress · Human verification</p></div><div className="sw-header-account"><span>{access.identity?.user.email??auth.user?.email}</span><button onClick={signOut}>Sign out</button></div></header>
    <main className="sw-main"><div className="sw-title"><div><p className="sw-eyebrow">SIH26122 · MANUAL WORKFLOW</p><h1>Progress workspace</h1></div><button disabled={loading||!project} onClick={()=>void refresh()}>{loading?'Refreshing…':'Refresh records'}</button></div>
      {(error||access.error)&&<p className="sw-error" role="alert">{error||access.error}</p>}
      {!access.identity&&!access.error&&<p>Loading project access…</p>}
      {access.identity&&access.projects.length===0&&<section className="sw-card"><h2>Your account is ready</h2><p>Project access has not been assigned yet. Your project administrator must add you before you can view or submit work.</p><button onClick={()=>void access.refresh()}>Check access again</button></section>}
      {access.identity&&access.projects.length>0&&<>
        <div className="sw-project"><label>Project<select value={project} onChange={e=>access.selectProject(e.target.value)}>{access.projects.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><span className="sw-badge">{readable(role)}</span></div>
        <p className="sw-muted">Reports and approvals are saved to your project. AI matching is not enabled in this workflow yet.</p>
        <div className="sw-grid">{canCapture&&<CaptureForm key={project} project={project} onSaved={refresh}/>}
          <section className="sw-card"><p className="sw-eyebrow">{canReview?'REVIEW':'PROGRESS RECORDS'}</p><h2>Reported events</h2><p className="sw-muted">Showing up to {data.limit} latest events. Dates become trusted after authorized verification.</p>
            {!data.events.length&&<p>No events reported yet.</p>}
            {data.events.map(event=><ReviewEvent key={`${project}:${event.id}:${event.revision}`} event={event} activities={data.activities} project={project} canReview={canReview} onSaved={refresh}/>)}</section></div>
        <section className="sw-card"><p className="sw-eyebrow">SCHEDULE</p><h2>Planned and verified actuals</h2><p className="sw-muted">Showing up to {data.limit} activities from the active schedule. Unknown dates stay blank.</p>
          {!data.activities.length?<p>No active schedule has been loaded yet.</p>:<div className="sw-table"><table><thead><tr><th>Activity</th><th>Planned start</th><th>Planned finish</th><th>Actual start</th><th>Actual finish</th></tr></thead><tbody>{data.activities.map(a=>{const actual=data.actuals.find(v=>v.activity_id===a.id);return <tr key={a.id}><td><strong>{a.external_id}</strong><br/>{a.name}<small>{a.level} · {a.area??'Area not reported'}</small></td><td>{a.planned_start??'—'}</td><td>{a.planned_finish??'—'}</td><td>{actual?.actual_start??'—'}</td><td>{actual?.actual_finish??'—'}</td></tr>})}</tbody></table></div>}</section>
        {canAudit&&<section className="sw-card"><p className="sw-eyebrow">TRACEABILITY</p><h2>Recent audit history</h2>{!data.audit.length?<p>No recorded actions yet.</p>:data.audit.map(item=><p className="sw-audit" key={item.id}><strong>{readable(item.action)}</strong><span>{new Date(item.created_at).toLocaleString()}</span><small>Record {item.record_id}</small></p>)}</section>}
      </>}
    </main></div>
}
