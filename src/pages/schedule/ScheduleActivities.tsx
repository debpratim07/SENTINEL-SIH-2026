import { useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Search } from 'lucide-react'
import type { ScheduleActivity, ScheduleActual } from '../../lib/connected-types'
import { displayDate, flattenSchedule, joinSchedule, type ConnectedScheduleRow } from '../../lib/real-schedule'

interface Props { projectId: string; activities: ScheduleActivity[]; actuals: ScheduleActual[]; onSelectActivity: (id: string) => void; search: string; discipline: string; area: string }

const statusStyle = {
  Completed: { color: '#15803D', background: 'rgba(22,163,74,.10)' },
  Started: { color: '#C2410C', background: 'rgba(244,111,41,.11)' },
  'Not started': { color: 'var(--c-muted)', background: 'var(--c-page)' },
}

function matches(row: ConnectedScheduleRow, query: string, discipline: string, area: string) {
  const haystack = [row.external_id, row.name, row.discipline, row.area, row.equipment_ref].filter(Boolean).join(' ').toLowerCase()
  return (!query || haystack.includes(query.toLowerCase())) && (!discipline || row.discipline === discipline) && (!area || row.area === area)
}

function filterTree(rows: ConnectedScheduleRow[], query: string, discipline: string, area: string): ConnectedScheduleRow[] {
  return rows.flatMap(row => {
    const children = filterTree(row.children, query, discipline, area)
    return matches(row, query, discipline, area) || children.length ? [{ ...row, children }] : []
  })
}

function DateValue({ value, verified }: { value: string | null; verified?: boolean }) {
  if (!value) return <span className="italic" style={{ color: 'var(--c-subtle)' }}>Not reported</span>
  return <span className="inline-flex items-center gap-1.5">{displayDate(value)}{verified && <CheckCircle2 size={12} color="#16A34A" />}</span>
}

export default function ScheduleActivities({ projectId, activities, actuals, onSelectActivity, search, discipline, area }: Props) {
  const tree = useMemo(() => joinSchedule(projectId, activities, actuals), [projectId, activities, actuals])
  const allParents = useMemo(() => new Set(tree.filter(row => row.children.length).map(row => row.id)), [tree])
  const [expanded, setExpanded] = useState<Set<string>>(allParents)
  const [level, setLevel] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const filteredTree = useMemo(() => {
    const filtered = filterTree(tree, [search, localSearch].filter(Boolean).join(' '), discipline, area)
    if (!level) return filtered
    const collect = (rows: ConnectedScheduleRow[]): ConnectedScheduleRow[] => rows.flatMap(row => {
      const children = collect(row.children)
      return row.level === level || children.length ? [{ ...row, children }] : []
    })
    return collect(filtered)
  }, [tree, search, localSearch, discipline, area, level])
  const filtered = Boolean(search || localSearch || discipline || area || level)
  const effectiveExpanded = filtered ? new Set(filteredTree.map(row => row.id)) : expanded
  const rows = flattenSchedule(filteredTree, effectiveExpanded)

  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex flex-wrap items-center gap-2 border-b px-7 py-3" style={{ borderColor: 'var(--c-border)' }}>
      <div className="relative"><Search size={13} className="absolute left-3 top-2.5" color="var(--c-muted)" /><input value={localSearch} onChange={event => setLocalSearch(event.target.value)} aria-label="Search activity hierarchy" placeholder="Search real activities" className="h-8 w-56 rounded-[8px] pl-8 pr-3 text-[12px] outline-none" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} /></div>
      <select value={level} onChange={event => setLevel(event.target.value)} className="h-8 rounded-[8px] px-3 text-[12px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}><option value="">All levels</option><option value="L5">L5</option><option value="L6">L6</option></select>
      <button onClick={() => setExpanded(allParents)} className="text-[12px] font-semibold" style={{ color: '#F46F29' }}>Expand all</button>
      <button onClick={() => setExpanded(new Set())} className="text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>Collapse all</button>
      <span className="ml-auto text-[12px]" style={{ color: 'var(--c-muted)' }}>{activities.length} real activities</span>
    </div>
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full text-left" style={{ minWidth: 1080, borderCollapse: 'collapse' }}>
        <thead className="sticky top-0 z-10" style={{ background: 'var(--c-page)' }}><tr>{['Activity','Level','Discipline / Area','Planned start','Planned finish','Actual start','Actual finish','Status'].map(label => <th key={label} className="border-b px-4 py-3 text-[10px] font-bold uppercase tracking-[.08em]" style={{ borderColor: 'var(--c-border)', color: 'var(--c-subtle)' }}>{label}</th>)}</tr></thead>
        <tbody>{rows.map(({ row, depth, hasChildren }) => <tr key={row.id} tabIndex={0} role="button" aria-expanded={hasChildren ? effectiveExpanded.has(row.id) : undefined} aria-label={`${hasChildren ? 'Toggle' : 'Inspect'} ${row.external_id}`} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.currentTarget.click()}}} onClick={() => hasChildren ? setExpanded(previous => { const next = new Set(previous); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next }) : onSelectActivity(row.id)} className="cursor-pointer border-b" style={{ borderColor: 'var(--c-border)' }}>
          <td className="px-4 py-3"><div className="flex items-start gap-2" style={{ paddingLeft: depth * 18 }}>{hasChildren ? (effectiveExpanded.has(row.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-[14px]" />}<div><strong className="block text-[12px]" style={{ color: '#F46F29', fontFamily: 'var(--font-data)' }}>{row.external_id}</strong><span className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{row.name}</span>{row.equipment_ref && <span className="mt-0.5 block text-[11px]" style={{ color: 'var(--c-muted)' }}>{row.equipment_ref}</span>}</div></div></td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}>{row.level}</td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{row.discipline ?? 'Not reported'}<br />{row.area ?? 'Not reported'}</td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}><DateValue value={row.planned_start} /></td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}><DateValue value={row.planned_finish} /></td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}><DateValue value={row.actual?.actual_start ?? null} verified /></td>
          <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}><DateValue value={row.actual?.actual_finish ?? null} verified /></td>
          <td className="px-4 py-3"><span className="rounded-full px-2 py-1 text-[11px] font-semibold" style={statusStyle[row.status]}>{row.status}</span></td>
        </tr>)}</tbody>
      </table>
      {!rows.length && <div className="p-12 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>No real schedule activities match these filters.</div>}
    </div>
  </div>
}
