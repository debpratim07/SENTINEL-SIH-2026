import { useState } from 'react'
import { Search, Upload, FileText, CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react'
import { allReports, Report, ProcessingStatus } from '../data/reportMockData'
import { FilterDropdown } from '../components/FilterDropdown'

const PROCESSING_STATUS_CONFIG: Record<ProcessingStatus, { label: string; color: string; bg: string }> = {
  uploaded:   { label: 'Uploaded',    color: 'var(--c-muted)', bg: 'var(--c-border)' },
  processing: { label: 'Processing',  color: '#2563EB',        bg: 'rgba(37,99,235,0.10)' },
  processed:  { label: 'Processed',   color: '#16A34A',        bg: 'rgba(22,163,74,0.10)' },
  failed:     { label: 'Failed',      color: '#DC2626',        bg: 'rgba(220,38,38,0.10)' },
}

function reviewStateLabel(report: Report): { text: string; color: string } {
  const total = report.needsReview + report.incomplete
  if (total === 0) return { text: 'All reviewed', color: '#16A34A' }
  return { text: `${total} require${total === 1 ? 's' : ''} attention`, color: '#D97706' }
}

interface Props {
  onOpenReport: (id: string) => void
  onUploadReport: () => void
}

const DISCIPLINE_OPTIONS = [
  { value: 'Piping', label: 'Piping' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Rotating Equipment', label: 'Rotating Equipment' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Instrumentation', label: 'Instrumentation' },
]
const AREA_OPTIONS = [
  { value: 'Area A', label: 'Area A' },
  { value: 'Area B', label: 'Area B' },
  { value: 'Area C', label: 'Area C' },
  { value: 'Utility Block', label: 'Utility Block' },
  { value: 'Tank Farm', label: 'Tank Farm' },
]
const DATE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'last-7', label: 'Last 7 Days' },
  { value: 'aug-2026', label: 'Aug 2026' },
]
const STATUS_OPTIONS = [
  { value: 'uploaded', label: 'Uploaded' },
  { value: 'processing', label: 'Processing' },
  { value: 'processed', label: 'Processed' },
  { value: 'failed', label: 'Processing Failed' },
]

function matchDate(date: string, filter: string): boolean {
  if (!filter) return true
  if (filter === 'today') return date === '28 Aug 2026'
  if (filter === 'last-7') return ['28 Aug 2026','27 Aug 2026','26 Aug 2026','25 Aug 2026','24 Aug 2026','23 Aug 2026','22 Aug 2026'].includes(date)
  if (filter === 'aug-2026') return date.includes('Aug 2026')
  return true
}

export default function Reports({ onOpenReport, onUploadReport }: Props) {
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [filterDiscipline, setFilterDiscipline] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const hasFilters = !!(search || filterDiscipline || filterArea || filterDate || filterStatus)

  function clearFilters() {
    setSearch(''); setFilterDiscipline(''); setFilterArea(''); setFilterDate(''); setFilterStatus('')
  }

  const filtered = allReports.filter((r) => {
    if (search && !r.filename.toLowerCase().includes(search.toLowerCase()) &&
        !r.discipline.toLowerCase().includes(search.toLowerCase()) &&
        !r.area.toLowerCase().includes(search.toLowerCase())) return false
    if (filterDiscipline && r.discipline !== filterDiscipline) return false
    if (filterArea && r.area !== filterArea) return false
    if (filterDate && !matchDate(r.date, filterDate)) return false
    if (filterStatus && r.processingStatus !== filterStatus) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Page header */}
      <div
        style={{
          flexShrink: 0,
          padding: '24px 32px 20px',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-page)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{ fontSize: 22, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.02em' }}
            >
              Reports
            </h1>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--c-muted)' }}>
              Review uploaded field reports and the execution events extracted from them.
            </p>
          </div>
          <button
            onClick={onUploadReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            <Upload size={14} strokeWidth={2.5} />
            Upload Report
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <div style={{ position: 'relative' }}>
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
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: 30,
                paddingRight: 12,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 9,
                fontSize: 13,
                width: 220,
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
              }}
            />
          </div>
          <FilterDropdown label="Discipline" allLabel="All Disciplines" options={DISCIPLINE_OPTIONS} value={filterDiscipline} onChange={setFilterDiscipline} />
          <FilterDropdown label="Area" allLabel="All Areas" options={AREA_OPTIONS} value={filterArea} onChange={setFilterArea} />
          <FilterDropdown label="Date" allLabel="All Dates" options={DATE_OPTIONS} value={filterDate} onChange={setFilterDate} dropdownMinWidth={150} />
          <FilterDropdown label="Processing Status" allLabel="All Statuses" options={STATUS_OPTIONS} value={filterStatus} onChange={setFilterStatus} dropdownMinWidth={190} />
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 11px', borderRadius: 9, fontSize: 13,
                background: 'var(--c-card)', border: '1px solid var(--c-border)',
                color: 'var(--c-muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <X size={11} strokeWidth={2.5} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 40px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'fixed',
            marginTop: 8,
          }}
          aria-label="Reports"
        >
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Report', 'Date', 'Discipline', 'Area', 'Actuals Found', 'Processing Status', 'Review State'].map(
                (col) => (
                  <th
                    key={col}
                    scope="col"
                    style={{
                      paddingTop: 12,
                      paddingBottom: 8,
                      paddingRight: 12,
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.09em',
                      color: 'var(--c-subtle)',
                      borderBottom: '1px solid var(--c-border)',
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => {
              const statusCfg = PROCESSING_STATUS_CONFIG[report.processingStatus]
              const reviewState = reviewStateLabel(report)
              const isSelected = selectedRow === report.id

              return (
                <tr
                  key={report.id}
                  onClick={() => {
                    setSelectedRow(report.id)
                    onOpenReport(report.id)
                  }}
                  style={{
                    cursor: 'pointer',
                    borderLeft: isSelected ? '3px solid #F46F29' : '3px solid transparent',
                    background: isSelected ? 'rgba(244,111,41,0.04)' : 'transparent',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLTableRowElement).style.background = 'var(--c-page)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                  }}
                >
                  {/* Report name */}
                  <td
                    style={{
                      padding: '14px 12px 14px 0',
                      borderBottom: '1px solid var(--c-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'rgba(244,111,41,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={14} strokeWidth={1.8} style={{ color: '#F46F29' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>
                          {report.filename}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--c-subtle)', marginTop: 1 }}>
                          {report.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--c-border)', fontSize: 13, color: 'var(--c-text)' }}>
                    {report.date}
                  </td>

                  {/* Discipline */}
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--c-border)', fontSize: 13, color: 'var(--c-muted)' }}>
                    {report.discipline}
                  </td>

                  {/* Area */}
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--c-border)', fontSize: 13, color: 'var(--c-muted)' }}>
                    {report.area}
                  </td>

                  {/* Actuals Found */}
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--c-border)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)', fontVariantNumeric: 'tabular-nums' }}>
                      {report.actualsFound}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--c-subtle)', marginLeft: 3 }}>Actuals</span>
                  </td>

                  {/* Processing Status */}
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid var(--c-border)' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 8px',
                        borderRadius: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        background: statusCfg.bg,
                        color: statusCfg.color,
                      }}
                    >
                      {report.processingStatus === 'processed' && (
                        <CheckCircle2 size={10} strokeWidth={2.5} />
                      )}
                      {report.processingStatus === 'processing' && (
                        <Clock size={10} strokeWidth={2.5} />
                      )}
                      {report.processingStatus === 'failed' && (
                        <AlertTriangle size={10} strokeWidth={2.5} />
                      )}
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Review State */}
                  <td style={{ padding: '14px 0 14px 0', borderBottom: '1px solid var(--c-border)', fontSize: 13, color: reviewState.color, fontWeight: 500 }}>
                    {reviewState.text}
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
