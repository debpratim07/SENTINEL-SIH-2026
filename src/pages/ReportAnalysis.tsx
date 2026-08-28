import { useState } from 'react'
import {
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  X,
  FileText,
  Eye,
  ExternalLink,
} from 'lucide-react'
import {
  findReport,
  primaryReport,
  SOURCE_STATEMENTS,
  ReportEvent,
  EventStatus,
  SIGNAL_STRENGTH_CONFIG,
  EVENT_STATUS_CONFIG,
} from '../data/reportMockData'
import Modal from '../components/ui/Modal'

interface Props {
  reportId: string
  onBack: () => void
  onOpenReviewMatch: (eventId: string) => void
}

// ── Bulk Confirmation Modal ───────────────────────────────────────────────────

function BulkConfirmModal({
  open,
  onClose,
  events,
  onVerify,
}: {
  open: boolean
  onClose: () => void
  events: ReportEvent[]
  onVerify: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} aria-label="Review Selected Matches" zIndex={70}>
      <div
        style={{
          width: 520,
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 20,
          boxShadow: 'var(--c-shadow-elevated)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2
                style={{ fontSize: 18, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.02em' }}
              >
                Review Selected Matches
              </h2>
              <p style={{ marginTop: 4, fontSize: 13, color: 'var(--c-muted)' }}>
                {events.length} strong schedule match{events.length !== 1 ? 'es' : ''}{' '}
                {events.length !== 1 ? 'are' : 'is'} ready for verification.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Match list */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.map((evt) => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text)' }}>{evt.id}</p>
                <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {evt.activity} · {evt.eventType}
                </p>
              </div>
              <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--c-subtle)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {evt.suggestedMatch}
                </p>
                <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2 }}>{evt.suggestedMatchMeta}</p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#16A34A',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}
              >
                {evt.confidence}%
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '12px 24px',
            background: 'var(--c-page)',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          <p style={{ fontSize: 12, color: 'var(--c-subtle)', marginBottom: 14 }}>
            Verified relationships will become trusted schedule-linked actuals.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                background: 'transparent',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              style={{
                padding: '9px 20px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              Verify {events.length} Match{events.length !== 1 ? 'es' : ''}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ── Source Evidence Viewer (right-panel overlay) ──────────────────────────────

function SourceEvidenceViewer({
  open,
  onClose,
  highlightIndex,
}: {
  open: boolean
  onClose: () => void
  highlightIndex: number | null
}) {
  const [page, setPage] = useState(1)
  const totalPages = 3

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 55,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          height: '100%',
          background: 'var(--c-card)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.16)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            padding: '22px 24px 16px',
            borderBottom: '1px solid var(--c-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--c-subtle)',
                marginBottom: 4,
              }}
            >
              Source Evidence
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text)' }}>
              Piping_DPR_28Aug.pdf
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close evidence viewer"
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--c-muted)',
            }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Metadata */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 24px',
            borderBottom: '1px solid var(--c-border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 20px',
          }}
        >
          {[
            { label: 'Uploaded', value: '28 Aug 2026 · 08:31' },
            { label: 'Report Date', value: '28 Aug 2026' },
            { label: 'Discipline', value: 'Piping' },
            { label: 'Area', value: 'Area B' },
            { label: 'Pages', value: '3' },
          ].map(({ label, value }) => (
            <div key={label}>
              <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>{label} </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-text)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Document body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div
            style={{
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
              borderRadius: 12,
              padding: '24px',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '0.04em' }}>
                DAILY PROGRESS REPORT
              </p>
              <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 3 }}>
                28 AUG 2026 · AREA B — PIPING
              </p>
            </div>
            <div
              style={{
                height: 1,
                background: 'var(--c-border)',
                marginBottom: 20,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SOURCE_STATEMENTS.map((stmt, i) => {
                const idx = i + 1
                const isHighlighted = highlightIndex === idx
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 8,
                      borderLeft: isHighlighted ? '3px solid #F46F29' : '3px solid transparent',
                      background: isHighlighted ? 'rgba(244,111,41,0.07)' : 'transparent',
                      transition: 'all 160ms',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isHighlighted ? '#F46F29' : 'var(--c-subtle)',
                        minWidth: 16,
                        paddingTop: 2,
                        flexShrink: 0,
                      }}
                    >
                      {idx}.
                    </span>
                    <p style={{ fontSize: 13, color: 'var(--c-text)', lineHeight: 1.55 }}>{stmt}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Page nav */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 24px',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '5px 12px',
              borderRadius: 7,
              fontSize: 12,
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
              color: page === 1 ? 'var(--c-subtle)' : 'var(--c-text)',
              cursor: page === 1 ? 'default' : 'pointer',
            }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 12, color: 'var(--c-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '5px 12px',
              borderRadius: 7,
              fontSize: 12,
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
              color: page === totalPages ? 'var(--c-subtle)' : 'var(--c-text)',
              cursor: page === totalPages ? 'default' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Event Card ────────────────────────────────────────────────────────────────

function EventCard({
  event,
  effectiveStatus,
  isExpanded,
  isSourceHighlighted,
  isSelected,
  onExpand,
  onHover,
  onLeave,
  onSelect,
  onReviewMatch,
}: {
  event: ReportEvent
  effectiveStatus: EventStatus
  isExpanded: boolean
  isSourceHighlighted: boolean
  isSelected: boolean
  onExpand: () => void
  onHover: () => void
  onLeave: () => void
  onSelect: () => void
  onReviewMatch: () => void
}) {
  const statusCfg = EVENT_STATUS_CONFIG[effectiveStatus]
  const isEligible = event.isBulkEligible && effectiveStatus !== 'verified'

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        borderRadius: 12,
        border: `1px solid ${isSourceHighlighted ? 'rgba(244,111,41,0.35)' : isSelected ? 'rgba(244,111,41,0.25)' : 'var(--c-border)'}`,
        background: isSourceHighlighted
          ? 'rgba(244,111,41,0.05)'
          : isSelected
          ? 'rgba(244,111,41,0.03)'
          : 'var(--c-card)',
        transition: 'all 160ms',
        borderLeft: `3px solid ${isSourceHighlighted ? '#F46F29' : isSelected ? 'rgba(244,111,41,0.5)' : 'var(--c-border)'}`,
        overflow: 'hidden',
      }}
    >
      {/* Card header row */}
      <div
        style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
        onClick={onExpand}
      >
        {/* Bulk checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (isEligible) onSelect()
          }}
          title={!isEligible ? 'This item requires individual review.' : undefined}
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${isSelected && isEligible ? '#F46F29' : isEligible ? 'var(--c-border-strong)' : 'var(--c-border)'}`,
            background: isSelected && isEligible ? '#F46F29' : 'transparent',
            flexShrink: 0,
            marginTop: 2,
            cursor: isEligible ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 120ms',
          }}
        >
          {isSelected && isEligible && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text)', fontVariantNumeric: 'tabular-nums' }}>
              {event.id}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                background: statusCfg.bg,
                color: statusCfg.color,
                letterSpacing: '0.03em',
              }}
            >
              {effectiveStatus === 'verified' ? '✓ Verified' : statusCfg.label}
            </span>
            {event.confidence > 0 && (
              <span style={{ fontSize: 11, color: effectiveStatus === 'needs-review' ? '#D97706' : 'var(--c-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {event.confidence}%
              </span>
            )}
            <span style={{ marginLeft: 'auto', color: 'var(--c-subtle)', flexShrink: 0 }}>
              {isExpanded
                ? <ChevronDown size={13} strokeWidth={2} />
                : <ChevronRight size={13} strokeWidth={2} />}
            </span>
          </div>

          {/* Source statement preview */}
          <p
            style={{
              marginTop: 5,
              fontSize: 12,
              color: 'var(--c-muted)',
              fontStyle: 'italic',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: isExpanded ? 'none' : '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            "{event.sourceStatement}"
          </p>

          {/* Compact key fields */}
          {!isExpanded && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 6 }}>
              <MetaChip label="Type" value={event.eventType} />
              <MetaChip label="Activity" value={event.activity} />
              <MetaChip label="Area" value={event.area} />
              {event.suggestedMatch && <MetaChip label="Match" value={event.suggestedMatch} accent />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded detail — mandatory order from spec */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--c-border)', padding: '0 14px 14px' }}>

          {/* 1. Source Evidence */}
          <Section label="Source Evidence">
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                borderLeft: '3px solid #F46F29',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--c-text)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{event.sourceStatement}"
              </p>
              <p style={{ marginTop: 6, fontSize: 11, color: 'var(--c-subtle)' }}>
                Piping_DPR_28Aug.pdf · Statement {event.sourceIndex}
              </p>
            </div>
          </Section>

          {/* 2. Structured Actual */}
          <Section label="Structured Actual">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
              {[
                { label: 'Actual ID',   value: event.id },
                { label: 'Activity',    value: event.activity },
                { label: 'Event Type',  value: event.eventType },
                { label: 'Date',        value: event.date ?? 'Not reported' },
                { label: 'Discipline',  value: event.discipline },
                { label: 'Area',        value: event.area },
                ...(event.line ? [{ label: 'Line', value: event.line }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ minWidth: 120 }}>
                  <p style={{ fontSize: 10, color: 'var(--c-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                  <p style={{
                    marginTop: 2,
                    fontSize: 12,
                    fontWeight: 500,
                    color: value === 'Not reported' ? 'var(--c-subtle)' : 'var(--c-text)',
                    fontStyle: value === 'Not reported' ? 'italic' : 'normal',
                  }}>{value}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 3. Suggested Schedule Match */}
          {event.suggestedMatch ? (
            <Section label="Suggested Schedule Match">
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(245,158,11,0.05)',
                  border: '1.5px dashed rgba(217,119,6,0.30)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#D97706',
                        marginBottom: 3,
                        display: 'block',
                      }}
                    >
                      AI Suggested
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>
                      {event.suggestedMatch}
                    </p>
                    {event.suggestedMatchMeta && (
                      <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2 }}>
                        {event.suggestedMatchMeta}
                      </p>
                    )}
                  </div>
                  {event.confidence > 0 && (
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#16A34A', fontVariantNumeric: 'tabular-nums', marginLeft: 12, flexShrink: 0 }}>
                      {event.confidence}%
                    </span>
                  )}
                </div>
              </div>
            </Section>
          ) : (
            <Section label="Suggested Schedule Match">
              <p style={{ fontSize: 13, color: 'var(--c-subtle)', fontStyle: 'italic' }}>
                No reliable match identified. Additional context required.
              </p>
            </Section>
          )}

          {/* 4. Matching Signals */}
          {event.matchingSignals && event.matchingSignals.length > 0 && (
            <Section label="Matching Signals">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {event.matchingSignals.map((sig) => {
                  const cfg = SIGNAL_STRENGTH_CONFIG[sig.strength]
                  return (
                    <div
                      key={sig.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: cfg.bg,
                        border: '1px solid transparent',
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>{sig.label}</span>
                      <span style={{ fontSize: 10, color: cfg.color, opacity: 0.7 }}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 12, color: 'var(--c-muted)', lineHeight: 1.5 }}>
                Line reference, discipline, area and reported execution terminology align strongly
                with this schedule activity.
              </p>
            </Section>
          )}

          {/* 7. Human Action */}
          <Section label="Action">
            <div style={{ display: 'flex', gap: 8 }}>
              {effectiveStatus === 'verified' ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#16A34A',
                  }}
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Verified
                </span>
              ) : event.status === 'strong-match' ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onReviewMatch() }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Review Match
                </button>
              ) : event.status === 'needs-review' ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onReviewMatch() }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: 'var(--c-page)',
                    border: '1px solid var(--c-border)',
                    color: '#7C3AED',
                    cursor: 'pointer',
                  }}
                >
                  Review Individually
                </button>
              ) : (
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: 'var(--c-page)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Request Clarification
                </button>
              )}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--c-subtle)', marginBottom: 8 }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function MetaChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span style={{ fontSize: 11, color: accent ? '#F46F29' : 'var(--c-muted)' }}>
      <span style={{ color: 'var(--c-subtle)' }}>{label}: </span>
      {value}
    </span>
  )
}

// ── Main ReportAnalysis Page ──────────────────────────────────────────────────

export default function ReportAnalysis({ reportId, onBack, onOpenReviewMatch }: Props) {
  const report = findReport(reportId) ?? primaryReport

  const [hoveredSource, setHoveredSource] = useState<number | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())
  const [verifiedEvents, setVerifiedEvents] = useState<Set<string>>(new Set())
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)
  const [evidenceHighlight, setEvidenceHighlight] = useState<number | null>(null)

  const effectiveStrongMatches = report.strongMatches - selectedEvents.size + verifiedEvents.size > 0
    ? report.strongMatches + verifiedEvents.size
    : report.strongMatches

  function getEffectiveStatus(evt: ReportEvent): EventStatus {
    if (verifiedEvents.has(evt.id)) return 'verified'
    return evt.status
  }

  function toggleSelect(id: string) {
    setSelectedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBulkVerify() {
    setVerifiedEvents((prev) => new Set([...prev, ...selectedEvents]))
    setSelectedEvents(new Set())
    setShowBulkConfirm(false)
  }

  const selectedEventObjects = report.events.filter(
    (e) => selectedEvents.has(e.id) && e.isBulkEligible
  )

  const verifiedCount = verifiedEvents.size
  const needsReviewCount = report.events.filter(
    (e) => !verifiedEvents.has(e.id) && e.status === 'needs-review'
  ).length
  const incompleteCount = report.events.filter(
    (e) => !verifiedEvents.has(e.id) && e.status === 'incomplete'
  ).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Breadcrumb + header */}
      <div
        style={{
          flexShrink: 0,
          padding: '20px 28px 16px',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-page)',
        }}
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--c-muted)', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <button onClick={onBack} style={{ color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                Reports
              </button>
            </li>
            <li aria-hidden="true"><ChevronRight size={11} strokeWidth={2} /></li>
            <li>
              <span style={{ color: 'var(--c-text)', fontWeight: 500 }}>{report.filename}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 10 }}>
          <div>
            <h1
              style={{ fontSize: 20, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.02em' }}
            >
              {report.filename}
            </h1>
            <p style={{ marginTop: 3, fontSize: 13, color: 'var(--c-muted)' }}>
              {report.discipline} · {report.area} · {report.date}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'rgba(22,163,74,0.10)',
                  color: '#16A34A',
                }}
              >
                <CheckCircle2 size={10} strokeWidth={2.5} />
                Processed
              </span>
              {/* Summary stats */}
              {[
                { label: `${report.actualsFound} Events`, color: 'var(--c-text)' },
                { label: `${verifiedCount > 0 ? verifiedCount : report.strongMatches} Strong Match${report.strongMatches !== 1 ? 'es' : ''}`, color: '#16A34A' },
                ...(needsReviewCount > 0 ? [{ label: `${needsReviewCount} Needs Review`, color: '#7C3AED' }] : []),
                ...(incompleteCount > 0 ? [{ label: `${incompleteCount} Incomplete`, color: 'var(--c-muted)' }] : []),
              ].map(({ label, color }, i) => (
                <span key={i} style={{ fontSize: 12, color, fontWeight: 500 }}>
                  {i === 0 ? '' : '· '}
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setEvidenceHighlight(null); setShowEvidence(true) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                cursor: 'pointer',
              }}
            >
              <Eye size={13} strokeWidth={2} />
              View Original
            </button>
            <button
              style={{
                padding: '8px 14px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
                cursor: 'pointer',
              }}
            >
              Upload New Version
            </button>
          </div>
        </div>
      </div>

      {/* Split view */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: Source Document (~45%) */}
        <div
          style={{
            width: '44%',
            flexShrink: 0,
            borderRight: '1px solid var(--c-border)',
            overflowY: 'auto',
            padding: '20px 24px',
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--c-subtle)',
              marginBottom: 14,
            }}
          >
            Original Source Document
          </p>

          {/* Document representation */}
          <div
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: 'var(--c-shadow-card)',
            }}
          >
            {/* Doc header */}
            <div
              style={{
                padding: '16px 20px 12px',
                borderBottom: '1px solid var(--c-border)',
                background: 'var(--c-page)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                <FileText size={14} strokeWidth={1.8} style={{ color: '#F46F29' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Daily Progress Report
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>28 Aug 2026</p>
              <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 2 }}>Area B — Piping</p>
            </div>

            {/* Statements */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SOURCE_STATEMENTS.map((stmt, i) => {
                const idx = i + 1
                const isHighlighted =
                  hoveredEvent !== null
                    ? report.events.some(
                        (e) => e.id === hoveredEvent && e.sourceIndex === idx
                      )
                    : hoveredSource === idx

                const linkedEvent = report.events.find((e) => e.sourceIndex === idx)

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (linkedEvent) {
                        setExpandedEvent(
                          expandedEvent === linkedEvent.id ? null : linkedEvent.id
                        )
                      }
                    }}
                    onMouseEnter={() => setHoveredSource(idx)}
                    onMouseLeave={() => setHoveredSource(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '9px 10px',
                      borderRadius: 8,
                      cursor: linkedEvent ? 'pointer' : 'default',
                      /* Source highlighting: left border + tint — not color alone */
                      borderLeft: `3px solid ${isHighlighted ? '#F46F29' : 'transparent'}`,
                      background: isHighlighted ? 'rgba(244,111,41,0.07)' : 'transparent',
                      transition: 'all 140ms',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isHighlighted ? '#F46F29' : 'var(--c-subtle)',
                        minWidth: 16,
                        paddingTop: 2,
                        flexShrink: 0,
                        transition: 'color 140ms',
                      }}
                    >
                      {idx}.
                    </span>
                    <p style={{ fontSize: 13, color: 'var(--c-text)', lineHeight: 1.55 }}>
                      {stmt}
                    </p>
                    {linkedEvent && (
                      <ExternalLink
                        size={11}
                        strokeWidth={2}
                        style={{
                          flexShrink: 0,
                          marginTop: 3,
                          color: isHighlighted ? '#F46F29' : 'var(--c-subtle)',
                          opacity: isHighlighted ? 1 : 0,
                          transition: 'opacity 140ms',
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Traceability footer */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid var(--c-border)',
                background: 'var(--c-page)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: 'var(--c-subtle)',
              }}
            >
              <span>{report.filename}</span>
              <span>↓</span>
              <span>6 Actual Events</span>
              <span>↓</span>
              <span>Schedule Candidates</span>
              <span>↓</span>
              <span>Human Verification</span>
            </div>
          </div>
        </div>

        {/* Right: Extracted Actuals (~55%) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--c-subtle)',
              }}
            >
              Extracted Actual Events
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {selectedEvents.size > 0 && (
                <button
                  onClick={() => setSelectedEvents(new Set())}
                  style={{
                    fontSize: 12,
                    color: 'var(--c-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Event cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {report.events.map((evt) => {
              const effectiveStatus = getEffectiveStatus(evt)
              const isSourceHigh =
                hoveredSource !== null && evt.sourceIndex === hoveredSource

              return (
                <EventCard
                  key={evt.id}
                  event={evt}
                  effectiveStatus={effectiveStatus}
                  isExpanded={expandedEvent === evt.id}
                  isSourceHighlighted={isSourceHigh}
                  isSelected={selectedEvents.has(evt.id)}
                  onExpand={() =>
                    setExpandedEvent(expandedEvent === evt.id ? null : evt.id)
                  }
                  onHover={() => setHoveredEvent(evt.id)}
                  onLeave={() => setHoveredEvent(null)}
                  onSelect={() => toggleSelect(evt.id)}
                  onReviewMatch={() => onOpenReviewMatch(evt.id)}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedEvents.size > 0 && (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            borderTop: '1px solid var(--c-border)',
            background: 'var(--c-card)',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>
            {selectedEvents.size} selected
          </span>
          <button
            onClick={() => setShowBulkConfirm(true)}
            style={{
              padding: '8px 18px',
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Review Selected
          </button>
          <button
            onClick={() => setSelectedEvents(new Set())}
            style={{
              fontSize: 13,
              color: 'var(--c-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Bulk confirm modal */}
      <BulkConfirmModal
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        events={selectedEventObjects}
        onVerify={handleBulkVerify}
      />

      {/* Source Evidence Viewer */}
      <SourceEvidenceViewer
        open={showEvidence}
        onClose={() => setShowEvidence(false)}
        highlightIndex={evidenceHighlight}
      />
    </div>
  )
}
