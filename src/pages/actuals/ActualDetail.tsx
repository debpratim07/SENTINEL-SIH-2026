import { ChevronRight, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import {
  ACTUALS,
  ACTUAL_STATUS_CONFIG,
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
        borderRadius: 6,
        padding: '3px 9px',
        fontSize: 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  )
}

// ── Info field ────────────────────────────────────────────────────────────────

function InfoField({
  label,
  value,
  mono,
  inferred,
  missing,
}: {
  label: string
  value?: string | null
  mono?: boolean
  inferred?: boolean
  missing?: boolean
}) {
  const isMissing = missing || !value
  return (
    <div>
      <div
        className="mb-0.5 text-[10px] font-bold uppercase"
        style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: isMissing ? 'var(--c-subtle)' : 'var(--c-text)',
          fontStyle: isMissing ? 'italic' : 'normal',
          fontFamily: mono && !isMissing ? 'var(--font-data)' : 'var(--font-ui)',
        }}
      >
        {isMissing ? 'Not reported' : value}
        {inferred && !isMissing && (
          <span
            className="ml-2 rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: 'rgba(124,58,237,0.09)', color: '#7C3AED' }}
          >
            Inferred
          </span>
        )}
      </div>
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-[14px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
      }}
    >
      <h3
        className="mb-4 text-[12px] font-bold uppercase"
        style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

// ── History timeline ──────────────────────────────────────────────────────────

function HistoryItem({
  time,
  text,
  sub,
  last,
}: {
  time: string
  text: string
  sub?: string
  last?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="mt-0.5 h-2 w-2 rounded-full flex-shrink-0"
          style={{ background: 'var(--c-border-strong)' }}
        />
        {!last && (
          <div className="w-px flex-1 mt-1" style={{ background: 'var(--c-border)', minHeight: 20 }} />
        )}
      </div>
      <div className="pb-4">
        <div className="flex items-baseline gap-2">
          <span
            className="text-[10px] font-semibold"
            style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
          >
            {time}
          </span>
          <span className="text-[12px] font-medium" style={{ color: 'var(--c-text)' }}>
            {text}
          </span>
        </div>
        {sub && (
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  actualId: string
  onBack: () => void
  onViewException?: (exceptionId: string) => void
  onViewScheduleActivity?: (activityId: string) => void
  onViewSourceEvidence?: () => void
}

export default function ActualDetail({ actualId, onBack, onViewException, onViewScheduleActivity, onViewSourceEvidence }: Props) {
  const actual = ACTUALS.find((a) => a.id === actualId)

  if (!actual) {
    return (
      <div className="flex h-full items-center justify-center" style={{ padding: 32 }}>
        <p style={{ color: 'var(--c-muted)' }}>Actual not found.</p>
      </div>
    )
  }

  const cfg = ACTUAL_STATUS_CONFIG[actual.status]

  // ── Hero data for ACT-2026-0842 (full spec'd detail) ──────────────────────
  const isHero = actualId === 'ACT-2026-0842'

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 28px 48px' }}>

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-1.5 text-[12px]"
          style={{ color: 'var(--c-muted)' }}
        >
          <button
            onClick={onBack}
            className="font-medium transition-colors duration-100 hover:opacity-70"
            style={{ color: 'var(--c-muted)' }}
          >
            Actuals
          </button>
          <ChevronRight size={12} strokeWidth={2} aria-hidden="true" />
          <span style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>{actual.id}</span>
        </nav>

        {/* Page header */}
        <div
          className="mb-6 rounded-[16px] p-6"
          style={{
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            boxShadow: 'var(--c-shadow-card)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1
                className="text-[24px] font-bold tracking-[-0.02em] leading-[30px]"
                style={{ color: 'var(--c-text)' }}
              >
                {actual.activityName}
              </h1>
              <div
                className="mt-1 text-[12px]"
                style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
              >
                {actual.id}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                {actual.eventType} · {actual.discipline ?? 'Discipline not reported'}
                {actual.area ? ` · ${actual.area}` : ''}
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              <StatusBadge status={actual.status} />
            </div>
          </div>

          {/* Header meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {actual.scheduleLink && (
              <div>
                <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Linked Activity
                </span>
                <div
                  className="text-[12px] font-semibold"
                  style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                >
                  {actual.scheduleLink}
                </div>
              </div>
            )}
            {actual.reviewedBy && (
              <div>
                <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Reviewed By
                </span>
                <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  {actual.reviewedBy}
                </div>
              </div>
            )}
          </div>

          {/* Contextual actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {actual.scheduleLink && actual.scheduleLinkId && (
              <button
                onClick={() => onViewScheduleActivity?.(actual.scheduleLinkId!)}
                className="rounded-[9px] border px-4 py-2 text-[12px] font-semibold transition-all duration-150 hover:opacity-80"
                style={{
                  border: '1px solid var(--c-border)',
                  background: 'var(--c-page)',
                  color: 'var(--c-text)',
                  cursor: 'pointer',
                }}
              >
                View Schedule Activity
              </button>
            )}
            <button
              onClick={() => onViewSourceEvidence?.()}
              className="rounded-[9px] border px-4 py-2 text-[12px] font-semibold transition-all duration-150 hover:opacity-80"
              style={{
                border: '1px solid var(--c-border)',
                background: 'var(--c-page)',
                color: 'var(--c-text)',
                cursor: 'pointer',
              }}
            >
              <span className="flex items-center gap-1.5">
                <FileText size={12} strokeWidth={2} aria-hidden="true" />
                View Source Evidence
              </span>
            </button>
            {actual.exceptionId && onViewException && (
              <button
                onClick={() => onViewException(actual.exceptionId!)}
                className="flex items-center gap-1.5 rounded-[9px] px-4 py-2 text-[12px] font-semibold transition-all duration-150 hover:opacity-80"
                style={{
                  border: '1px solid rgba(220,38,38,0.30)',
                  background: 'rgba(220,38,38,0.05)',
                  color: '#DC2626',
                }}
              >
                <AlertTriangle size={12} strokeWidth={2} aria-hidden="true" />
                View Exception
              </button>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="flex flex-col gap-4">

          {/* 1. Execution Summary */}
          <SectionCard title="Execution Summary">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <InfoField label="Activity" value={actual.activityName} />
              <InfoField label="Event" value={actual.eventType} />
              <InfoField
                label="Actual Date"
                value={actual.status === 'conflicting' ? undefined : actual.date}
                mono={!!actual.date}
                missing={!actual.date || actual.status === 'conflicting'}
              />
              <InfoField label="Discipline" value={actual.discipline} />
              <InfoField label="Area" value={actual.area} missing={!actual.area} />
              {isHero && <InfoField label="Line Reference" value="24-XX" mono />}
              <div>
                <div
                  className="mb-0.5 text-[10px] font-bold uppercase"
                  style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
                >
                  Status
                </div>
                <StatusBadge status={actual.status} />
              </div>
            </div>
          </SectionCard>

          {/* 2. Original Evidence */}
          <SectionCard title="Original Evidence">
            <div
              className="mb-4 rounded-[10px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--c-text)', fontStyle: 'italic' }}
              >
                {isHero
                  ? '"Spool erected in Area B. Final bolt tightening pending."'
                  : actual.status === 'conflicting'
                  ? '"Pump P-204 alignment started this morning."'
                  : actual.status === 'incomplete'
                  ? '"Welding work started. Location confirmation pending."'
                  : `"${actual.activityName} reported."`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <InfoField label="Source" value={actual.source} />
              <InfoField
                label="Reported"
                value={
                  isHero
                    ? '26 Aug 2026 · 08:42'
                    : actual.date
                    ? `${actual.date} · 07:30`
                    : undefined
                }
                mono
              />
            </div>
            <button
              className="mt-4 text-[12px] font-semibold transition-opacity duration-150 hover:opacity-70"
              style={{ color: '#F46F29' }}
            >
              View Full Evidence →
            </button>
          </SectionCard>

          {/* 3. Structured Actual */}
          <SectionCard title="Structured Actual">
            <p className="mb-4 text-[12px]" style={{ color: 'var(--c-muted)' }}>
              Fields extracted or inferred from the original evidence. Missing information is never
              invented.
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <InfoField label="Activity Name" value={actual.activityName} />
              <InfoField label="Event Type" value={actual.eventType} inferred={isHero} />
              <InfoField
                label="Actual Date"
                value={actual.status === 'conflicting' ? undefined : actual.date}
                mono={!!actual.date}
                missing={!actual.date || actual.status === 'conflicting'}
              />
              <InfoField label="Discipline" value={actual.discipline} inferred={!isHero} />
              <InfoField label="Area" value={actual.area} missing={!actual.area} />
              {isHero ? (
                <InfoField label="Line Reference" value="24-XX" mono inferred />
              ) : (
                <InfoField label="Line Reference" value={null} missing />
              )}
            </div>
          </SectionCard>

          {/* 4. Schedule Relationship */}
          {actual.scheduleLink && (
            <SectionCard title="Schedule Relationship">
              <div
                className="mb-4 rounded-[10px] p-4"
                style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
              >
                <div
                  className="text-[13px] font-bold"
                  style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                >
                  {actual.scheduleLink}
                </div>
                <div className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                  {isHero ? 'L6 · Piping · Area B' : `${actual.discipline ?? 'Not reported'}${actual.area ? ` · ${actual.area}` : ''}`}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div
                    className="mb-1 text-[10px] font-bold uppercase"
                    style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
                  >
                    Human Verification
                  </div>
                  <div className="flex items-center gap-1.5">
                    {actual.status === 'verified' ? (
                      <>
                        <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#16A34A' }} aria-hidden="true" />
                        <span className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>
                          Verified
                        </span>
                      </>
                    ) : (
                      <span className="text-[13px] font-medium" style={{ color: 'var(--c-muted)' }}>
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                {actual.confidence && (
                  <div>
                    <div
                      className="mb-1 text-[10px] font-bold uppercase"
                      style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
                    >
                      AI Confidence
                    </div>
                    <div
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                    >
                      {actual.confidence}%
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* 5. Trust / Review */}
          {(actual.reviewedBy || actual.confidence) && (
            <SectionCard title="Trust & Review">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {actual.reviewedBy && (
                  <>
                    <InfoField label="Reviewed By" value={actual.reviewedBy} />
                    <InfoField
                      label="Review Date"
                      value={isHero ? '28 Aug 2026 · 10:44' : '28 Aug 2026 · 09:15'}
                      mono
                    />
                    <InfoField label="Decision" value="Accepted Suggested Match" />
                    {actual.confidence && (
                      <InfoField label="Original AI Suggestion" value={actual.scheduleLink ?? undefined} mono />
                    )}
                    {actual.confidence && (
                      <InfoField
                        label="Confidence"
                        value={`${actual.confidence}%`}
                        mono
                      />
                    )}
                  </>
                )}
                {!actual.reviewedBy && actual.confidence && (
                  <>
                    <InfoField label="AI Confidence" value={`${actual.confidence}%`} mono />
                    <InfoField label="Review Decision" value={null} missing />
                  </>
                )}
              </div>
            </SectionCard>
          )}

          {/* 6. Source Context */}
          <SectionCard title="Source Context">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoField label="Source Type" value={actual.source} />
              <InfoField
                label="Report Reference"
                value={isHero ? 'RPT-2026-0001' : undefined}
                mono
                missing={!isHero}
              />
              <InfoField
                label="Captured"
                value={isHero ? '26 Aug 2026 · 08:42' : actual.date ? `${actual.date} · 07:30` : undefined}
                mono
                missing={!actual.date && !isHero}
              />
            </div>
          </SectionCard>

          {/* 7. History */}
          <SectionCard title="History">
            {isHero ? (
              <div>
                <HistoryItem time="26 Aug · 08:42" text="Actual captured" />
                <HistoryItem
                  time="26 Aug · 08:43"
                  text="Schedule candidate suggested"
                  sub="ERECT LINE 24-XX · 91%"
                />
                <HistoryItem time="28 Aug · 10:44" text="Match verified" sub="Arjun Mehta" />
                <HistoryItem
                  time="28 Aug · 10:44"
                  text="Schedule Actual Start updated"
                  last
                />
              </div>
            ) : (
              <div>
                <HistoryItem
                  time={actual.date ? `${actual.date.split(' ').slice(0, 2).join(' ')} · 07:30` : '26 Aug · 07:30'}
                  text="Actual captured"
                />
                {actual.scheduleLink && (
                  <HistoryItem
                    time={actual.date ? `${actual.date.split(' ').slice(0, 2).join(' ')} · 07:31` : '26 Aug · 07:31'}
                    text="Schedule candidate suggested"
                    sub={`${actual.scheduleLink} · ${actual.confidence ?? 0}%`}
                  />
                )}
                <HistoryItem
                  time="28 Aug · 09:00"
                  text={
                    actual.status === 'verified'
                      ? 'Match verified'
                      : actual.status === 'conflicting'
                      ? 'Conflict detected — resolution required'
                      : actual.status === 'awaiting-clarification'
                      ? 'Clarification request sent'
                      : 'Awaiting review'
                  }
                  last
                />
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
