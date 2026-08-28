import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, CalendarDays, ClipboardCheck, BarChart3, AlertTriangle, LayoutDashboard } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string
  title: string
  subtitle: string
  group: string
  navTarget: string
  navId?: string
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const ALL_RESULTS: SearchResult[] = [
  // Schedule Activities
  { id: 'sa-1', title: 'ERECT LINE 24-XX', subtitle: 'Schedule Activity · Piping · Area B', group: 'Schedule Activities', navTarget: 'schedule', navId: 'erect-line-24-xx' },
  { id: 'sa-2', title: 'EQUIPMENT ALIGNMENT — P-204', subtitle: 'Schedule Activity · Rotating Equipment · Utility Block', group: 'Schedule Activities', navTarget: 'schedule', navId: 'equipment-alignment-p204' },
  { id: 'sa-3', title: 'PIPE SUPPORT INSTALLATION — AREA B', subtitle: 'Schedule Activity · Piping · Area B', group: 'Schedule Activities', navTarget: 'schedule' },
  { id: 'sa-4', title: 'FOUNDATION BLOCK C-14', subtitle: 'Schedule Activity · Civil · Area C', group: 'Schedule Activities', navTarget: 'schedule', navId: 'foundation-block-c14' },
  { id: 'sa-5', title: 'CABLE TRAY INSTALLATION — UTILITY BLOCK', subtitle: 'Schedule Activity · Electrical · Utility Block', group: 'Schedule Activities', navTarget: 'schedule', navId: 'cable-tray-installation' },
  // Actual Events
  { id: 'ae-1', title: 'ACT-2026-0842', subtitle: 'Actual Event · Spool erection · Piping · Verified', group: 'Actual Events', navTarget: 'actuals', navId: 'ACT-2026-0842' },
  { id: 'ae-2', title: 'ACT-2026-0851', subtitle: 'Actual Event · Equipment alignment · Rotating Equipment · Conflicting', group: 'Actual Events', navTarget: 'actuals', navId: 'ACT-2026-0851' },
  { id: 'ae-3', title: 'ACT-2026-0860', subtitle: 'Actual Event · Material shifting · Not reported · Unmatched', group: 'Actual Events', navTarget: 'actuals', navId: 'ACT-2026-0860' },
  // Reports
  { id: 'rpt-1', title: 'Piping_DPR_28Aug.pdf', subtitle: 'Report · 28 Aug 2026 · 6 events extracted', group: 'Reports', navTarget: 'reports', navId: 'RPT-2026-0001' },
  { id: 'rpt-2', title: 'RotEquip_DPR_28Aug.pdf', subtitle: 'Report · 28 Aug 2026 · 3 events extracted', group: 'Reports', navTarget: 'reports', navId: 'RPT-2026-0002' },
  // Exceptions
  { id: 'exc-1', title: 'EXC-001 — EQUIPMENT ALIGNMENT — P-204', subtitle: 'Exception · Conflicting · Open', group: 'Exceptions', navTarget: 'exceptions', navId: 'EXC-001' },
  { id: 'exc-2', title: 'EXC-003 — Material shifting near Area B', subtitle: 'Exception · Unmatched · Open', group: 'Exceptions', navTarget: 'exceptions', navId: 'EXC-003' },
  // Pages
  { id: 'pg-1', title: 'Dashboard', subtitle: 'Page · Overview', group: 'Pages', navTarget: 'dashboard' },
  { id: 'pg-2', title: 'Performance', subtitle: 'Page · Insights', group: 'Pages', navTarget: 'performance' },
  { id: 'pg-3', title: 'Data Quality', subtitle: 'Page · Insights', group: 'Pages', navTarget: 'data-quality' },
  { id: 'pg-4', title: 'Execution Knowledge', subtitle: 'Page · Insights', group: 'Pages', navTarget: 'exec-knowledge' },
  { id: 'pg-5', title: 'Audit Log', subtitle: 'Page · System', group: 'Pages', navTarget: 'audit-log' },
  { id: 'pg-6', title: 'Administration', subtitle: 'Page · System', group: 'Pages', navTarget: 'admin' },
  { id: 'pg-7', title: 'Review Queue', subtitle: 'Page · Review', group: 'Pages', navTarget: 'review-queue' },
]

const GROUP_ICONS: Record<string, React.ReactNode> = {
  'Schedule Activities': <CalendarDays size={13} strokeWidth={1.8} />,
  'Actual Events':       <ClipboardCheck size={13} strokeWidth={1.8} />,
  'Reports':             <BarChart3 size={13} strokeWidth={1.8} />,
  'Exceptions':          <AlertTriangle size={13} strokeWidth={1.8} />,
  'Pages':               <LayoutDashboard size={13} strokeWidth={1.8} />,
}

const GROUPS = ['Schedule Activities', 'Actual Events', 'Reports', 'Exceptions', 'Pages']

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (nav: string, id?: string) => void
}

export default function GlobalSearch({ open, onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [focusIndex, setFocusIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? ALL_RESULTS.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const flatResults = GROUPS.flatMap((g) => results.filter((r) => r.group === g))

  useEffect(() => {
    if (open) {
      setQuery('')
      setFocusIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setFocusIndex(0)
  }, [query])

  const handleSelect = useCallback((r: SearchResult) => {
    onNavigate(r.navTarget, r.navId)
    onClose()
  }, [onNavigate, onClose])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIndex((i) => Math.min(i + 1, flatResults.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIndex((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && flatResults[focusIndex]) { handleSelect(flatResults[focusIndex]) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, flatResults, focusIndex, handleSelect, onClose])

  if (!open) return null

  let globalIdx = 0

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(2px)' }} />

      <div
        role="dialog"
        aria-label="Search SENTINEL"
        aria-modal="true"
        style={{
          position: 'relative', width: '100%', maxWidth: 580, borderRadius: 16,
          background: 'var(--c-card)', border: '1px solid var(--c-border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)', overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <Search size={16} strokeWidth={2} style={{ color: 'var(--c-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, actuals, reports, exceptions or pages..."
            className="flex-1 bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}
            aria-label="Search SENTINEL"
            aria-autocomplete="list"
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--c-subtle)' }} aria-label="Clear search">
              <X size={14} strokeWidth={2} />
            </button>
          )}
          <kbd className="hidden shrink-0 rounded-[5px] px-1.5 py-1 text-[10px] sm:block" style={{ background: 'var(--c-border)', color: 'var(--c-muted)', border: '1px solid var(--c-border-strong)', fontFamily: 'var(--font-data)' }}>Esc</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }} role="listbox" aria-label="Search results">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-[14px]" style={{ color: 'var(--c-muted)' }}>Search SENTINEL</p>
              <p className="text-[12px]" style={{ color: 'var(--c-subtle)' }}>Try ERECT LINE, ACT-2026, or a report name</p>
            </div>
          ) : flatResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-1.5">
              <p className="text-[14px] font-medium" style={{ color: 'var(--c-muted)' }}>No results found</p>
              <p className="text-[12px]" style={{ color: 'var(--c-subtle)' }}>Try another activity ID, report name or field term.</p>
            </div>
          ) : (
            GROUPS.map((group) => {
              const groupResults = flatResults.filter((r) => r.group === group)
              if (!groupResults.length) return null
              return (
                <div key={group}>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--c-border)' }}>
                    <span style={{ color: 'var(--c-subtle)' }}>{GROUP_ICONS[group]}</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>{group}</span>
                  </div>
                  {groupResults.map((r) => {
                    const idx = globalIdx++
                    const isFocused = focusIndex === idx
                    return (
                      <button
                        key={r.id}
                        role="option"
                        aria-selected={isFocused}
                        onClick={() => handleSelect(r)}
                        onMouseEnter={() => setFocusIndex(idx)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left"
                        style={{ background: isFocused ? 'var(--c-brand-tint)' : 'transparent', borderBottom: '1px solid var(--c-border)' }}
                      >
                        <div style={{ color: isFocused ? '#F46F29' : 'var(--c-subtle)', flexShrink: 0, marginTop: 2 }}>
                          {GROUP_ICONS[r.group]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium truncate" style={{ color: isFocused ? '#F46F29' : 'var(--c-text)', fontFamily: r.group === 'Actual Events' || r.group === 'Schedule Activities' ? 'var(--font-data)' : 'var(--font-ui)' }}>
                            {r.title}
                          </div>
                          <div className="mt-0.5 text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>
                            {r.subtitle}
                          </div>
                        </div>
                        {isFocused && (
                          <kbd className="shrink-0 self-center rounded-[4px] px-1.5 py-0.5 text-[10px]" style={{ background: 'var(--c-border)', color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}>↵</kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 text-[11px]" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-subtle)' }}>
          <span className="flex items-center gap-1.5">
            <kbd style={{ fontFamily: 'var(--font-data)', background: 'var(--c-border)', color: 'var(--c-muted)', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd style={{ fontFamily: 'var(--font-data)', background: 'var(--c-border)', color: 'var(--c-muted)', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1.5">
            <kbd style={{ fontFamily: 'var(--font-data)', background: 'var(--c-border)', color: 'var(--c-muted)', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
