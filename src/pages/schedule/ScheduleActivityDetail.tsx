import { ChevronRight, CheckCircle2, FileText } from 'lucide-react'
import { findActivity, STATUS_CONFIG, TRUST_CONFIG, fmtDateLong } from '../../data/scheduleData'

interface Props {
  activityId: string
  onBack: () => void
  onViewActual?: (actualId: string) => void
  onViewAuditLog?: () => void
  onViewSourceEvidence?: () => void
}

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
      }}
    >
      <div
        className="px-5 py-3.5"
        style={{ background: 'var(--c-page)', borderBottom: '1px solid var(--c-border)' }}
      >
        <h3
          className="text-[10px] font-bold uppercase"
          style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
        >
          {label}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-6 py-2.5"
      style={{ borderBottom: '1px solid var(--c-border)' }}
    >
      <span
        className="w-36 shrink-0 text-[12px]"
        style={{ color: 'var(--c-muted)', paddingTop: 1 }}
      >
        {label}
      </span>
      <div className="flex-1 text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
        {children}
      </div>
    </div>
  )
}

export default function ScheduleActivityDetail({ activityId, onBack, onViewActual, onViewAuditLog, onViewSourceEvidence }: Props) {
  const activity = findActivity(activityId)

  if (!activity) {
    return (
      <div className="flex h-full items-center justify-center" style={{ padding: 32 }}>
        <p style={{ color: 'var(--c-muted)' }}>Activity not found.</p>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[activity.status]
  const trustCfg = TRUST_CONFIG[activity.trust]

  return (
    <div
      style={{
        padding: '28px 32px 60px',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          <li>
            <button
              onClick={onBack}
              className="transition-opacity hover:opacity-70"
              style={{ color: 'var(--c-muted)' }}
            >
              Schedule
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} strokeWidth={2} />
          </li>
          <li>
            <button
              onClick={onBack}
              className="transition-opacity hover:opacity-70"
              style={{ color: 'var(--c-muted)' }}
            >
              Activities
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} strokeWidth={2} />
          </li>
          <li>
            <span
              style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)', fontWeight: 500, fontSize: 12 }}
            >
              {activity.label}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="rounded-[16px] p-6"
        style={{
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          boxShadow: 'var(--c-shadow-card)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-[22px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
            >
              {activity.label}
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              {activity.level} · {activity.discipline} · {activity.area}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="rounded-[6px] px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
              <span
                className="rounded-[6px] px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: trustCfg.bg, color: trustCfg.color }}
              >
                {activity.trust === 'verified' ? 'Verified Actual' : trustCfg.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-[9px] px-3.5 py-2 text-[13px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
              }}
            >
              View Timeline
            </button>
            <button
              onClick={() => onViewSourceEvidence?.()}
              className="flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[13px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                cursor: onViewSourceEvidence ? 'pointer' : 'default',
              }}
            >
              <FileText size={13} strokeWidth={2} />
              Open Source Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Plan vs Actual */}
      <SectionCard label="Plan vs Actual">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
        >
          {/* Planned */}
          <div>
            <p
              className="mb-3 text-[10px] font-bold uppercase"
              style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
            >
              Planned
            </p>
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Start</span>
                <p className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  {fmtDateLong(activity.plannedStart)}
                </p>
              </div>
              <div>
                <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Finish</span>
                <p className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  {fmtDateLong(activity.plannedFinish)}
                </p>
              </div>
              <div>
                <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Duration</span>
                <p className="text-[14px] font-medium" style={{ color: 'var(--c-text)' }}>6 days</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex flex-col gap-2">
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'var(--c-border)' }}
            />
            <div style={{ paddingLeft: 20 }}>
              <p
                className="mb-3 text-[10px] font-bold uppercase"
                style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
              >
                Actual
              </p>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Start</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                      {fmtDateLong(activity.actualStart)}
                    </p>
                    {activity.trust === 'verified' && (
                      <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#16A34A' }} />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Finish</span>
                  <p
                    className="mt-0.5 text-[14px]"
                    style={{
                      color: activity.actualFinish ? 'var(--c-text)' : 'var(--c-subtle)',
                      fontStyle: activity.actualFinish ? 'normal' : 'italic',
                    }}
                  >
                    {activity.actualFinish ? fmtDateLong(activity.actualFinish) : 'Not reported'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Current Status</span>
                  <p className="mt-0.5 text-[14px] font-medium" style={{ color: statusCfg.color }}>
                    {statusCfg.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Variance */}
          <div className="relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'var(--c-border)' }}
            />
            <div style={{ paddingLeft: 20 }}>
              <p
                className="mb-3 text-[10px] font-bold uppercase"
                style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
              >
                Variance
              </p>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Start</span>
                  {activity.startVarianceDays !== null ? (
                    <p
                      className="text-[15px] font-bold"
                      style={{
                        color: activity.startVarianceDays > 0 ? '#D97706' : '#16A34A',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {activity.startVarianceDays > 0
                        ? `+${activity.startVarianceDays} days late`
                        : activity.startVarianceDays === 0
                        ? 'On time'
                        : `${activity.startVarianceDays} days early`}
                    </p>
                  ) : (
                    <p className="text-[13px] italic" style={{ color: 'var(--c-subtle)' }}>
                      Cannot determine
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Finish</span>
                  <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-subtle)', fontStyle: 'italic' }}>
                    Finish variance unavailable until completion is reported.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Execution Timeline */}
      <SectionCard label="Execution Timeline">
        <ExecutionTimeline activity={activity} />
      </SectionCard>

      {/* Latest Field Context */}
      {activity.latestFieldContext && (
        <SectionCard label="Latest Field Context">
          <div>
            <p
              className="mb-4 text-[15px] italic leading-relaxed"
              style={{ color: 'var(--c-text)' }}
            >
              "{activity.latestFieldContext.text}"
            </p>
            <div
              className="flex items-center justify-between rounded-[10px] px-4 py-3"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  {activity.latestFieldContext.source}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  {activity.latestFieldContext.reportedDate} · {activity.latestFieldContext.reportedTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-semibold"
                  style={{ background: 'rgba(22,163,74,0.10)', color: '#16A34A' }}
                >
                  <CheckCircle2 size={10} strokeWidth={2.5} />
                  Verified
                </span>
                <button
                  onClick={() => onViewActual?.('ACT-2026-0842')}
                  className="text-[12px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: '#F46F29', cursor: 'pointer' }}
                >
                  View Evidence
                </button>
                {onViewActual && (
                  <button
                    onClick={() => onViewActual('ACT-2026-0842')}
                    className="text-[12px] font-medium transition-opacity hover:opacity-70"
                    style={{ color: '#F46F29', cursor: 'pointer' }}
                  >
                    View Actual
                  </button>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Two-column lower sections */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Linked Actuals */}
        {activity.linkedActuals && (
          <SectionCard label="Linked Actuals">
            <div className="flex flex-col gap-3">
              {activity.linkedActuals.map((actual) => (
                <div
                  key={actual.id}
                  onClick={() => onViewActual?.(actual.id)}
                  className="rounded-[10px] p-3.5"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', cursor: onViewActual ? 'pointer' : 'default' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[12px] font-bold"
                      style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                    >
                      {actual.id}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: '#16A34A' }}
                    >
                      <CheckCircle2 size={10} strokeWidth={2.5} />
                      Verified
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                      {actual.event} · {actual.date}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
                      Source: {actual.source}
                    </span>
                    {actual.reviewedBy && (
                      <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
                        Reviewed by: {actual.reviewedBy}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Data Trust */}
        {activity.dataTrust && (
          <SectionCard label="Data Trust">
            <div className="flex flex-col gap-0">
              <FieldRow label="Schedule Match">
                <span
                  className="flex items-center gap-1.5"
                  style={{ color: '#16A34A', fontWeight: 600 }}
                >
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  {activity.dataTrust.scheduleMatch}
                </span>
              </FieldRow>
              <FieldRow label="Match Confidence">
                <span style={{ color: 'var(--c-muted)', fontSize: 12 }}>
                  <span
                    style={{ color: '#D97706', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {activity.dataTrust.matchConfidence}%
                  </span>
                  {' '}— AI historical confidence
                </span>
              </FieldRow>
              <FieldRow label="Reviewed By">
                {activity.dataTrust.reviewedBy}
              </FieldRow>
              <FieldRow label="Review Date">
                {activity.dataTrust.reviewDate}
              </FieldRow>
              <FieldRow label="Source Evidence">
                <span style={{ color: '#16A34A' }}>{activity.dataTrust.sourceEvidence}</span>
              </FieldRow>
            </div>
          </SectionCard>
        )}
      </div>

      {/* Match History */}
      {activity.matchHistory && (
        <SectionCard label="Match History">
          <div className="flex flex-col gap-3">
            {activity.matchHistory.map((evt, i) => (
              <div key={i} className="flex items-start gap-4">
                <span
                  className="shrink-0 text-[11px]"
                  style={{
                    color: 'var(--c-subtle)',
                    fontFamily: 'var(--font-data)',
                    width: 110,
                    paddingTop: 1,
                  }}
                >
                  {evt.timestamp}
                </span>
                <div>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                    {evt.event}
                  </span>
                  {evt.detail && (
                    <span
                      className="ml-2 text-[12px]"
                      style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
                    >
                      {evt.detail}
                    </span>
                  )}
                  {evt.by && (
                    <span className="ml-2 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                      · {evt.by}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Schedule Update */}
      {activity.scheduleUpdate && (
        <SectionCard label="Schedule Update">
          <div>
            <p
              className="mb-3 text-[11px] font-semibold"
              style={{ color: 'var(--c-subtle)', letterSpacing: '0.02em' }}
            >
              SENTINEL Schedule Mirror
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
                {activity.scheduleUpdate.field}
              </span>
              <span className="text-[13px]" style={{ color: 'var(--c-subtle)' }}>
                {activity.scheduleUpdate.oldValue}
              </span>
              <span style={{ color: 'var(--c-subtle)' }}>→</span>
              <span className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>
                {activity.scheduleUpdate.newValue}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <span
                className="rounded-[6px] px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: 'rgba(22,163,74,0.10)', color: '#16A34A' }}
              >
                {activity.scheduleUpdate.status}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
                Updated: {activity.scheduleUpdate.updatedDate} · {activity.scheduleUpdate.updatedTime}
              </span>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Audit Preview */}
      {activity.auditEvents && (
        <SectionCard label="Recent Activity">
          <div className="flex flex-col gap-3">
            {activity.auditEvents.map((evt, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4"
                style={{
                  paddingBottom: i < activity.auditEvents!.length - 1 ? 12 : 0,
                  borderBottom:
                    i < activity.auditEvents!.length - 1
                      ? '1px solid var(--c-border)'
                      : 'none',
                }}
              >
                <div>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                    {evt.event}
                  </span>
                  {evt.by && (
                    <span className="ml-1.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                      · {evt.by}
                    </span>
                  )}
                  {evt.detail && (
                    <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                      {evt.detail}
                    </p>
                  )}
                </div>
                <span
                  className="shrink-0 text-[11px]"
                  style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
                >
                  {evt.timestamp}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onViewAuditLog?.()}
            className="mt-4 text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            View Full Audit Log →
          </button>
        </SectionCard>
      )}
    </div>
  )
}

function ExecutionTimeline({ activity }: { activity: ReturnType<typeof findActivity> & {} }) {
  const events = [
    {
      date: '24 Aug',
      label: 'Planned Start',
      type: 'planned' as const,
      position: 'top' as const,
    },
    {
      date: '26 Aug',
      label: 'Actual Start',
      sublabel: 'Verified',
      type: 'verified' as const,
      position: 'bottom' as const,
    },
    {
      date: '28 Aug',
      label: 'Latest Field Update',
      sublabel: 'Final bolt tightening pending',
      type: 'field' as const,
      position: 'top' as const,
    },
    {
      date: '30 Aug',
      label: 'Planned Finish',
      type: 'planned' as const,
      position: 'bottom' as const,
    },
  ]

  const dotColors = {
    planned: 'var(--c-border-strong)',
    verified: '#F46F29',
    field: '#7C3AED',
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 520, padding: '16px 8px' }}>
        {/* Top labels */}
        <div className="flex mb-2" style={{ paddingLeft: 0 }}>
          {events.map((evt, i) => (
            <div
              key={i}
              className="flex-1 text-center"
              style={{ visibility: evt.position === 'top' ? 'visible' : 'hidden' }}
            >
              <span
                className="block text-[12px] font-semibold"
                style={{ color: 'var(--c-text)' }}
              >
                {evt.label}
              </span>
              {evt.sublabel && (
                <span className="block text-[10px]" style={{ color: 'var(--c-subtle)' }}>
                  {evt.sublabel}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Timeline line + dots */}
        <div className="relative flex items-center" style={{ height: 32 }}>
          {/* Connecting line */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: 'var(--c-border)',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Orange segment: Planned Start to Actual Start */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '12.5%',
              width: '25%',
              height: 2,
              background: 'var(--c-border-strong)',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Verified orange segment: Actual Start to Latest Update */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '37.5%',
              width: '25%',
              height: 2,
              background: '#F46F29',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Dots */}
          {events.map((evt, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{ left: `${12.5 + i * 25}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="rounded-full"
                style={{
                  width: evt.type === 'verified' ? 14 : 10,
                  height: evt.type === 'verified' ? 14 : 10,
                  background: dotColors[evt.type],
                  border: evt.type === 'planned' ? '2px solid var(--c-border-strong)' : 'none',
                  boxShadow: evt.type === 'verified' ? '0 0 0 3px rgba(244,111,41,0.20)' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Date labels */}
        <div className="flex mt-1">
          {events.map((evt, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className="text-[11px]"
                style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
              >
                {evt.date}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom labels */}
        <div className="flex mt-1">
          {events.map((evt, i) => (
            <div
              key={i}
              className="flex-1 text-center"
              style={{ visibility: evt.position === 'bottom' ? 'visible' : 'hidden' }}
            >
              <span
                className="block text-[12px] font-semibold"
                style={{ color: 'var(--c-text)' }}
              >
                {evt.label}
              </span>
              {evt.sublabel && (
                <span className="block text-[10px]" style={{ color: '#16A34A' }}>
                  {evt.sublabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
