import { useState, useMemo } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import {
  EXCEPTIONS,
  EXCEPTION_TYPE_CONFIG,
  WORKFLOW_STATUS_CONFIG,
  type Exception,
  type ExceptionType,
  type WorkflowStatus,
} from '../../data/actualsData'

// ── Small badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ExceptionType }) {
  const cfg = EXCEPTION_TYPE_CONFIG[type]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 5,
        padding: '2px 7px',
        fontSize: 11,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

function WorkflowBadge({ status }: { status: WorkflowStatus }) {
  const cfg = WORKFLOW_STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 5,
        padding: '2px 7px',
        fontSize: 11,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

// ── Filter dropdown ───────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const active = !!value
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 cursor-pointer appearance-none rounded-[8px] pl-3 pr-7 text-[12px] font-medium"
        style={{
          background: active ? 'var(--c-brand-tint)' : 'var(--c-card)',
          border: `1px solid ${active ? 'rgba(244,111,41,0.35)' : 'var(--c-border)'}`,
          color: active ? '#F46F29' : 'var(--c-muted)',
          fontFamily: 'var(--font-ui)',
          outline: 'none',
        }}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        strokeWidth={2.5}
        style={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          color: active ? '#F46F29' : 'var(--c-subtle)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ── Table row ─────────────────────────────────────────────────────────────────

function ExceptionRow({ exc, onClick }: { exc: Exception; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="cursor-pointer"
      style={{ borderBottom: '1px solid var(--c-border)' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'var(--c-brand-tint)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
      }}
    >
      {/* Exception */}
      <td className="px-4 py-3">
        <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
          {exc.activityName}
        </div>
        <div
          className="mt-0.5 text-[10px]"
          style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
        >
          {exc.id}
        </div>
      </td>
      {/* Type */}
      <td className="px-4 py-3">
        <TypeBadge type={exc.type} />
      </td>
      {/* Actual */}
      <td
        className="px-4 py-3 text-[11px] font-medium"
        style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)', whiteSpace: 'nowrap' }}
      >
        {exc.actualId}
      </td>
      {/* Discipline */}
      <td
        className="px-4 py-3 text-[12px]"
        style={{
          color: exc.discipline ? 'var(--c-text)' : 'var(--c-subtle)',
          fontStyle: exc.discipline ? 'normal' : 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        {exc.discipline ?? 'Not reported'}
      </td>
      {/* Area */}
      <td
        className="px-4 py-3 text-[12px]"
        style={{
          color: exc.area ? 'var(--c-text)' : 'var(--c-subtle)',
          fontStyle: exc.area ? 'normal' : 'italic',
        }}
      >
        {exc.area ?? 'Not reported'}
      </td>
      {/* Source */}
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>
        {exc.source}
      </td>
      {/* Workflow Status */}
      <td className="px-4 py-3">
        <WorkflowBadge status={exc.workflowStatus} />
      </td>
      {/* Owner */}
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>
        {exc.owner ?? (
          <span className="italic" style={{ color: 'var(--c-subtle)' }}>
            Unassigned
          </span>
        )}
      </td>
    </tr>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

interface Props {
  onSelectException: (id: string) => void
}

export default function ExceptionsPage({ onSelectException }: Props) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDiscipline, setFilterDiscipline] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterWorkflow, setFilterWorkflow] = useState('')
  const [filterSource, setFilterSource] = useState('')

  const hasFilters = !!(search || filterType || filterDiscipline || filterArea || filterWorkflow || filterSource)

  const disciplines = [...new Set(EXCEPTIONS.filter((e) => e.discipline).map((e) => e.discipline as string))]
  const areas = [...new Set(EXCEPTIONS.filter((e) => e.area).map((e) => e.area as string))]
  const sources = [...new Set(EXCEPTIONS.map((e) => e.source))]
  const typeOptions = (Object.keys(EXCEPTION_TYPE_CONFIG) as ExceptionType[]).map(
    (k) => EXCEPTION_TYPE_CONFIG[k].label
  )
  const workflowOptions = (Object.keys(WORKFLOW_STATUS_CONFIG) as WorkflowStatus[]).map(
    (k) => WORKFLOW_STATUS_CONFIG[k].label
  )

  const open = EXCEPTIONS.filter((e) => e.workflowStatus === 'open').length
  const conflict = EXCEPTIONS.filter((e) => e.type === 'conflicting').length
  const incomplete = EXCEPTIONS.filter((e) => e.type === 'incomplete').length
  const unmatched = EXCEPTIONS.filter((e) => e.type === 'unmatched').length

  const filtered = useMemo(() => {
    let rows = [...EXCEPTIONS]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.activityName.toLowerCase().includes(q) ||
          e.actualId.toLowerCase().includes(q) ||
          (e.discipline ?? '').toLowerCase().includes(q)
      )
    }
    if (filterType) {
      const key = (Object.keys(EXCEPTION_TYPE_CONFIG) as ExceptionType[]).find(
        (k) => EXCEPTION_TYPE_CONFIG[k].label === filterType
      )
      if (key) rows = rows.filter((e) => e.type === key)
    }
    if (filterDiscipline) rows = rows.filter((e) => e.discipline === filterDiscipline)
    if (filterArea) rows = rows.filter((e) => e.area === filterArea)
    if (filterWorkflow) {
      const key = (Object.keys(WORKFLOW_STATUS_CONFIG) as WorkflowStatus[]).find(
        (k) => WORKFLOW_STATUS_CONFIG[k].label === filterWorkflow
      )
      if (key) rows = rows.filter((e) => e.workflowStatus === key)
    }
    if (filterSource) rows = rows.filter((e) => e.source === filterSource)
    return rows
  }, [search, filterType, filterDiscipline, filterArea, filterWorkflow, filterSource])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          flexShrink: 0,
          padding: '22px 28px 0',
          background: 'var(--c-page)',
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        {/* Title row */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1
              className="text-[22px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--c-text)' }}
            >
              Exceptions
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Resolve execution records that cannot safely update schedule truth.
            </p>
          </div>
        </div>

        {/* Inline counts */}
        <div className="mb-0 flex flex-wrap items-center gap-x-5 gap-y-1 pb-4">
          {[
            { label: 'Open', value: open, color: '#DC2626' },
            { label: 'Conflict', value: conflict, color: '#DC2626' },
            { label: 'Incomplete', value: incomplete, color: '#64748B' },
            { label: 'Unmatched', value: unmatched, color: '#64748B' },
          ].map((m, i) => (
            <div key={m.label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="h-3.5 w-px"
                  style={{ background: 'var(--c-border)' }}
                  aria-hidden="true"
                />
              )}
              <span
                className="text-[13px] font-bold"
                style={{ color: m.color, fontFamily: 'var(--font-ui)' }}
              >
                {m.value}
              </span>
              <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          <div className="relative flex-shrink-0">
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
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search exceptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-[8px] pl-8 pr-3 text-[12px]"
              style={{
                width: 196,
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

          <FilterSelect label="Type" value={filterType} options={typeOptions} onChange={setFilterType} />
          <FilterSelect label="Discipline" value={filterDiscipline} options={disciplines} onChange={setFilterDiscipline} />
          <FilterSelect label="Area" value={filterArea} options={areas} onChange={setFilterArea} />
          <FilterSelect label="Workflow Status" value={filterWorkflow} options={workflowOptions} onChange={setFilterWorkflow} />
          <FilterSelect label="Source" value={filterSource} options={sources} onChange={setFilterSource} />

          {hasFilters && (
            <button
              onClick={() => {
                setSearch('')
                setFilterType('')
                setFilterDiscipline('')
                setFilterArea('')
                setFilterWorkflow('')
                setFilterSource('')
              }}
              className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[12px] font-medium"
              style={{
                color: 'var(--c-muted)',
                border: '1px solid var(--c-border)',
                background: 'var(--c-card)',
              }}
            >
              <X size={11} strokeWidth={2.5} aria-hidden="true" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table
          className="w-full text-left"
          style={{ borderCollapse: 'collapse', minWidth: 940 }}
          aria-label="Exceptions table"
        >
          <thead>
            <tr
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 5,
                background: 'var(--c-page)',
                borderBottom: '1px solid var(--c-border)',
              }}
            >
              {['EXCEPTION', 'TYPE', 'ACTUAL', 'DISCIPLINE', 'AREA', 'SOURCE', 'WORKFLOW STATUS', 'OWNER'].map(
                (col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase"
                    style={{
                      color: 'var(--c-subtle)',
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((exc) => (
              <ExceptionRow
                key={exc.id}
                exc={exc}
                onClick={() => onSelectException(exc.id)}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-14 text-center text-[13px]"
                  style={{ color: 'var(--c-muted)' }}
                >
                  No exceptions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div
          className="px-4 py-3 text-[11px]"
          style={{ color: 'var(--c-subtle)', borderTop: '1px solid var(--c-border)' }}
        >
          {filtered.length} of {EXCEPTIONS.length} exceptions shown
          {hasFilters && ' · filters active'}
        </div>
      </div>
    </div>
  )
}
