import { useState, useRef } from 'react'
import { Search, X, Check } from 'lucide-react'
import { reviewItems, type ReviewItem, type ReviewStatus } from '../data/reviewMockData'
import ReviewMatchDrawer from '../components/review/ReviewMatchDrawer'
import { FilterDropdown } from '../components/FilterDropdown'

type Tab = 'all' | 'low-confidence' | 'ambiguous' | 'incomplete' | 'unmatched'

const TAB_DEFS: { id: Tab; label: string; count: (items: ReviewItem[]) => number }[] = [
  { id: 'all', label: 'All', count: (items) => items.length },
  { id: 'low-confidence', label: 'Low Confidence', count: (items) => items.filter((i) => i.confidence > 0 && i.confidence < 60).length },
  { id: 'ambiguous', label: 'Ambiguous', count: (items) => items.filter((i) => i.status === 'ambiguous').length },
  { id: 'incomplete', label: 'Incomplete', count: (items) => items.filter((i) => i.status === 'incomplete').length },
  { id: 'unmatched', label: 'Unmatched', count: (items) => items.filter((i) => i.status === 'unmatched').length },
]

const STATUS_STYLE: Record<ReviewStatus, { bg: string; color: string; label: string }> = {
  'needs-review': { bg: 'rgba(37,99,235,0.10)', color: '#2563EB', label: 'Needs Review' },
  ambiguous: { bg: 'rgba(217,119,6,0.12)', color: '#D97706', label: 'Ambiguous' },
  incomplete: { bg: 'rgba(245,158,11,0.10)', color: '#B45309', label: 'Incomplete' },
  unmatched: { bg: 'rgba(220,38,38,0.10)', color: '#DC2626', label: 'Unmatched' },
}

function ConfidencePill({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="text-[13px]" style={{ color: 'var(--c-subtle)' }}>
        —
      </span>
    )
  const color = value >= 85 ? '#16A34A' : value >= 60 ? '#D97706' : '#DC2626'
  return (
    <span
      className="text-[14px] font-bold"
      style={{ color, fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums' }}
    >
      {value}%
    </span>
  )
}

interface ToastProps {
  message: string
  onDismiss: () => void
}

function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-[12px] px-4 py-3 text-[13px] font-semibold text-white shadow-lg z-[80]"
      style={{
        background: '#16A34A',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        animation: 'fadeInDown 200ms ease',
      }}
    >
      <Check size={15} strokeWidth={2.5} />
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}

const DISCIPLINE_OPTIONS = [
  { value: 'Piping', label: 'Piping' },
  { value: 'Rotating Equipment', label: 'Rotating Equipment' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Structural', label: 'Structural' },
  { value: 'Civil', label: 'Civil' },
]
const AREA_OPTIONS = [
  { value: 'Area A', label: 'Area A' },
  { value: 'Area B', label: 'Area B' },
  { value: 'Utility Block', label: 'Utility Block' },
  { value: 'Tank Farm', label: 'Tank Farm' },
]
const SOURCE_OPTIONS = [
  { value: 'Supervisor Update', label: 'Supervisor Update' },
  { value: 'DPR Extract', label: 'DPR Extract' },
]
const CONFIDENCE_OPTIONS = [
  { value: 'high', label: 'High (≥85%)' },
  { value: 'medium', label: 'Medium (60–84%)' },
  { value: 'low', label: 'Low (<60%)' },
  { value: 'none', label: 'No Match' },
]
const SORT_OPTIONS = [
  { value: 'confidence-asc', label: 'Confidence: Low first' },
  { value: 'confidence-desc', label: 'Confidence: High first' },
  { value: 'date-desc', label: 'Date: Newest first' },
  { value: 'date-asc', label: 'Date: Oldest first' },
]

function matchConfidence(value: number, filter: string): boolean {
  if (!filter) return true
  if (filter === 'high') return value >= 85
  if (filter === 'medium') return value >= 60 && value < 85
  if (filter === 'low') return value > 0 && value < 60
  if (filter === 'none') return value === 0
  return true
}

export default function ReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>(reviewItems)
  const [tab, setTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [filterDiscipline, setFilterDiscipline] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterConfidence, setFilterConfidence] = useState('')
  const [sort, setSort] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasFilters = !!(search || filterDiscipline || filterArea || filterSource || filterConfidence || sort)

  function clearFilters() {
    setSearch(''); setFilterDiscipline(''); setFilterArea(''); setFilterSource(''); setFilterConfidence(''); setSort('')
  }

  function showToast(msg: string) {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  function filterItems(all: ReviewItem[]): ReviewItem[] {
    let result = all
      .filter((item) => {
        if (tab === 'low-confidence') return item.confidence > 0 && item.confidence < 60
        if (tab === 'ambiguous') return item.status === 'ambiguous'
        if (tab === 'incomplete') return item.status === 'incomplete'
        if (tab === 'unmatched') return item.status === 'unmatched'
        return true
      })
      .filter((item) =>
        search === '' ||
        item.fieldText.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        (item.suggestedActivity?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        item.extractedDiscipline.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => !filterDiscipline || item.extractedDiscipline === filterDiscipline)
      .filter((item) => !filterArea || item.extractedArea === filterArea)
      .filter((item) => !filterSource || item.source === filterSource)
      .filter((item) => matchConfidence(item.confidence, filterConfidence))

    if (sort === 'confidence-asc') result = [...result].sort((a, b) => a.confidence - b.confidence)
    else if (sort === 'confidence-desc') result = [...result].sort((a, b) => b.confidence - a.confidence)
    else if (sort === 'date-desc') result = [...result].sort((a, b) => b.sourceDate.localeCompare(a.sourceDate))
    else if (sort === 'date-asc') result = [...result].sort((a, b) => a.sourceDate.localeCompare(b.sourceDate))

    return result
  }

  const filtered = filterItems(items)
  const openItem = items.find((i) => i.id === openDrawerId) ?? null

  function handleAccept(id: string) {
    const accepted = items.find((i) => i.id === id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    setOpenDrawerId(null)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    if (accepted?.suggestedActivity) {
      showToast(`Match verified · ${accepted.suggestedActivity} updated.`)
    }
  }

  function toggleSelect(id: string, eligible: boolean) {
    if (!eligible) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBulkVerify() {
    const toVerify = Array.from(selectedIds)
    setItems((prev) => prev.filter((i) => !toVerify.includes(i.id)))
    setSelectedIds(new Set())
    showToast(`${toVerify.length} match${toVerify.length !== 1 ? 'es' : ''} verified.`)
  }

  const eligibleForBulk = items.filter((i) => i.isBulkEligible)
  const bulkCount = selectedIds.size

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {/* ── Fixed chrome: page header + tabs + toolbar + bulk bar ── */}
      <div style={{ flexShrink: 0, padding: '28px 32px 0' }}>

      {/* Page header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1
            className="text-[26px] font-bold leading-[32px] tracking-[-0.02em]"
            style={{ color: 'var(--c-text)' }}
          >
            Review Queue
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--c-muted)' }}>
            Validate execution events before they affect the project schedule.
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-[10px] px-3.5 py-2"
          style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
        >
          <span
            className="text-[22px] font-bold"
            style={{
              color: '#F46F29',
              fontFamily: 'var(--font-ui)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.015em',
            }}
          >
            {items.length}
          </span>
          <span className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            pending
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="mb-4 flex items-center gap-1 rounded-[12px] p-1"
        style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', width: 'fit-content' }}
      >
        {TAB_DEFS.map((t) => {
          const count = t.count(items)
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[13px] font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--c-page)' : 'transparent',
                color: active ? 'var(--c-text)' : 'var(--c-muted)',
                boxShadow: active ? 'var(--c-shadow-card)' : 'none',
                border: active ? '1px solid var(--c-border)' : '1px solid transparent',
              }}
            >
              {t.label}
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{
                  background: active ? (t.id === 'all' ? 'rgba(244,111,41,0.12)' : 'var(--c-border)') : 'var(--c-border)',
                  color: active && t.id === 'all' ? '#F46F29' : 'var(--c-muted)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            strokeWidth={2}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--c-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search execution events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[10px] py-2 pl-9 pr-3 text-[13px]"
            style={{
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
        <FilterDropdown label="Discipline" allLabel="All Disciplines" options={DISCIPLINE_OPTIONS} value={filterDiscipline} onChange={setFilterDiscipline} />
        <FilterDropdown label="Area" allLabel="All Areas" options={AREA_OPTIONS} value={filterArea} onChange={setFilterArea} />
        <FilterDropdown label="Source" allLabel="All Sources" options={SOURCE_OPTIONS} value={filterSource} onChange={setFilterSource} />
        <FilterDropdown label="Confidence" allLabel="All Confidence" options={CONFIDENCE_OPTIONS} value={filterConfidence} onChange={setFilterConfidence} dropdownMinWidth={180} />
        <FilterDropdown label="Sort" allLabel="Default Order" options={SORT_OPTIONS} value={sort} onChange={setSort} dropdownMinWidth={200} />
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
            Clear
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {bulkCount > 0 && (
        <div
          className="mb-4 flex items-center justify-between rounded-[12px] px-4 py-3"
          style={{
            background: 'rgba(244,111,41,0.08)',
            border: '1.5px solid rgba(244,111,41,0.30)',
          }}
        >
          <span className="text-[13px] font-medium" style={{ color: '#F46F29' }}>
            {bulkCount} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium"
              style={{ color: 'var(--c-muted)', background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
            >
              Clear
            </button>
            <button
              onClick={handleBulkVerify}
              className="rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
              }}
            >
              Verify Selected
            </button>
          </div>
        </div>
      )}

      </div>{/* end fixed chrome */}

      {/* ── Scrollable table region ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '0 32px 32px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--c-border-strong) transparent',
        }}
      >
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ border: '1px solid var(--c-border)', background: 'var(--c-card)' }}
      >
        {/* Table header */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: '40px 1fr 200px 110px 110px 90px 120px',
            padding: '0 16px',
            borderBottom: '1px solid var(--c-border)',
            background: 'var(--c-page)',
          }}
        >
          {/* Checkbox header */}
          <div className="flex items-center py-3">
            <span className="sr-only">Select</span>
          </div>
          {['EVENT', 'SUGGESTED ACTIVITY', 'DISCIPLINE', 'SOURCE', 'CONFIDENCE', 'STATUS'].map((col) => (
            <div
              key={col}
              className="flex items-center py-3 text-[10px] font-bold uppercase"
              style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[14px]" style={{ color: 'var(--c-muted)' }}>
            No items match current filters.
          </div>
        )}
        {filtered.map((item, i) => {
          const status = STATUS_STYLE[item.status]
          const isOpen = openDrawerId === item.id
          const isSelected = selectedIds.has(item.id)
          const eligible = item.isBulkEligible

          return (
            <div
              key={item.id}
              className="grid cursor-pointer transition-colors duration-100"
              style={{
                gridTemplateColumns: '40px 1fr 200px 110px 110px 90px 120px',
                padding: '0 16px',
                minHeight: 64,
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--c-border)' : 'none',
                background: isOpen
                  ? 'rgba(244,111,41,0.05)'
                  : isSelected
                  ? 'rgba(244,111,41,0.04)'
                  : 'var(--c-card)',
                borderLeft: isOpen ? '3px solid #F46F29' : '3px solid transparent',
              }}
              onClick={() => setOpenDrawerId(item.id === openDrawerId ? null : item.id)}
              onMouseEnter={(e) => {
                if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'var(--c-page)'
              }}
              onMouseLeave={(e) => {
                if (!isOpen) (e.currentTarget as HTMLElement).style.background = isSelected ? 'rgba(244,111,41,0.04)' : 'var(--c-card)'
              }}
            >
              {/* Checkbox */}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelect(item.id, eligible)
                }}
                className="flex items-center"
                title={!eligible ? 'This item requires individual review.' : undefined}
              >
                {eligible ? (
                  isSelected ? (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-[5px]"
                      style={{ background: '#F46F29', border: '1.5px solid #F46F29' }}
                    >
                      <Check size={11} strokeWidth={2.5} style={{ color: 'white' }} />
                    </div>
                  ) : (
                    <div
                      className="h-5 w-5 rounded-[5px]"
                      style={{ border: '1.5px solid var(--c-border)' }}
                    />
                  )
                ) : (
                  <div
                    className="h-5 w-5 rounded-[5px] opacity-30 cursor-not-allowed"
                    style={{ border: '1.5px solid var(--c-border)' }}
                  />
                )}
              </div>

              {/* EVENT */}
              <div className="pr-4 py-2">
                <p
                  className="text-[13px] font-semibold leading-[18px] line-clamp-2"
                  style={{ color: 'var(--c-text)' }}
                >
                  {item.fieldText}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  {item.extractedEvent} · {item.sourceDate.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>

              {/* SUGGESTED ACTIVITY */}
              <div className="pr-3">
                {item.suggestedActivity ? (
                  <p
                    className="text-[12px] font-semibold truncate"
                    style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                  >
                    {item.suggestedActivity}
                  </p>
                ) : (
                  <p className="text-[12px] italic" style={{ color: 'var(--c-subtle)' }}>
                    No match found
                  </p>
                )}
              </div>

              {/* DISCIPLINE */}
              <div>
                <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                  {item.extractedDiscipline}
                </p>
              </div>

              {/* SOURCE */}
              <div>
                <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                  {item.source}
                </p>
              </div>

              {/* CONFIDENCE */}
              <div>
                <ConfidencePill value={item.confidence} />
              </div>

              {/* STATUS */}
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      </div>{/* end scrollable region */}

      {/* Review Match Drawer */}
      {openItem && (
        <ReviewMatchDrawer
          item={openItem}
          open={!!openDrawerId}
          onClose={() => setOpenDrawerId(null)}
          onAccept={handleAccept}
        />
      )}
    </div>
  )
}
