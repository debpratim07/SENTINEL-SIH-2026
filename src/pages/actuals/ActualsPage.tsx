import { useState, useMemo } from 'react'
import { Search, ChevronDown, X, Plus } from 'lucide-react'
import {
  ACTUALS,
  ACTUAL_STATUS_CONFIG,
  type Actual,
  type ActualStatus,
} from '../../data/actualsData'

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ActualStatus }) {
  const cfg = ACTUAL_STATUS_CONFIG[status]
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

// ── Page metrics ──────────────────────────────────────────────────────────────

const PAGE_METRICS = [
  { label: 'Actual Events', value: '1,042' },
  { label: 'Verified', value: '927' },
  { label: 'Needs Review', value: '37' },
  { label: 'Incomplete', value: '18' },
  { label: 'Exceptions', value: '12' },
  { label: 'Unmatched', value: '48' },
]

// ── Table row ─────────────────────────────────────────────────────────────────

function ActualRow({ actual, onClick }: { actual: Actual; onClick: () => void }) {
  const cfg = ACTUAL_STATUS_CONFIG[actual.status]
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
      {/* Actual */}
      <td className="px-4 py-3">
        <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
          {actual.activityName}
        </div>
        <div
          className="mt-0.5 text-[10px]"
          style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
        >
          {actual.id}
        </div>
      </td>
      {/* Event */}
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>
        {actual.eventType}
      </td>
      {/* Discipline */}
      <td
        className="px-4 py-3 text-[12px]"
        style={{
          color: actual.discipline ? 'var(--c-text)' : 'var(--c-subtle)',
          fontStyle: actual.discipline ? 'normal' : 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        {actual.discipline ?? 'Not reported'}
      </td>
      {/* Area */}
      <td
        className="px-4 py-3 text-[12px]"
        style={{
          color: actual.area ? 'var(--c-text)' : 'var(--c-subtle)',
          fontStyle: actual.area ? 'normal' : 'italic',
        }}
      >
        {actual.area ?? 'Not reported'}
      </td>
      {/* Date */}
      <td
        className="px-4 py-3 text-[12px]"
        style={{
          color: actual.date ? 'var(--c-text)' : 'var(--c-subtle)',
          fontStyle: actual.date ? 'normal' : 'italic',
          fontFamily: actual.date ? 'var(--font-data)' : 'var(--font-ui)',
          whiteSpace: 'nowrap',
        }}
      >
        {actual.status === 'conflicting' ? (
          <span style={{ color: '#DC2626', fontStyle: 'normal' }}>—</span>
        ) : (
          actual.date ?? 'Not reported'
        )}
      </td>
      {/* Source */}
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>
        {actual.source}
      </td>
      {/* Schedule Link */}
      <td className="px-4 py-3" style={{ maxWidth: 220 }}>
        {actual.scheduleLink ? (
          <span
            className="text-[11px] font-medium"
            style={{
              color: 'var(--c-text)',
              fontFamily: 'var(--font-data)',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={actual.scheduleLink}
          >
            {actual.scheduleLink}
          </span>
        ) : (
          <span className="text-[11px] italic" style={{ color: 'var(--c-subtle)' }}>
            Not linked
          </span>
        )}
      </td>
      {/* Trust / Status */}
      <td className="px-4 py-3" style={{ minWidth: 160 }}>
        <div className="flex flex-col gap-1 items-start">
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
          {actual.reviewedBy && (
            <span className="text-[10px]" style={{ color: 'var(--c-subtle)' }}>
              {actual.reviewedBy}
            </span>
          )}
          {actual.confidence && actual.status !== 'verified' && (
            <span className="text-[10px]" style={{ color: 'var(--c-subtle)' }}>
              {actual.confidence}% confidence
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

interface Props {
  onSelectActual: (id: string) => void
  onCaptureProgress: () => void
}

export default function ActualsPage({ onSelectActual, onCaptureProgress }: Props) {
  const [search, setSearch] = useState('')
  const [filterEventType, setFilterEventType] = useState('')
  const [filterDiscipline, setFilterDiscipline] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterStatus, setFilterStatus] = useState<ActualStatus | ''>('')
  const [filterSource, setFilterSource] = useState('')

  const hasFilters = !!(search || filterEventType || filterDiscipline || filterArea || filterStatus || filterSource)

  const eventTypes = [...new Set(ACTUALS.map((a) => a.eventType))]
  const disciplines = [...new Set(ACTUALS.filter((a) => a.discipline).map((a) => a.discipline as string))]
  const areas = [...new Set(ACTUALS.filter((a) => a.area).map((a) => a.area as string))]
  const sources = [...new Set(ACTUALS.map((a) => a.source))]
  const statusOptions = (Object.keys(ACTUAL_STATUS_CONFIG) as ActualStatus[]).map(
    (k) => ACTUAL_STATUS_CONFIG[k].label
  )

  const filtered = useMemo(() => {
    let rows = [...ACTUALS]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.activityName.toLowerCase().includes(q) ||
          (a.discipline ?? '').toLowerCase().includes(q) ||
          (a.scheduleLink ?? '').toLowerCase().includes(q)
      )
    }
    if (filterEventType) rows = rows.filter((a) => a.eventType === filterEventType)
    if (filterDiscipline) rows = rows.filter((a) => a.discipline === filterDiscipline)
    if (filterArea) rows = rows.filter((a) => a.area === filterArea)
    if (filterStatus) rows = rows.filter((a) => a.status === filterStatus)
    if (filterSource) rows = rows.filter((a) => a.source === filterSource)
    return rows
  }, [search, filterEventType, filterDiscipline, filterArea, filterStatus, filterSource])

  function handleStatusFilter(label: string) {
    if (!label) {
      setFilterStatus('')
      return
    }
    const key = (Object.keys(ACTUAL_STATUS_CONFIG) as ActualStatus[]).find(
      (k) => ACTUAL_STATUS_CONFIG[k].label === label
    )
    setFilterStatus(key ?? '')
  }

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
              Actuals
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Structured field execution events captured across the project.
            </p>
          </div>
          <button
            onClick={onCaptureProgress}
            className="flex flex-shrink-0 items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
            }}
          >
            <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
            Capture Progress
          </button>
        </div>

        {/* Inline summary metrics */}
        <div className="mb-0 flex flex-wrap items-center gap-x-5 gap-y-1 pb-4">
          {PAGE_METRICS.map((m, i) => (
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
                style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}
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
          {/* Search */}
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
              placeholder="Search actuals..."
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

          <FilterSelect
            label="Event Type"
            value={filterEventType}
            options={eventTypes}
            onChange={setFilterEventType}
          />
          <FilterSelect
            label="Discipline"
            value={filterDiscipline}
            options={disciplines}
            onChange={setFilterDiscipline}
          />
          <FilterSelect
            label="Area"
            value={filterArea}
            options={areas}
            onChange={setFilterArea}
          />
          <FilterSelect
            label="Status"
            value={filterStatus ? ACTUAL_STATUS_CONFIG[filterStatus].label : ''}
            options={statusOptions}
            onChange={handleStatusFilter}
          />
          <FilterSelect
            label="Source"
            value={filterSource}
            options={sources}
            onChange={setFilterSource}
          />

          {hasFilters && (
            <button
              onClick={() => {
                setSearch('')
                setFilterEventType('')
                setFilterDiscipline('')
                setFilterArea('')
                setFilterStatus('')
                setFilterSource('')
              }}
              className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[12px] font-medium transition-colors duration-150"
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
          style={{ borderCollapse: 'collapse', minWidth: 960 }}
          aria-label="Actuals table"
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
              {[
                'ACTUAL',
                'EVENT',
                'DISCIPLINE',
                'AREA',
                'DATE',
                'SOURCE',
                'SCHEDULE LINK',
                'TRUST / STATUS',
              ].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase"
                  style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((actual) => (
              <ActualRow
                key={actual.id}
                actual={actual}
                onClick={() => onSelectActual(actual.id)}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-14 text-center text-[13px]"
                  style={{ color: 'var(--c-muted)' }}
                >
                  No actuals match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Row count */}
        <div
          className="px-4 py-3 text-[11px]"
          style={{ color: 'var(--c-subtle)', borderTop: '1px solid var(--c-border)' }}
        >
          {filtered.length} of {ACTUALS.length} actuals shown
          {hasFilters && ' · filters active'}
        </div>
      </div>
    </div>
  )
}
