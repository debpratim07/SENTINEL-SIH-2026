import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Clock3, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import { useConnectedAuth } from '../context/ConnectedAuthContext'
import { useConnectedProject } from '../context/ConnectedProjectContext'
import ReviewMatchDrawer from '../components/review/ReviewMatchDrawer'
import { getProjectWorkspace } from '../lib/connected-api'
import type { ProjectWorkspaceResponse, ProposedEvent } from '../lib/connected-types'
import { canReviewActual, eventsWithStatus } from '../lib/real-review'

const emptyWorkspace: ProjectWorkspaceResponse = { events: [], activities: [], actuals: [], audit: [], limit: 200 }
type QueueTab = 'pending' | 'verified'

function readable(value: string) { return value.replace(/_/g, ' ') }

function EventRow({ event, onOpen }: { event: ProposedEvent; onOpen: () => void }) {
  const pending = event.review_status === 'pending'
  return (
    <button onClick={onOpen} className="grid w-full grid-cols-[minmax(260px,1fr)_130px_130px_100px_120px] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--c-page)]" style={{ borderBottom: '1px solid var(--c-border)' }}>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{event.source_quote}</p>
        <p className="mt-1 truncate text-[11px]" style={{ color: 'var(--c-muted)' }}>{event.id}</p>
      </div>
      <span className="text-[12px] capitalize" style={{ color: 'var(--c-text)' }}>{readable(event.event_type)}</span>
      <span className="text-[12px]" style={{ color: 'var(--c-text)' }}>{event.actual_date ?? 'Unknown'}</span>
      <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>Revision {event.revision}</span>
      <span className="flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: pending ? 'rgba(217,119,6,0.12)' : 'rgba(22,163,74,0.12)', color: pending ? '#B45309' : '#16A34A' }}>
        {pending ? <Clock3 size={12} /> : <CheckCircle2 size={12} />}{pending ? 'Pending' : 'Verified'}
      </span>
    </button>
  )
}

export default function ReviewQueue() {
  const auth = useConnectedAuth()
  const access = useConnectedProject()
  const projectId = access.project?.id ?? ''
  const scope = `${auth.user?.id ?? ''}:${projectId}`
  const [workspace, setWorkspace] = useState<{ scope: string; data: ProjectWorkspaceResponse }>({ scope: '', data: emptyWorkspace })
  const data = workspace.scope === scope ? workspace.data : emptyWorkspace
  const [tab, setTab] = useState<QueueTab>('pending')
  const [search, setSearch] = useState('')
  const [openEventId, setOpenEventId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const generation = useRef(0)

  async function refresh() {
    if (!projectId) return
    const version = ++generation.current
    setLoading(true); setError('')
    try {
      const result = await getProjectWorkspace(projectId)
      if (version === generation.current) setWorkspace({ scope, data: result })
    } catch (cause) {
      if (version === generation.current) setError(cause instanceof Error ? cause.message : 'Unable to load the connected review queue.')
    } finally {
      if (version === generation.current) setLoading(false)
    }
  }

  useEffect(() => {
    setWorkspace({ scope: '', data: emptyWorkspace }); setError(''); setOpenEventId(null)
    void refresh()
    return () => { generation.current++ }
  }, [projectId, auth.user?.id])

  const pending = eventsWithStatus(data.events, 'pending')
  const verified = eventsWithStatus(data.events, 'verified')
  const active = tab === 'pending' ? pending : verified
  const normalizedSearch = search.toLowerCase().trim()
  const visible = active.filter(event => !normalizedSearch || [
    event.id, event.event_type, event.source_quote, event.report?.raw_text, event.report?.report_date, event.actual_date,
  ].some(value => value?.toLowerCase().includes(normalizedSearch)))
  const openEvent = data.events.find(event => event.id === openEventId) ?? null
  const canReview = canReviewActual(access.role)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-8 pb-4 pt-7">
        <div className="mb-5 flex items-start justify-between gap-5">
          <div><div className="mb-2 flex items-center gap-2"><span className="rounded-full px-2 py-1 text-[10px] font-bold uppercase" style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A', letterSpacing: '0.07em' }}>Connected</span><span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Human verification</span></div>
            <h1 className="text-[26px] font-bold leading-8 tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Review Queue</h1>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--c-muted)' }}>Review original evidence and manually select the matching L6 activity before a date affects the schedule.</p></div>
          <button onClick={() => void refresh()} disabled={loading} className="flex items-center gap-2 rounded-[9px] px-3.5 py-2 text-[12px] font-semibold disabled:opacity-60" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex w-fit items-center gap-1 rounded-[11px] p-1" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            {([{ id: 'pending', label: 'Pending', count: pending.length }, { id: 'verified', label: 'Verified', count: verified.length }] as const).map(item => <button key={item.id} onClick={() => setTab(item.id)} className="flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[12px] font-semibold" style={{ background: tab === item.id ? 'var(--c-page)' : 'transparent', color: tab === item.id ? 'var(--c-text)' : 'var(--c-muted)', border: tab === item.id ? '1px solid var(--c-border)' : '1px solid transparent' }}>{item.label}<span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: item.id === 'pending' ? 'rgba(217,119,6,0.12)' : 'rgba(22,163,74,0.12)', color: item.id === 'pending' ? '#B45309' : '#16A34A' }}>{item.count}</span></button>)}
          </div>
          <div className="relative w-full max-w-sm"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--c-muted)' }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search real events or evidence…" className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-[13px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} /></div>
        </div>
        <div className="flex items-start gap-2.5 rounded-[11px] px-4 py-3" style={{ background: 'var(--c-brand-tint)', border: '1px solid rgba(244,111,41,0.20)' }}><ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: '#F46F29' }} /><p className="text-[12px] leading-5" style={{ color: 'var(--c-muted)' }}>Activities are not AI-ranked in this phase. The human reviewer chooses an eligible L6 activity; backend checks remain authoritative.</p></div>
        {error && <p role="alert" className="mt-3 rounded-[10px] px-3 py-2 text-[12px] text-red-700" style={{ background: 'rgba(220,38,38,0.08)' }}>{error}</p>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
        <div className="overflow-hidden rounded-[16px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="grid grid-cols-[minmax(260px,1fr)_130px_130px_100px_120px] gap-4 px-5 py-3 text-[10px] font-bold uppercase" style={{ background: 'var(--c-page)', color: 'var(--c-subtle)', letterSpacing: '0.08em', borderBottom: '1px solid var(--c-border)' }}><span>Evidence</span><span>Event type</span><span>Actual date</span><span>Revision</span><span>Status</span></div>
          {loading && workspace.scope !== scope ? <div className="py-16 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>Loading connected events…</div>
          : visible.length === 0 ? <div className="py-16 text-center"><p className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>{search ? 'No events match this search.' : tab === 'pending' ? 'No pending events.' : 'No verified events.'}</p><p className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>{tab === 'pending' ? 'New manual captures will appear here for human review.' : 'Verified events remain available as read-only evidence.'}</p></div>
          : visible.map(event => <EventRow key={`${event.id}:${event.revision}`} event={event} onOpen={() => setOpenEventId(event.id)} />)}
        </div>
      </div>

      <ReviewMatchDrawer open={openEvent !== null} event={openEvent} activities={data.activities} actuals={data.actuals} projectId={projectId} canReview={canReview} onClose={() => setOpenEventId(null)} onApproved={refresh} />
    </div>
  )
}
