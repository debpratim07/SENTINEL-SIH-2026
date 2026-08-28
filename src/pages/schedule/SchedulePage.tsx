import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Download, X } from 'lucide-react'
import ScheduleActivities from './ScheduleActivities'
import ScheduleTimeline from './ScheduleTimeline'
import { useScheduleData } from '../../context/ScheduleDataContext'
import { flattenAll } from '../../data/scheduleData'

type Tab = 'activities' | 'timeline'

interface Props {
  onSelectActivity: (id: string) => void
}

export default function SchedulePage({ onSelectActivity }: Props) {
  const schedule = useScheduleData()
  const [tab, setTab] = useState<Tab>('activities')
  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [area, setArea] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasFilters = discipline || area
  const leafActivities = useMemo(() => flattenAll(schedule.tree).filter((activity) => !activity.isGroup), [schedule.tree])
  const disciplines = useMemo(
    () => [...new Set(leafActivities.map((activity) => activity.discipline))].sort(),
    [leafActivities],
  )
  const areas = useMemo(
    () => [...new Set(leafActivities.map((activity) => activity.area))].sort(),
    [leafActivities],
  )

  function clearFilters() {
    setDiscipline('')
    setArea('')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {/* Page header */}
      <div
        style={{
          flexShrink: 0,
          padding: '20px 28px 0',
          background: 'var(--c-page)',
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1
              className="text-[22px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--c-text)' }}
            >
              Schedule
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Compare planned activities with verified field execution.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 mt-1">
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                strokeWidth={2}
                style={{
                  position: 'absolute',
                  left: 9,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--c-subtle)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="search"
                placeholder="Search activities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-[9px] pl-7 pr-3 py-1.5 text-[12px] w-52 outline-none transition-all"
                style={{
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                }}
              />
            </div>

            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px] font-medium transition-colors duration-150"
                style={{
                  background: hasFilters ? 'rgba(244,111,41,0.08)' : 'var(--c-card)',
                  border: `1px solid ${hasFilters ? 'rgba(244,111,41,0.35)' : 'var(--c-border)'}`,
                  color: hasFilters ? '#F46F29' : 'var(--c-text)',
                }}
              >
                <SlidersHorizontal size={12} strokeWidth={2} />
                Filters
                {hasFilters && (
                  <span
                    className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: '#F46F29', color: '#fff' }}
                  >
                    {[discipline, area].filter(Boolean).length}
                  </span>
                )}
              </button>

              {filtersOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-20 rounded-[12px] p-4 flex flex-col gap-3"
                  style={{
                    background: 'var(--c-card)',
                    border: '1px solid var(--c-border)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: 220,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--c-text)' }}>
                      Filters
                    </span>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      style={{ color: 'var(--c-subtle)' }}
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                      Discipline
                    </label>
                    <select
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className="mt-1 w-full rounded-[8px] px-2.5 py-1.5 text-[12px] outline-none"
                      style={{
                        background: 'var(--c-page)',
                        border: '1px solid var(--c-border)',
                        color: 'var(--c-text)',
                      }}
                    >
                      <option value="">All disciplines</option>
                      {disciplines.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                      Area
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="mt-1 w-full rounded-[8px] px-2.5 py-1.5 text-[12px] outline-none"
                      style={{
                        background: 'var(--c-page)',
                        border: '1px solid var(--c-border)',
                        color: 'var(--c-text)',
                      }}
                    >
                      <option value="">All areas</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-1 text-[11px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: '#F46F29', textAlign: 'left' }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Export */}
            <button
              onClick={schedule.exportCsv}
              disabled={schedule.loading || schedule.tree.length === 0}
              className="flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
              }}
            >
              <Download size={12} strokeWidth={2} />
              Export
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1">
          {(['activities', 'timeline'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-[13px] font-medium transition-colors duration-150"
              style={{
                color: tab === t ? '#F46F29' : 'var(--c-muted)',
                borderBottom: tab === t ? '2px solid #F46F29' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {t === 'activities' ? 'Activities' : 'Timeline'}
            </button>
          ))}
        </div>
      </div>

      {/* Content — single vertical scroll container for this tab */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {schedule.loading ? (
          <div className="flex flex-1 items-center justify-center text-[13px]" style={{ color: 'var(--c-muted)' }}>
            Loading project schedule…
          </div>
        ) : schedule.error ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>{schedule.error}</p>
              <button onClick={schedule.reload} className="mt-3 text-[12px] font-semibold" style={{ color: '#F46F29' }}>
                Retry
              </button>
            </div>
          </div>
        ) : tab === 'activities' ? (
          <ScheduleActivities onSelectActivity={onSelectActivity} pageSearch={search} />
        ) : (
          <ScheduleTimeline
            onSelectActivity={onSelectActivity}
            discipline={discipline}
            area={area}
            search={search}
          />
        )}
      </div>
    </div>
  )
}
