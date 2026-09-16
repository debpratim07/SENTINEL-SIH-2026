import { WorkflowLoading, WorkflowEmpty } from '../../components/industrial-flow/WorkflowFeedback'
import { useMemo, useState } from 'react'
import { RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import { useConnectedProject } from '../../context/ConnectedProjectContext'
import { useConnectedWorkspace } from '../../hooks/useConnectedWorkspace'
import ScheduleActivities from './ScheduleActivities'
import ScheduleTimeline from './ScheduleTimeline'

type Tab = 'activities' | 'timeline'
interface Props { onSelectActivity: (id: string) => void }

export default function SchedulePage({ onSelectActivity }: Props) {
  const access = useConnectedProject()
  const projectId = access.project!.id
  const { workspace, loading, error, refresh } = useConnectedWorkspace(projectId)
  const [tab, setTab] = useState<Tab>('activities')
  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [area, setArea] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const disciplines = useMemo(() => [...new Set((workspace?.activities ?? []).flatMap(a => a.discipline ? [a.discipline] : []))].sort(), [workspace])
  const areas = useMemo(() => [...new Set((workspace?.activities ?? []).flatMap(a => a.area ? [a.area] : []))].sort(), [workspace])

  return <div className="schedule-page flex min-h-0 flex-1 flex-col overflow-hidden">
    <header className="shrink-0 border-b px-7 pt-5" style={{ background: 'var(--c-page)', borderColor: 'var(--c-border)' }}>
      <div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: '#F46F29' }}>{access.project?.name}</p><h1 className="text-[22px] font-bold" style={{ color: 'var(--c-text)' }}>Schedule</h1><p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>Real planned activities with persisted, human-verified actuals.</p></div>
        <div className="flex items-center gap-2"><div className="relative"><Search size={13} className="absolute left-3 top-2.5" color="var(--c-muted)" /><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search schedule activities" placeholder="Search activities" className="h-8 w-52 rounded-[8px] pl-8 pr-3 text-[12px] outline-none" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} /></div><button onClick={() => setFiltersOpen(value => !value)} className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[12px] font-semibold" style={{ background: discipline || area ? 'var(--c-brand-tint)' : 'var(--c-card)', border: '1px solid var(--c-border)', color: discipline || area ? '#F46F29' : 'var(--c-muted)' }}><SlidersHorizontal size={13} />Filters</button><button onClick={() => void refresh()} aria-label="Refresh schedule" className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}><RefreshCw size={13} /></button></div></div>
      {filtersOpen && <div className="mb-3 flex gap-2"><select value={discipline} onChange={event => setDiscipline(event.target.value)} className="h-8 rounded-[8px] px-3 text-[12px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}><option value="">All disciplines</option>{disciplines.map(value => <option key={value}>{value}</option>)}</select><select value={area} onChange={event => setArea(event.target.value)} className="h-8 rounded-[8px] px-3 text-[12px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}><option value="">All areas</option>{areas.map(value => <option key={value}>{value}</option>)}</select>{(discipline || area) && <button onClick={() => { setDiscipline(''); setArea('') }} className="text-[12px] font-semibold" style={{ color: '#F46F29' }}>Clear</button>}</div>}
      <nav className="flex gap-1">{(['activities','timeline'] as const).map(value => <button key={value} onClick={() => setTab(value)} className="px-4 py-2 text-[13px] font-semibold capitalize" style={{ color: tab === value ? '#F46F29' : 'var(--c-muted)', borderBottom: tab === value ? '2px solid #F46F29' : '2px solid transparent' }}>{value}</button>)}</nav>
    </header>
    {loading && <WorkflowLoading>Loading project records…</WorkflowLoading>}
    {!loading && error && <div className="m-7 rounded-[12px] p-5 text-[13px]" role="alert" style={{ background: '#FEF2F2', color: '#B91C1C' }}>{error}<button onClick={() => void refresh()} className="ml-3 font-bold underline">Retry</button></div>}
    {!loading && !error && workspace && !workspace.activities.length && <WorkflowEmpty kind="activity" title="No schedule activities">This project has no active schedule activities.</WorkflowEmpty>}
    {!loading && !error && workspace && workspace.activities.length > 0 && (tab === 'activities' ? <ScheduleActivities projectId={projectId} activities={workspace.activities} actuals={workspace.actuals} onSelectActivity={onSelectActivity} search={search} discipline={discipline} area={area} /> : <ScheduleTimeline projectId={projectId} activities={workspace.activities} actuals={workspace.actuals} onSelectActivity={onSelectActivity} search={search} discipline={discipline} area={area} />)}
  </div>
}
