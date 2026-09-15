import { useMemo } from 'react'
import type { ScheduleActivity, ScheduleActual } from '../../lib/connected-types'
import { displayDate, flattenSchedule, joinSchedule, timelineBounds } from '../../lib/real-schedule'

interface Props { projectId: string; activities: ScheduleActivity[]; actuals: ScheduleActual[]; onSelectActivity: (id: string) => void; search: string; discipline: string; area: string }

const DAY = 86_400_000
function time(value: string) { return new Date(`${value}T00:00:00Z`).getTime() }

export default function ScheduleTimeline({ projectId, activities, actuals, onSelectActivity, search, discipline, area }: Props) {
  const visible = useMemo(() => activities.filter(activity => {
    const text = [activity.external_id, activity.name, activity.discipline, activity.area].filter(Boolean).join(' ').toLowerCase()
    return (!search || text.includes(search.toLowerCase())) && (!discipline || activity.discipline === discipline) && (!area || activity.area === area)
  }), [activities, search, discipline, area])
  const visibleIds = new Set(visible.map(activity => activity.id))
  const roots = joinSchedule(projectId, activities.filter(activity => visibleIds.has(activity.id) || visible.some(child => child.parent_id === activity.id)), actuals)
  const rows = flattenSchedule(roots, new Set(roots.map(row => row.id)))
  const bounds = timelineBounds(visible, actuals.filter(actual => visibleIds.has(actual.activity_id)))
  if (!bounds) return <div className="p-12 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>No persisted planned or actual dates are available for this view.</div>
  const start = time(bounds.start)
  const span = Math.max(1, (time(bounds.finish) - start) / DAY + 1)
  const point = (value: string) => Math.max(0, Math.min(100, ((time(value) - start) / DAY / span) * 100))
  const width = (from: string, to: string) => Math.max(1, (((time(to) - time(from)) / DAY + 1) / span) * 100)

  return <div className="min-h-0 flex-1 overflow-auto p-7">
    <div className="mb-4 flex items-center justify-between text-[11px]" style={{ color: 'var(--c-muted)' }}><span>{displayDate(bounds.start)}</span><span>Planned windows · verified actual markers</span><span>{displayDate(bounds.finish)}</span></div>
    <div className="overflow-hidden rounded-[14px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
      {rows.map(({ row, depth }) => <div key={row.id} className="grid min-h-[64px] grid-cols-[280px_1fr] border-b last:border-b-0" style={{ borderColor: 'var(--c-border)' }}>
        <button onClick={() => onSelectActivity(row.id)} className="px-4 py-3 text-left" style={{ paddingLeft: 16 + depth * 20, background: row.level === 'L5' ? 'var(--c-page)' : 'transparent' }}><strong className="block text-[11px]" style={{ color: '#F46F29', fontFamily: 'var(--font-data)' }}>{row.external_id} · {row.level}</strong><span className="block truncate text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{row.name}</span></button>
        <div className="relative my-3 mr-5 rounded-[8px]" style={{ minHeight: 38, background: 'var(--c-page)' }}>
          {row.planned_start && row.planned_finish && <div title={`Plan: ${row.planned_start} to ${row.planned_finish}`} className="absolute top-[8px] h-[10px] rounded-full" style={{ left: `${point(row.planned_start)}%`, width: `${width(row.planned_start, row.planned_finish)}%`, background: 'rgba(100,116,139,.35)' }} />}
          {row.actual?.actual_start && <div title={`Verified actual start: ${row.actual.actual_start}`} className="absolute top-[23px] h-[11px] w-[11px] -translate-x-1/2 rounded-full" style={{ left: `${point(row.actual.actual_start)}%`, background: '#F46F29', boxShadow: '0 0 0 3px rgba(244,111,41,.18)' }} />}
          {row.actual?.actual_finish && <div title={`Verified actual finish: ${row.actual.actual_finish}`} className="absolute top-[23px] h-[11px] w-[11px] -translate-x-1/2 rounded-[2px]" style={{ left: `${point(row.actual.actual_finish)}%`, background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,.14)' }} />}
          {!row.planned_start && !row.planned_finish && !row.actual?.actual_start && !row.actual?.actual_finish && <span className="absolute left-3 top-2.5 text-[11px] italic" style={{ color: 'var(--c-subtle)' }}>No dates reported</span>}
        </div>
      </div>)}
    </div>
    <div className="mt-4 flex gap-5 text-[11px]" style={{ color: 'var(--c-muted)' }}><span><i className="mr-1 inline-block h-2 w-5 rounded bg-slate-400/40" />Planned window</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#F46F29]" />Verified start</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] bg-[#16A34A]" />Verified finish</span></div>
  </div>
}
