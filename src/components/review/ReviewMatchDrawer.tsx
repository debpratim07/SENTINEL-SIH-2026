import { useState } from 'react'
import {
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  FileText,
  ExternalLink,
} from 'lucide-react'
import Drawer from '../ui/Drawer'
import type { ReviewItem } from '../../data/reviewMockData'
import ChooseActivityModal from './ChooseActivityModal'
import MarkUnmatchedDialog from './MarkUnmatchedDialog'
import RequestClarificationModal from './RequestClarificationModal'

const SIGNAL_COLORS = {
  Strong: '#16A34A',
  Match: '#2563EB',
  Compatible: '#7C3AED',
  Weak: '#D97706',
  Missing: '#DC2626',
}

const SIGNAL_LABELS = {
  Strong: 'Strong',
  Match: 'Match',
  Compatible: 'Compatible',
  Weak: 'Weak',
  Missing: 'Not reported',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  'needs-review': { bg: 'rgba(37,99,235,0.10)', color: '#2563EB', label: 'Needs Review' },
  ambiguous: { bg: 'rgba(217,119,6,0.12)', color: '#D97706', label: 'Ambiguous' },
  incomplete: { bg: 'rgba(245,158,11,0.10)', color: '#D97706', label: 'Incomplete' },
  unmatched: { bg: 'rgba(220,38,38,0.10)', color: '#DC2626', label: 'Unmatched' },
}

interface SelectedActivity {
  id: string
  label: string
  tier: string
  discipline: string
  area: string
}

interface Props {
  item: ReviewItem
  open: boolean
  onClose: () => void
  onAccept: (id: string) => void
}

export default function ReviewMatchDrawer({ item, open, onClose, onAccept }: Props) {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [showChooseActivity, setShowChooseActivity] = useState(false)
  const [showMarkUnmatched, setShowMarkUnmatched] = useState(false)
  const [showRequestClarification, setShowRequestClarification] = useState(false)
  const [plannerOverride, setPlannerOverride] = useState<SelectedActivity | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [selectedCandidateIdx, setSelectedCandidateIdx] = useState<number | null>(null)

  const status = STATUS_STYLE[item.status] ?? STATUS_STYLE['needs-review']

  function handleAccept() {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setVerified(true)
      setTimeout(() => {
        onAccept(item.id)
        setVerified(false)
      }, 1200)
    }, 1400)
  }

  function handleMarkUnmatched(comment: string) {
    setShowMarkUnmatched(false)
    onClose()
  }

  function handleChooseActivity(activity: SelectedActivity) {
    setPlannerOverride(activity)
    setShowChooseActivity(false)
  }

  const currentSuggested = item.suggestedActivity

  return (
    <>
      <Drawer open={open} onClose={onClose} width={660} aria-label="Review Match">
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--c-border)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2
                  className="text-[17px] font-bold tracking-[-0.02em]"
                  style={{ color: 'var(--c-text)' }}
                >
                  Review Match
                </h2>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
                >
                  {item.id}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    background: status.bg,
                    color: status.color,
                    letterSpacing: '0.07em',
                  }}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                {item.extractedEvent} · {item.extractedDiscipline} · {item.extractedArea ?? 'Area unknown'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors duration-150"
              style={{ color: 'var(--c-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
          {/* Verifying overlay */}
          {verifying && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <Loader2
                size={32}
                strokeWidth={2}
                style={{ color: '#F46F29' }}
                className="animate-spin"
              />
              <div>
                <p className="text-[16px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  Verifying...
                </p>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                  Creating review decision
                </p>
              </div>
            </div>
          )}

          {/* Verified state */}
          {verified && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: 'rgba(22,163,74,0.12)' }}
              >
                <CheckCircle2 size={28} strokeWidth={1.5} style={{ color: '#16A34A' }} />
              </div>
              <div>
                <p className="text-[16px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  Match verified
                </p>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                  {plannerOverride?.label ?? item.suggestedActivity} updated successfully.
                </p>
              </div>
            </div>
          )}

          {!verifying && !verified && (
            <div className="flex flex-col gap-5">
              {/* 1. FIELD EVIDENCE — always first */}
              <Section label="Field Evidence">
                <div
                  className="rounded-[12px] p-4"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                >
                  <p className="text-[14px] italic leading-relaxed" style={{ color: 'var(--c-text)' }}>
                    "{item.fieldText}"
                  </p>
                  <div
                    className="mt-3 flex items-center justify-between border-t pt-3"
                    style={{ borderColor: 'var(--c-border)' }}
                  >
                    <div>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--c-muted)' }}>
                        {item.source}
                      </span>
                      <span className="mx-2 text-[12px]" style={{ color: 'var(--c-subtle)' }}>·</span>
                      <span className="text-[12px]" style={{ color: 'var(--c-subtle)' }}>
                        {item.sourceDate} · {item.sourceTime}
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: '#F46F29' }}
                    >
                      <FileText size={12} strokeWidth={2} />
                      View Full Evidence
                    </button>
                  </div>
                </div>
              </Section>

              {/* 2. EXTRACTED ACTUAL */}
              <Section label="Extracted Actual">
                <div
                  className="rounded-[12px] overflow-hidden"
                  style={{ border: '1px solid var(--c-border)' }}
                >
                  {[
                    { label: 'Activity', value: item.extractedActivity, inferred: false },
                    { label: 'Event', value: item.extractedEvent, inferred: false },
                    { label: 'Date', value: item.extractedDate, inferred: false },
                    { label: 'Discipline', value: item.extractedDiscipline, inferred: true },
                    { label: 'Area', value: item.extractedArea ?? 'Not reported', inferred: false },
                    { label: 'Line Reference', value: item.extractedLineRef ?? 'Not reported', inferred: !!item.extractedLineRef },
                  ].map(({ label, value, inferred }, i, arr) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 px-4 py-3"
                      style={{
                        background: 'var(--c-card)',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--c-border)' : 'none',
                      }}
                    >
                      <span
                        className="w-28 shrink-0 text-[12px]"
                        style={{ color: 'var(--c-muted)' }}
                      >
                        {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[13px] font-medium"
                          style={{
                            color:
                              value === 'Not reported'
                                ? 'var(--c-subtle)'
                                : 'var(--c-text)',
                            fontStyle: value === 'Not reported' ? 'italic' : 'normal',
                          }}
                        >
                          {value}
                        </span>
                        {inferred && value !== 'Not reported' && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                            style={{
                              background: 'rgba(244,111,41,0.10)',
                              color: '#D97706',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Inferred
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Planner override notice (if chosen) */}
              {plannerOverride && (
                <div
                  className="rounded-[12px] p-4"
                  style={{
                    background: 'rgba(37,99,235,0.07)',
                    border: '1.5px solid rgba(37,99,235,0.25)',
                  }}
                >
                  <p
                    className="mb-1 text-[10px] font-bold uppercase"
                    style={{ color: '#2563EB', letterSpacing: '0.09em' }}
                  >
                    Planner Selected
                  </p>
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                  >
                    {plannerOverride.label}
                  </p>
                  <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                    {plannerOverride.tier} · {plannerOverride.discipline} · {plannerOverride.area}
                  </p>
                  {item.suggestedActivity && (
                    <div
                      className="mt-3 pt-3"
                      style={{ borderTop: '1px solid rgba(37,99,235,0.18)' }}
                    >
                      <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                        Original AI Recommendation:{' '}
                        <span style={{ fontFamily: 'var(--font-data)', color: 'var(--c-subtle)' }}>
                          {item.suggestedActivity} · {item.confidence}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SUGGESTED SCHEDULE MATCH */}
              {item.suggestedActivity && !plannerOverride && (
                <Section label="Suggested Schedule Match">
                  <div
                    className="rounded-[14px] p-4"
                    style={{
                      background: 'rgba(245,158,11,0.05)',
                      border: '1.5px dashed rgba(217,119,6,0.30)',
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: 'rgba(245,158,11,0.15)',
                          color: '#D97706',
                          letterSpacing: '0.08em',
                          border: '1px solid rgba(217,119,6,0.28)',
                        }}
                      >
                        AI Suggested
                      </span>
                    </div>
                    <p
                      className="text-[15px] font-bold tracking-[-0.01em]"
                      style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                    >
                      {item.suggestedActivity}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                      {item.suggestedTier} · {item.suggestedDiscipline} · {item.suggestedArea}
                    </p>
                  </div>
                </Section>
              )}

              {/* No match state */}
              {!item.suggestedActivity && (
                <Section label="Suggested Schedule Match">
                  <div
                    className="rounded-[12px] p-4 text-center"
                    style={{ background: 'var(--c-page)', border: '1px dashed var(--c-border)' }}
                  >
                    <p className="text-[13px]" style={{ color: 'var(--c-subtle)' }}>
                      No schedule match identified. Planner review required.
                    </p>
                  </div>
                </Section>
              )}

              {/* 4. CONFIDENCE */}
              {item.confidence > 0 && (
                <Section label="Confidence">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          item.confidence >= 85
                            ? 'rgba(22,163,74,0.10)'
                            : item.confidence >= 60
                            ? 'rgba(245,158,11,0.10)'
                            : 'rgba(220,38,38,0.10)',
                        border: `2px solid ${
                          item.confidence >= 85
                            ? 'rgba(22,163,74,0.25)'
                            : item.confidence >= 60
                            ? 'rgba(217,119,6,0.25)'
                            : 'rgba(220,38,38,0.25)'
                        }`,
                      }}
                    >
                      <span
                        className="text-[20px] font-bold"
                        style={{
                          color:
                            item.confidence >= 85
                              ? '#16A34A'
                              : item.confidence >= 60
                              ? '#D97706'
                              : '#DC2626',
                          fontFamily: 'var(--font-ui)',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {item.confidence}%
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>
                        {item.confidenceLabel}
                      </p>
                      <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                        Confidence does not equal approval — human review required.
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* 5. MATCHING SIGNALS */}
              {item.signals.length > 0 && (
                <Section label="Matching Signals">
                  <div className="flex flex-col gap-2">
                    {item.signals.map((sig) => (
                      <div key={sig.label} className="flex items-center justify-between">
                        <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                          {sig.label}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{
                            background:
                              sig.strength === 'Strong'
                                ? 'rgba(22,163,74,0.10)'
                                : sig.strength === 'Match'
                                ? 'rgba(37,99,235,0.10)'
                                : sig.strength === 'Compatible'
                                ? 'rgba(124,58,237,0.10)'
                                : sig.strength === 'Weak'
                                ? 'rgba(217,119,6,0.10)'
                                : 'rgba(220,38,38,0.10)',
                            color: SIGNAL_COLORS[sig.strength],
                          }}
                        >
                          {SIGNAL_LABELS[sig.strength]}
                        </span>
                      </div>
                    ))}
                    {item.signalExplanation && (
                      <p
                        className="mt-2 border-t pt-3 text-[12px] leading-relaxed"
                        style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
                      >
                        {item.signalExplanation}
                      </p>
                    )}
                  </div>
                </Section>
              )}

              {/* 6. OTHER CANDIDATES */}
              {item.alternatives.length > 0 && (
                <Section label="Other Candidates">
                  <div
                    className="rounded-[12px] overflow-hidden"
                    style={{ border: '1px solid var(--c-border)' }}
                  >
                    {item.alternatives.map((alt, i) => (
                      <button
                        key={alt.activity}
                        onClick={() =>
                          setSelectedCandidateIdx(selectedCandidateIdx === i ? null : i)
                        }
                        className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors duration-100"
                        style={{
                          background:
                            selectedCandidateIdx === i
                              ? 'rgba(244,111,41,0.06)'
                              : 'var(--c-card)',
                          borderBottom:
                            i < item.alternatives.length - 1
                              ? '1px solid var(--c-border)'
                              : 'none',
                          borderLeft:
                            selectedCandidateIdx === i
                              ? '3px solid #F46F29'
                              : '3px solid transparent',
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="text-[13px] font-semibold"
                            style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                          >
                            {alt.activity}
                          </p>
                          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                            {alt.tier} · {alt.discipline} · {alt.area}
                          </p>
                        </div>
                        <span
                          className="text-[15px] font-bold"
                          style={{
                            color:
                              alt.confidence >= 60
                                ? '#D97706'
                                : 'var(--c-subtle)',
                            fontFamily: 'var(--font-ui)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {alt.confidence}%
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* 7. SCHEDULE CONTEXT — collapsed accordion */}
              {item.scheduleContext && (
                <div
                  className="rounded-[12px] overflow-hidden"
                  style={{ border: '1px solid var(--c-border)' }}
                >
                  <button
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                    style={{ background: 'var(--c-page)' }}
                    onClick={() => setScheduleOpen((v) => !v)}
                  >
                    <span
                      className="text-[11px] font-bold uppercase"
                      style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
                    >
                      Schedule Context
                    </span>
                    {scheduleOpen ? (
                      <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
                    ) : (
                      <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
                    )}
                  </button>
                  {scheduleOpen && (
                    <div
                      className="divide-y"
                      style={{ borderColor: 'var(--c-border)', borderTop: '1px solid var(--c-border)' }}
                    >
                      {[
                        { label: 'Activity', value: item.scheduleContext.activity },
                        { label: 'Planned Start', value: item.scheduleContext.plannedStart },
                        { label: 'Planned Finish', value: item.scheduleContext.plannedFinish },
                        { label: 'Current Actual Start', value: item.scheduleContext.currentActualStart },
                        { label: 'Status', value: item.scheduleContext.currentStatus },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-center gap-4 px-4 py-3"
                          style={{ background: 'var(--c-card)' }}
                        >
                          <span
                            className="w-32 shrink-0 text-[12px]"
                            style={{ color: 'var(--c-muted)' }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-[13px] font-medium"
                            style={{
                              color:
                                value === 'Not reported'
                                  ? 'var(--c-subtle)'
                                  : 'var(--c-text)',
                              fontStyle: value === 'Not reported' ? 'italic' : 'normal',
                              fontFamily: label === 'Activity' ? 'var(--font-data)' : 'var(--font-ui)',
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Request clarification — tertiary */}
              <div className="pt-1">
                <button
                  onClick={() => setShowRequestClarification(true)}
                  className="text-[12px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'var(--c-subtle)' }}
                >
                  Request Clarification from reporter →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 8. STICKY FOOTER — Human Decision */}
        {!verifying && !verified && (
          <div
            style={{
              flexShrink: 0,
              padding: '14px 24px',
              borderTop: '1px solid var(--c-border)',
              background: 'var(--c-card)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <button
              onClick={() => setShowMarkUnmatched(true)}
              className="rounded-[10px] px-4 py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
              }}
            >
              Mark Unmatched
            </button>
            <button
              onClick={() => setShowChooseActivity(true)}
              className="rounded-[10px] px-4 py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
              }}
            >
              Choose Another
            </button>
            <button
              onClick={handleAccept}
              className="ml-auto rounded-[10px] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                boxShadow: '0 2px 10px rgba(244,111,41,0.28)',
              }}
            >
              Accept Match
            </button>
          </div>
        )}
      </Drawer>

      {/* Sub-modals */}
      <ChooseActivityModal
        open={showChooseActivity}
        onClose={() => setShowChooseActivity(false)}
        onSelect={handleChooseActivity}
        currentActivityId={item.suggestedActivity ?? undefined}
      />

      <MarkUnmatchedDialog
        open={showMarkUnmatched}
        onClose={() => setShowMarkUnmatched(false)}
        onConfirm={handleMarkUnmatched}
        activityId={item.id}
      />

      <RequestClarificationModal
        open={showRequestClarification}
        onClose={() => setShowRequestClarification(false)}
        activityId={item.id}
      />
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="mb-3 text-[10px] font-bold uppercase"
        style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
