import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Minus,
} from 'lucide-react'
import { FilterDropdown } from '../../components/FilterDropdown'
import {
  flattenTree,
  flattenAll,
  getAllGroupIds,
  STATUS_CONFIG,
  TRUST_CONFIG,
  fmtDate,
  type ScheduleActivity,
  type ScheduleStatus,
} from '../../data/scheduleData'
import { useScheduleData } from '../../context/ScheduleDataContext'

interface Props {
  onSelectActivity: (id: string) => void
  pageSearch?: string
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color, letterSpacing: '0.02em' }}
    >
      {cfg.label}
    </span>
  )
}

function ActualStartCell({ activity }: { activity: ScheduleActivity }) {
  if (activity.actualStartConflict && activity.actualStartConflict.length > 0) {
    return (
      <div>
        <div className="flex items-center gap-1">
          <AlertTriangle size={11} strokeWidth={2.5} style={{ color: '#DC2626', flexShrink: 0 }} />
          <span className="text-[12px] font-semibold" style={{ color: '#DC2626' }}>
            Conflicting
          </span>
        </div>
        <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
          {activity.actualStartConflict.map(fmtDate).join(' · ')}
        </div>
      </div>
    )
  }
  if (!activity.actualStart) {
    return <span className="text-[13px]" style={{ color: 'var(--c-subtle)' }}>—</span>
  }
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
          {fmtDate(activity.actualStart)}
        </span>
        {activity.trust === 'verified' && (
          <CheckCircle2 size={11} strokeWidth={2.5} style={{ color: '#16A34A' }} />
        )}
      </div>
      {activity.startVarianceDays !== null && activity.startVarianceDays !== 0 && (
        <div
          className="mt-0.5 text-[11px] font-medium"
          style={{ color: activity.startVarianceDays > 0 ? '#D97706' : '#16A34A' }}
        >
          {activity.startVarianceDays > 0 ? `+${activity.startVarianceDays}d late` : `${activity.startVarianceDays}d early`}
        </div>
      )}
    </div>
  )
}

function VarianceCell({ days }: { days: number | null }) {
  if (days === null)
    return <span className="text-[13px]" style={{ color: 'var(--c-subtle)' }}>—</span>
  if (days === 0)
    return <span className="text-[12px]" style={{ color: '#16A34A' }}>On time</span>
  const late = days > 0
  return (
    <span
      className="text-[13px] font-semibold"
      style={{ color: late ? '#D97706' : '#16A34A', fontVariantNumeric: 'tabular-nums' }}
    >
      {late ? `+${days}d` : `${days}d`}
    </span>
  )
}

const STATUS_OPTIONS = [
  { value: 'in-progress',    label: 'In Progress' },
  { value: 'started-late',   label: 'Started Late' },
  { value: 'finished-late',  label: 'Finished Late' },
  { value: 'needs-review',   label: 'Needs Review' },
  { value: 'missing-actual', label: 'Missing Actual' },
  { value: 'conflict',       label: 'Conflict' },
  { value: 'not-started',    label: 'Not Started' },
  { value: 'complete',       label: 'Complete' },
]
const VARIANCE_OPTIONS = [
  { value: 'ahead',       label: 'Ahead' },
  { value: 'on-plan',     label: 'On Plan' },
  { value: '1-2-late',    label: '1–2 Days Late' },
  { value: '3-plus-late', label: '3+ Days Late' },
]
const LEVEL_OPTIONS = [
  { value: 'L5', label: 'L5' },
  { value: 'L6', label: 'L6' },
]

function matchVariance(days: number | null, filter: string): boolean {
  if (!filter) return true
  if (days === null) return false
  if (filter === 'ahead') return days < 0
  if (filter === 'on-plan') return days === 0
  if (filter === '1-2-late') return days >= 1 && days <= 2
  if (filter === '3-plus-late') return days >= 3
  return true
}

function filterTree(
  activities: ScheduleActivity[],
  discipline: string,
  area: string,
  search: string,
  status: string,
  variance: string,
  level: string,
): ScheduleActivity[] {
  return activities
    .map((a) => {
      if (!a.isGroup) {
        const matchDiscipline = discipline === 'All' || a.discipline === discipline
        const matchArea = area === 'All' || a.area === area
        const matchSearch = search === '' || a.label.toLowerCase().includes(search.toLowerCase())
        const matchStatus = !status || a.status === status
        const matchVarianceVal = matchVariance(a.startVarianceDays, variance)
        const matchLevel = !level || a.level === level
        return matchDiscipline && matchArea && matchSearch && matchStatus && matchVarianceVal && matchLevel ? a : null
      }
      const filteredChildren = filterTree(a.children ?? [], discipline, area, search, status, variance, level)
      if (filteredChildren.length === 0) return null
      return { ...a, children: filteredChildren }
    })
    .filter(Boolean) as ScheduleActivity[]
}

export default function ScheduleActivities({ onSelectActivity, pageSearch = '' }: Props) {
  const { tree, metrics } = useScheduleData()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => getAllGroupIds(tree))
  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('All')
  const [area, setArea] = useState('All')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterVariance, setFilterVariance] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const leafActivities = useMemo(() => flattenAll(tree).filter((activity) => !activity.isGroup), [tree])
  const disciplines = useMemo(
    () => ['All', ...new Set(leafActivities.map((activity) => activity.discipline))],
    [leafActivities],
  )
  const areas = useMemo(
    () => ['All', ...new Set(leafActivities.map((activity) => activity.area))],
    [leafActivities],
  )

  useEffect(() => {
    setExpandedIds(getAllGroupIds(tree))
  }, [tree])

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function expandAll() {
    const all = new Set<string>()
    function traverse(items: ScheduleActivity[]) {
      for (const item of items) {
        if (item.isGroup) all.add(item.id)
        if (item.children) traverse(item.children)
      }
    }
    traverse(tree)
    setExpandedIds(all)
  }

  function collapseAll() {
    setExpandedIds(new Set())
  }

  const filteredTree = filterTree(tree, discipline, area, search, filterStatus, filterVariance, filterLevel)
  const pageFilteredTree = pageSearch.trim()
    ? filterTree(filteredTree, 'All', 'All', pageSearch, '', '', '')
    : filteredTree
  const rows = flattenTree(pageFilteredTree, expandedIds)
  const hasFilters = discipline !== 'All' || area !== 'All' || search !== '' || !!filterStatus || !!filterVariance || !!filterLevel

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Compact metrics row */}
      <div
        className="flex items-center gap-6 px-8"
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        {[
          { label: 'Actual Progress', value: `${metrics.actualProgress.toFixed(1)}%`, color: '#F46F29' },
          { label: 'Planned Progress', value: `${metrics.plannedProgress.toFixed(1)}%`, color: 'var(--c-text)' },
          { label: 'Variance', value: `${metrics.variance > 0 ? '+' : metrics.variance < 0 ? '−' : ''}${Math.abs(metrics.variance).toFixed(1)}%`, color: metrics.variance === 0 ? '#16A34A' : '#D97706' },
          { label: 'Started Late', value: String(metrics.startedLate), color: '#D97706' },
          { label: 'Finished Late', value: String(metrics.finishedLate), color: '#D97706' },
        ].map((m, i) => (
          <div key={m.label} className="flex items-center gap-3">
            {i > 0 && (
              <div className="h-4 w-px shrink-0" style={{ background: 'var(--c-border)' }} />
            )}
            <div>
              <span
                className="block text-[11px] font-semibold uppercase"
                style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em' }}
              >
                {m.label}
              </span>
              <span
                className="mt-0.5 block text-[17px] font-bold leading-none"
                style={{
                  color: m.color,
                  fontFamily: 'var(--font-ui)',
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {m.value}
              </span>
            </div>
          </div>
        ))}

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setDiscipline('All'); setArea('All'); setFilterStatus(''); setFilterVariance(''); setFilterLevel('') }}
            className="ml-auto text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: '#F46F29' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-8 py-3"
        style={{ borderBottom: '1px solid var(--c-border)' }}
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            strokeWidth={2}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--c-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-[9px] py-1.5 pl-8 pr-3 text-[13px]"
            style={{
              width: 200,
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-text)',
              outline: 'none',
              fontFamily: 'var(--font-ui)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
          />
        </div>

        {/* Discipline filter */}
        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="rounded-[9px] px-2.5 py-1.5 text-[13px]"
          style={{
            background: discipline !== 'All' ? 'rgba(244,111,41,0.08)' : 'var(--c-card)',
            border: discipline !== 'All' ? '1px solid rgba(244,111,41,0.35)' : '1px solid var(--c-border)',
            color: discipline !== 'All' ? '#F46F29' : 'var(--c-muted)',
            outline: 'none',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d === 'All' ? 'Discipline ▾' : d}
            </option>
          ))}
        </select>

        {/* Area filter */}
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="rounded-[9px] px-2.5 py-1.5 text-[13px]"
          style={{
            background: area !== 'All' ? 'rgba(244,111,41,0.08)' : 'var(--c-card)',
            border: area !== 'All' ? '1px solid rgba(244,111,41,0.35)' : '1px solid var(--c-border)',
            color: area !== 'All' ? '#F46F29' : 'var(--c-muted)',
            outline: 'none',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {areas.map((a) => (
            <option key={a} value={a}>
              {a === 'All' ? 'Area ▾' : a}
            </option>
          ))}
        </select>

        <FilterDropdown label="Status" allLabel="All Statuses" options={STATUS_OPTIONS} value={filterStatus} onChange={setFilterStatus} dropdownMinWidth={160} />
        <FilterDropdown label="Variance" allLabel="All Variance" options={VARIANCE_OPTIONS} value={filterVariance} onChange={setFilterVariance} dropdownMinWidth={160} />
        <FilterDropdown label="Level" allLabel="All Levels" options={LEVEL_OPTIONS} value={filterLevel} onChange={setFilterLevel} dropdownMinWidth={120} />

        <div className="ml-auto flex gap-2">
          <button
            onClick={expandAll}
            className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-100"
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-muted)',
            }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-100"
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-muted)',
            }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-8 pt-4" style={{ overflowX: 'auto', paddingBottom: 40 }}>
        <table
          style={{
            width: '100%',
            minWidth: 960,
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'fixed',
          }}
          aria-label="Schedule activities"
        >
          <colgroup>
            <col style={{ width: '26%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              {[
                'Activity',
                'Discipline',
                'Planned Start',
                'Actual Start',
                'Planned Finish',
                'Actual Finish',
                'Variance',
                'Status',
              ].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="pb-2 text-left text-[10px] font-bold uppercase"
                  style={{
                    color: 'var(--c-subtle)',
                    letterSpacing: '0.09em',
                    paddingRight: 12,
                    borderBottom: '1px solid var(--c-border)',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ paddingTop: 48, textAlign: 'center', color: 'var(--c-muted)' }}>
                  No activities match current filters.
                </td>
              </tr>
            )}
            {rows.map(({ activity, depth, hasChildren, isExpanded }, idx) => {
              const isGroup = activity.isGroup
              const isClickable = !isGroup
              const statusCfg = STATUS_CONFIG[activity.status]

              return (
                <tr
                  key={activity.id}
                  onClick={() => {
                    if (isGroup) toggleExpand(activity.id)
                    else onSelectActivity(activity.id)
                  }}
                  style={{
                    cursor: isGroup ? 'default' : 'pointer',
                    borderBottom: `1px solid var(--c-border)`,
                  }}
                  onMouseEnter={(e) => {
                    if (isClickable)
                      (e.currentTarget as HTMLTableRowElement).style.background = 'var(--c-page)'
                  }}
                  onMouseLeave={(e) => {
                    if (isClickable)
                      (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                  }}
                >
                  {/* Activity */}
                  <td
                    style={{
                      paddingTop: isGroup ? 10 : 12,
                      paddingBottom: isGroup ? 10 : 12,
                      paddingRight: 12,
                      paddingLeft: depth * 18,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {hasChildren ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpand(activity.id)
                          }}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[var(--c-border)]"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronDown size={12} strokeWidth={2.5} style={{ color: 'var(--c-muted)' }} />
                          ) : (
                            <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--c-muted)' }} />
                          )}
                        </button>
                      ) : (
                        <span className="w-5 shrink-0" />
                      )}
                      <span
                        className="truncate"
                        style={{
                          color: 'var(--c-text)',
                          fontWeight: isGroup ? 600 : 500,
                          fontFamily: 'var(--font-ui)',
                          fontSize: isGroup ? 12 : 13,
                          letterSpacing: isGroup ? '0.02em' : 0,
                        }}
                      >
                        {activity.label}
                      </span>
                      {!isGroup && (
                        <span
                          className="shrink-0 text-[10px]"
                          style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-ui)' }}
                        >
                          {activity.level}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Discipline */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && (
                      <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                        {activity.discipline}
                      </span>
                    )}
                  </td>

                  {/* Planned Start */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && (
                      <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                        {fmtDate(activity.plannedStart)}
                      </span>
                    )}
                  </td>

                  {/* Actual Start */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && <ActualStartCell activity={activity} />}
                  </td>

                  {/* Planned Finish */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && (
                      <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                        {fmtDate(activity.plannedFinish)}
                      </span>
                    )}
                  </td>

                  {/* Actual Finish */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && (
                      <span
                        className="text-[13px]"
                        style={{
                          color: activity.actualFinish ? 'var(--c-text)' : 'var(--c-subtle)',
                          fontStyle: activity.actualFinish ? 'normal' : 'italic',
                        }}
                      >
                        {activity.actualFinish ? fmtDate(activity.actualFinish) : 'Not reported'}
                      </span>
                    )}
                  </td>

                  {/* Variance */}
                  <td style={{ paddingRight: 12 }}>
                    {!isGroup && <VarianceCell days={activity.startVarianceDays} />}
                  </td>

                  {/* Status */}
                  <td>
                    {!isGroup && <StatusBadge status={activity.status} />}
                    {isGroup && (
                      <div className="flex items-center gap-1">
                        {activity.trust === 'conflict' && (
                          <AlertTriangle size={12} strokeWidth={2} style={{ color: '#DC2626' }} />
                        )}
                        {activity.status !== 'not-started' && (
                          <span
                            className="text-[11px]"
                            style={{ color: statusCfg.color }}
                          >
                            {statusCfg.label}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
