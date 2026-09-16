import { CalendarDays, ClipboardCheck, ListChecks, PlusCircle, ScrollText } from 'lucide-react'
import { useConnectedProject } from '../../context/ConnectedProjectContext'
import { useConnectedWorkspace } from '../../hooks/useConnectedWorkspace'
import { canCaptureProgress } from '../../lib/manual-capture'
import { connectedOverview } from '../../lib/real-admin'
import { canViewAudit } from '../../lib/real-audit'
import { roleLabel } from '../../lib/connected-shell'

interface DashboardProps { onCaptureProgress?:()=>void; onNavigate?:(page:string)=>void }
const icons=[CalendarDays,ListChecks,ClipboardCheck,ScrollText]

export default function Dashboard({onCaptureProgress,onNavigate}:DashboardProps){
  const access=useConnectedProject()
  const state=useConnectedWorkspace(access.project!.id)
  const overview=state.workspace ? connectedOverview(state.workspace,canViewAudit(access.role)) : null
  const metrics=overview ? [
    ['Schedule activities',overview.activities],['Pending review',overview.pendingEvents],
    ['Verified events',overview.verifiedEvents],['Activities with actuals',overview.actualBearingActivities],
  ] as const : []
  return <div className="dashboard-page min-h-full p-8">
    <div className="mb-7 flex items-start justify-between gap-4">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{color:'#F46F29'}}>Connected project</p>
        <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em]" style={{color:'var(--c-text)'}}>{access.project?.name}</h1>
        <p className="mt-1 text-[13px]" style={{color:'var(--c-muted)'}}>Current role: {roleLabel(access.role)}. Counts below come from the selected project workspace.</p></div>
      {canCaptureProgress(access.role)&&<button onClick={onCaptureProgress} className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white" style={{background:'linear-gradient(135deg,#F46F29,#F59B4C)'}}><PlusCircle size={15}/>Capture progress</button>}
    </div>
    {state.loading&&<p className="text-[13px]" style={{color:'var(--c-muted)'}}>Loading project overview…</p>}
    {state.error&&<div role="alert" className="rounded-[12px] p-4 text-[13px] text-red-700" style={{background:'rgba(220,38,38,.08)'}}>{state.error} <button className="ml-2 font-semibold underline" onClick={()=>void state.refresh()}>Retry</button></div>}
    {overview&&<>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Connected project counts">
        {metrics.map(([label,value],index)=>{const Icon=icons[index];return <button key={label} onClick={()=>onNavigate?.(index===0?'schedule':index===1?'review-queue':'actuals')} className="rounded-[14px] p-5 text-left" style={{background:'var(--c-card)',border:'1px solid var(--c-border)',boxShadow:'var(--c-shadow-card)'}}><Icon size={18} style={{color:'#F46F29'}}/><div className="mt-4 text-[28px] font-bold" style={{color:'var(--c-text)'}}>{value}</div><div className="text-[12px]" style={{color:'var(--c-muted)'}}>{label}</div></button>})}
      </section>
      <section className="mt-5 rounded-[14px] p-5" style={{background:'var(--c-card)',border:'1px solid var(--c-border)'}}>
        <h2 className="text-[15px] font-semibold" style={{color:'var(--c-text)'}}>Connected workflow</h2>
        <p className="mt-1 text-[12px]" style={{color:'var(--c-muted)'}}>Field updates remain pending until an authorized human selects an L6 activity and verifies the actual.</p>
        <div className="mt-4 flex flex-wrap gap-2">{([['Review queue','review-queue'],['Schedule','schedule'],['Verified actuals','actuals'],...(canViewAudit(access.role)?[['Recent audit','audit-log']]:[])] as string[][]).map(([label,route])=><button key={route} onClick={()=>onNavigate?.(route)} className="rounded-[8px] px-3 py-2 text-[12px] font-semibold" style={{background:'var(--c-brand-tint)',color:'#F46F29'}}>{label}</button>)}</div>
        {overview.recentAudit!==null&&<p className="mt-4 text-[11px]" style={{color:'var(--c-subtle)'}}>Recent audit records available: {overview.recentAudit}</p>}
      </section>
    </>}
  </div>
}
