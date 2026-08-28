import { useState } from 'react'
import {
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
  MessageCircle,
  FileText,
  ExternalLink,
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import ChooseActivityModal from '../../components/review/ChooseActivityModal'
import {
  EXCEPTIONS,
  EXCEPTION_TYPE_CONFIG,
  WORKFLOW_STATUS_CONFIG,
  type ExceptionType,
  type WorkflowStatus,
} from '../../data/actualsData'

// ── Badge helpers ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ExceptionType }) {
  const cfg = EXCEPTION_TYPE_CONFIG[type]
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

function WorkflowBadge({ status }: { status: WorkflowStatus }) {
  const cfg = WORKFLOW_STATUS_CONFIG[status]
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

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      className="mb-3 text-[11px] font-bold uppercase"
      style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}
    >
      {label}
    </div>
  )
}

// ── Evidence card ─────────────────────────────────────────────────────────────

function EvidenceCard({
  sourceLabel,
  quote,
  date,
  source,
  accent,
}: {
  sourceLabel: string
  quote: string
  date: string
  source: string
  accent?: string
}) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[12px] p-4"
      style={{
        background: 'var(--c-page)',
        border: `1px solid ${accent ?? 'var(--c-border)'}`,
      }}
    >
      <div
        className="mb-2 text-[10px] font-bold uppercase"
        style={{ color: accent ?? 'var(--c-subtle)', letterSpacing: '0.08em' }}
      >
        {sourceLabel}
      </div>
      <p
        className="mb-3 text-[13px] leading-[20px]"
        style={{ color: 'var(--c-text)', fontStyle: 'italic' }}
      >
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em' }}>
            Reported
          </div>
          <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>
            {date}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em' }}>
            Source
          </div>
          <div className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
            {source}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionBtn({
  children,
  onClick,
  variant = 'default',
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  disabled?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--c-card)',
      border: '1px solid var(--c-border)',
      color: 'var(--c-text)',
    },
    primary: {
      background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
      border: '1px solid transparent',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
    },
    danger: {
      background: 'rgba(220,38,38,0.07)',
      border: '1px solid rgba(220,38,38,0.25)',
      color: '#DC2626',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid var(--c-border)',
      color: 'var(--c-muted)',
    },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

// ── Confirmation modal wrapper ────────────────────────────────────────────────

function ConfirmModal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel,
  confirmDanger,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onConfirm: () => void
  confirmLabel: string
  confirmDanger?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} aria-label={title} zIndex={70}>
      <div
        style={{
          width: 440,
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 16,
          boxShadow: 'var(--c-shadow-elevated)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: '18px 20px', borderBottom: '1px solid var(--c-border)' }}
        >
          <h3 className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[7px]"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-border)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
        <div
          className="flex items-center justify-end gap-3"
          style={{ padding: '14px 20px', borderTop: '1px solid var(--c-border)' }}
        >
          <button
            onClick={onClose}
            className="rounded-[9px] px-4 py-2 text-[13px] font-medium"
            style={{
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-muted)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{
              background: confirmDanger
                ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                : 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: confirmDanger
                ? '0 2px 8px rgba(220,38,38,0.25)'
                : '0 2px 8px rgba(244,111,41,0.25)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Resolved banner ───────────────────────────────────────────────────────────

function ResolvedBanner({
  decision,
  resolvedBy,
  resolvedDate,
  preservedNote,
}: {
  decision: string
  resolvedBy: string
  resolvedDate: string
  preservedNote?: string
}) {
  return (
    <div
      className="rounded-[12px] p-4"
      style={{
        background: 'rgba(22,163,74,0.07)',
        border: '1px solid rgba(22,163,74,0.22)',
      }}
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 size={18} strokeWidth={1.5} style={{ color: '#16A34A', marginTop: 1, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>
            Exception Resolved
          </div>
          <div className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            {decision}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
              By: <span style={{ color: 'var(--c-text)' }}>{resolvedBy}</span>
            </span>
            <span
              className="text-[11px]"
              style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
            >
              {resolvedDate}
            </span>
          </div>
          {preservedNote && (
            <div className="mt-2 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
              {preservedNote}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CONFLICT exception layout ─────────────────────────────────────────────────

function ConflictDetail({ onViewActual, onViewScheduleActivity }: { onViewActual?: () => void; onViewScheduleActivity?: () => void }) {
  const [confirmDate, setConfirmDate] = useState<'26 Aug 2026' | '27 Aug 2026' | null>(null)
  const [clarificationOpen, setClarificationOpen] = useState(false)
  const [clarificationSent, setClarificationSent] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [resolvedDate, setResolvedDate] = useState('')

  function handleResolve() {
    if (!confirmDate) return
    setResolvedDate(confirmDate)
    setResolved(true)
    setConfirmDate(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* WHAT HAPPENED */}
      <div>
        <SectionLabel label="What Happened" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <EvidenceCard
            sourceLabel="Source 1 · Supervisor Update"
            quote="Pump P-204 alignment started this morning."
            date="26 Aug 2026"
            source="Supervisor Update"
            accent="rgba(220,38,38,0.30)"
          />
          <EvidenceCard
            sourceLabel="Source 2 · Daily Progress Report"
            quote="Alignment of Pump P-204 commenced today."
            date="27 Aug 2026"
            source="Daily Progress Report"
            accent="rgba(220,38,38,0.30)"
          />
        </div>
      </div>

      {/* WHY THIS IS A PROBLEM */}
      <div>
        <SectionLabel label="Why This Is a Problem" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <p className="mb-3 text-[13px] leading-[20px]" style={{ color: 'var(--c-text)' }}>
            Two trusted field sources report different Actual Start dates for the same activity.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Conflicting Value A
              </div>
              <div
                className="text-[13px] font-bold"
                style={{ color: '#DC2626', fontFamily: 'var(--font-data)' }}
              >
                26 Aug 2026
              </div>
            </div>
            <div className="text-[16px]" style={{ color: 'var(--c-border-strong)' }}>vs</div>
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Conflicting Value B
              </div>
              <div
                className="text-[13px] font-bold"
                style={{ color: '#DC2626', fontFamily: 'var(--font-data)' }}
              >
                27 Aug 2026
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 rounded-[8px] px-3 py-2"
            style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)' }}
          >
            <AlertTriangle size={13} strokeWidth={2} style={{ color: '#DC2626', flexShrink: 0 }} />
            <span className="text-[12px] font-medium" style={{ color: '#DC2626' }}>
              Schedule update blocked until conflict is resolved.
            </span>
          </div>
          <p className="mt-2 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
            SENTINEL will not update the official Actual Start until the conflict is resolved.
          </p>
        </div>
      </div>

      {/* WHAT CAN I DO */}
      {!resolved ? (
        <div>
          <SectionLabel label="What Can I Do?" />
          <div
            className="rounded-[12px] p-4"
            style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
          >
            <p className="mb-4 text-[12px]" style={{ color: 'var(--c-muted)' }}>
              Select the correct Actual Start date. Human decision is required — SENTINEL does not
              automatically recommend one source as fact.
            </p>
            <div className="flex flex-wrap gap-3">
              <ActionBtn onClick={() => setConfirmDate('26 Aug 2026')}>
                Use 26 Aug
              </ActionBtn>
              <ActionBtn onClick={() => setConfirmDate('27 Aug 2026')}>
                Use 27 Aug
              </ActionBtn>
              <ActionBtn variant="ghost" onClick={() => setClarificationOpen(true)}>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={13} strokeWidth={2} aria-hidden="true" />
                  Request Clarification
                </span>
              </ActionBtn>
              <ActionBtn variant="ghost">Keep Conflict Open</ActionBtn>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision={`Actual Start set to ${resolvedDate}`}
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:02"
            preservedNote="Both source records preserved in evidence history."
          />
          <div
            className="mt-3 rounded-[10px] p-4"
            style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Resolved Actual Start
                </div>
                <div
                  className="text-[13px] font-bold"
                  style={{ color: '#16A34A', fontFamily: 'var(--font-data)' }}
                >
                  {resolvedDate}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Status
                </div>
                <div className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>
                  Verified
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Exception
                </div>
                <div className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
                  Resolved
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Decision By
                </div>
                <div className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                  Arjun Mehta
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
              Schedule Actual Start may now be updated.
            </p>
          </div>
        </div>
      )}

      {/* Cross-links */}
      {onViewActual && (
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onViewActual}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity duration-150 hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
            View Actual
          </button>
          {onViewScheduleActivity && (
            <button
              onClick={onViewScheduleActivity}
              className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity duration-150 hover:opacity-70"
              style={{ color: '#F46F29', cursor: 'pointer' }}
            >
              <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
              View Schedule Activity
            </button>
          )}
        </div>
      )}

      {/* Conflict confirmation modal */}
      <ConfirmModal
        open={!!confirmDate}
        onClose={() => setConfirmDate(null)}
        title="Resolve Actual Start Conflict?"
        onConfirm={handleResolve}
        confirmLabel="Resolve Conflict"
      >
        <div className="flex flex-col gap-4">
          <div
            className="rounded-[10px] p-3"
            style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                Selected Actual Start
              </span>
              <span
                className="text-[13px] font-bold"
                style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
              >
                {confirmDate}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              Preserved Evidence
            </div>
            <ul className="text-[12px] space-y-1" style={{ color: 'var(--c-text)' }}>
              <li>· 26 Aug 2026 source (Supervisor Update)</li>
              <li>· 27 Aug 2026 source (Daily Progress Report)</li>
            </ul>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
            Both source records will remain in the evidence history. Neither will be deleted.
          </p>
        </div>
      </ConfirmModal>

      {/* Clarification modal */}
      <Modal open={clarificationOpen} onClose={() => setClarificationOpen(false)} aria-label="Request Clarification" zIndex={70}>
        <div
          style={{
            width: 420,
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 16,
            boxShadow: 'var(--c-shadow-elevated)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: '18px 20px', borderBottom: '1px solid var(--c-border)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-[7px]"
                style={{ background: 'var(--c-brand-tint)' }}
              >
                <MessageCircle size={14} strokeWidth={2} style={{ color: '#F46F29' }} />
              </div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
                Request Clarification
              </h3>
            </div>
            <button
              onClick={() => setClarificationOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-[7px]"
              style={{ color: 'var(--c-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-border)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
          <div style={{ padding: '18px 20px' }}>
            {!clarificationSent ? (
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-[9px] px-3 py-2"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                >
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Re: </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                  >
                    EQUIPMENT ALIGNMENT — P-204
                  </span>
                </div>
                <div>
                  <label
                    className="mb-2 block text-[12px] font-semibold"
                    style={{ color: 'var(--c-muted)' }}
                  >
                    Question
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Which date is correct for the P-204 alignment Actual Start — 26 Aug or 27 Aug?"
                    className="w-full resize-none rounded-[10px] p-3 text-[13px]"
                    style={{
                      background: 'var(--c-page)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-text)',
                      outline: 'none',
                      fontFamily: 'var(--font-ui)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
                  />
                </div>
                <div>
                  <div className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Recipient
                  </div>
                  <div
                    className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5"
                    style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: '#7C3AED' }}
                    >
                      OR
                    </div>
                    <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                      Original Reporter
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setClarificationOpen(false)}
                    className="flex-1 rounded-[10px] py-2.5 text-[13px] font-medium"
                    style={{
                      background: 'var(--c-page)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setClarificationSent(true)}
                    className="flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                      boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'rgba(22,163,74,0.10)' }}
                >
                  <CheckCircle2 size={24} strokeWidth={1.5} style={{ color: '#16A34A' }} />
                </div>
                <div>
                  <p className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
                    Request sent
                  </p>
                  <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                    The original reporter will be notified.
                  </p>
                </div>
                <div
                  className="flex w-full items-center justify-between rounded-[10px] px-4 py-3"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                >
                  <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                    New status
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: 'rgba(124,58,237,0.10)', color: '#7C3AED' }}
                  >
                    Awaiting Clarification
                  </span>
                </div>
                <button
                  onClick={() => {
                    setClarificationSent(false)
                    setClarificationOpen(false)
                  }}
                  className="w-full rounded-[10px] py-2.5 text-[13px] font-semibold"
                  style={{
                    background: 'var(--c-page)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-text)',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── INCOMPLETE exception layout ───────────────────────────────────────────────

function IncompleteDetail({ exceptionId, onViewActual, onViewScheduleActivity }: { exceptionId: string; onViewActual?: () => void; onViewScheduleActivity?: () => void }) {
  const exc = EXCEPTIONS.find((e) => e.id === exceptionId)!
  const isWelding = exceptionId === 'EXC-002'
  const alreadyAwaiting = exc.workflowStatus === 'awaiting-clarification'

  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(exc.workflowStatus)
  const [clarificationOpen, setClarificationOpen] = useState(false)
  const [clarificationSent, setClarificationSent] = useState(alreadyAwaiting)
  const [addContextOpen, setAddContextOpen] = useState(false)
  const [contextArea, setContextArea] = useState('')
  const [contextLine, setContextLine] = useState('')
  const [contextComment, setContextComment] = useState('')
  const [plannerContext, setPlannerContext] = useState<{ area: string; line: string; comment: string; by: string; when: string } | null>(null)
  const [kept, setKept] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* WHAT HAPPENED */}
      <div>
        <SectionLabel label="What Happened" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <p
            className="mb-4 text-[13px] leading-[20px]"
            style={{ color: 'var(--c-text)', fontStyle: 'italic' }}
          >
            {isWelding
              ? '"Welding work started. Location confirmation pending."'
              : '"Cable tray installation update received. Start date not recorded."'}
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Activity
              </div>
              <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                {isWelding ? 'Welding' : 'Cable tray installation'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Event
              </div>
              <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                Actual Start
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Area
              </div>
              <div className="text-[13px] italic" style={{ color: 'var(--c-subtle)' }}>
                Not reported
              </div>
            </div>
            {isWelding && (
              <div>
                <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Specific Line
                </div>
                <div className="text-[13px] italic" style={{ color: 'var(--c-subtle)' }}>
                  Not reported
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WHY THIS IS A PROBLEM */}
      <div>
        <SectionLabel label="Why This Is a Problem" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <p className="text-[13px]" style={{ color: 'var(--c-text)' }}>
            There is insufficient context to safely identify the related{' '}
            {isWelding ? 'L5/L6' : 'schedule'} activity.
          </p>
          <p className="mt-2 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            {isWelding
              ? 'Without a known project area or line reference, multiple schedule activities could be affected. A guess would compromise schedule truth.'
              : 'The Actual Start date was not captured. The execution event exists but cannot update the schedule without this information.'}
          </p>
        </div>
      </div>

      {/* Planner-added context (if any) */}
      {plannerContext && (
        <div>
          <SectionLabel label="Planner-Added Context" />
          <div
            className="rounded-[12px] p-4"
            style={{
              background: 'rgba(244,111,41,0.05)',
              border: '1px solid rgba(244,111,41,0.20)',
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase" style={{ color: '#F46F29', letterSpacing: '0.08em' }}>
                Planner-added context
              </span>
              <span className="text-[10px]" style={{ color: 'var(--c-subtle)' }}>
                · {plannerContext.by} · {plannerContext.when}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {plannerContext.area && (
                <div>
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Area</div>
                  <div className="text-[13px]" style={{ color: 'var(--c-text)' }}>{plannerContext.area}</div>
                </div>
              )}
              {plannerContext.line && (
                <div>
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Line Reference</div>
                  <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>{plannerContext.line}</div>
                </div>
              )}
              {plannerContext.comment && (
                <div className="col-span-2">
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Comment</div>
                  <div className="text-[12px]" style={{ color: 'var(--c-muted)' }}>{plannerContext.comment}</div>
                </div>
              )}
            </div>
            <button
              className="mt-3 text-[12px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#F46F29' }}
            >
              Re-run Match →
            </button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      {!kept && (
        <div>
          <SectionLabel label="What Can I Do?" />
          <div className="flex flex-col gap-3 rounded-[12px] p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            {workflowStatus === 'awaiting-clarification' ? (
              <div
                className="rounded-[10px] p-3"
                style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.20)' }}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={13} strokeWidth={2} style={{ color: '#7C3AED' }} />
                  <span className="text-[12px] font-semibold" style={{ color: '#7C3AED' }}>
                    Clarification request sent — awaiting response.
                  </span>
                </div>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
                  The original reporter has been notified. The Actual remains stored.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setClarificationOpen(true)}
                className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-all hover:opacity-85 text-left"
                style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
              >
                <MessageCircle size={14} strokeWidth={2} style={{ color: '#F46F29' }} />
                Request Clarification
              </button>
            )}
            <button
              onClick={() => setAddContextOpen(true)}
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-all hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              Add Context
            </button>
            <button
              onClick={() => setKept(true)}
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-all hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
            >
              Keep Incomplete
            </button>
          </div>
        </div>
      )}

      {kept && (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision="Kept as Incomplete — no schedule update applied."
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:15"
            preservedNote="Actual remains searchable in Actuals."
          />
        </div>
      )}

      {onViewActual && (
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onViewActual}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
            View Actual
          </button>
          {onViewScheduleActivity && (
            <button
              onClick={onViewScheduleActivity}
              className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: '#F46F29', cursor: 'pointer' }}
            >
              <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
              View Schedule Activity
            </button>
          )}
        </div>
      )}

      {/* Clarification modal */}
      <Modal open={clarificationOpen} onClose={() => setClarificationOpen(false)} aria-label="Request Clarification" zIndex={70}>
        <div
          style={{
            width: 420,
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 16,
            boxShadow: 'var(--c-shadow-elevated)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: '18px 20px', borderBottom: '1px solid var(--c-border)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-[7px]"
                style={{ background: 'var(--c-brand-tint)' }}
              >
                <MessageCircle size={14} strokeWidth={2} style={{ color: '#F46F29' }} />
              </div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
                Request Clarification
              </h3>
            </div>
            <button
              onClick={() => setClarificationOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-[7px]"
              style={{ color: 'var(--c-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-border)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
          <div style={{ padding: '18px 20px' }}>
            {!clarificationSent ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Question
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={
                      isWelding
                        ? 'Which project area and line does this welding activity refer to?'
                        : 'What is the Actual Start date for this cable tray installation?'
                    }
                    className="w-full resize-none rounded-[10px] p-3 text-[13px]"
                    style={{
                      background: 'var(--c-page)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-text)',
                      outline: 'none',
                      fontFamily: 'var(--font-ui)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
                  />
                </div>
                <div>
                  <div className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Recipient
                  </div>
                  <div
                    className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5"
                    style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                  >
                    <div
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: '#7C3AED' }}
                    >
                      OR
                    </div>
                    <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                      Original Reporter
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setClarificationOpen(false)}
                    className="flex-1 rounded-[10px] py-2.5 text-[13px] font-medium"
                    style={{
                      background: 'var(--c-page)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setClarificationSent(true)
                      setWorkflowStatus('awaiting-clarification')
                    }}
                    className="flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                      boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'rgba(22,163,74,0.10)' }}
                >
                  <CheckCircle2 size={24} strokeWidth={1.5} style={{ color: '#16A34A' }} />
                </div>
                <div>
                  <p className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
                    Request sent
                  </p>
                  <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                    Status updated to Awaiting Clarification.
                  </p>
                </div>
                <button
                  onClick={() => { setClarificationSent(false); setClarificationOpen(false) }}
                  className="w-full rounded-[10px] py-2.5 text-[13px] font-semibold"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Add Context modal */}
      <Modal open={addContextOpen} onClose={() => setAddContextOpen(false)} aria-label="Add Context" zIndex={70}>
        <div
          style={{
            width: 440,
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 16,
            boxShadow: 'var(--c-shadow-elevated)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: '18px 20px', borderBottom: '1px solid var(--c-border)' }}
          >
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>
              Add Context
            </h3>
            <button
              onClick={() => setAddContextOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-[7px]"
              style={{ color: 'var(--c-muted)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-border)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
          <div style={{ padding: '18px 20px' }} className="flex flex-col gap-4">
            <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
              Authorized planners may add known context. Added context is distinguished from original
              field evidence and attributed to you.
            </p>
            <div>
              <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                Area
              </label>
              <input
                type="text"
                placeholder="e.g. Area B"
                value={contextArea}
                onChange={(e) => setContextArea(e.target.value)}
                className="w-full rounded-[10px] px-3 py-2.5 text-[13px]"
                style={{
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                Line Reference
              </label>
              <input
                type="text"
                placeholder="e.g. 24-XX"
                value={contextLine}
                onChange={(e) => setContextLine(e.target.value)}
                className="w-full rounded-[10px] px-3 py-2.5 text-[13px]"
                style={{
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                Optional Comment
              </label>
              <textarea
                rows={2}
                value={contextComment}
                onChange={(e) => setContextComment(e.target.value)}
                className="w-full resize-none rounded-[10px] p-3 text-[13px]"
                style={{
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAddContextOpen(false)}
                className="flex-1 rounded-[10px] py-2.5 text-[13px] font-medium"
                style={{
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-muted)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPlannerContext({
                    area: contextArea,
                    line: contextLine,
                    comment: contextComment,
                    by: 'Arjun Mehta',
                    when: '28 Aug 2026 · 11:20',
                  })
                  setAddContextOpen(false)
                }}
                disabled={!contextArea && !contextLine}
                className="flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                  boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
                }}
              >
                Save Context
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── UNMATCHED exception layout ────────────────────────────────────────────────

function UnmatchedDetail({ onViewActual, onViewScheduleActivity }: { onViewActual?: () => void; onViewScheduleActivity?: () => void }) {
  const [chooseActivityOpen, setChooseActivityOpen] = useState(false)
  const [keepConfirmOpen, setKeepConfirmOpen] = useState(false)
  const [flagConfirmOpen, setFlagConfirmOpen] = useState(false)
  const [keepComment, setKeepComment] = useState('')
  const [flagComment, setFlagComment] = useState('')
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('open')
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; label: string } | null>(null)

  const isResolved =
    workflowStatus === 'kept-unmatched' ||
    workflowStatus === 'flagged-schedule-review' ||
    !!selectedActivity

  return (
    <div className="flex flex-col gap-6">
      {/* WHAT HAPPENED */}
      <div>
        <SectionLabel label="What Happened" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Actual</div>
              <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>Material shifting</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Area</div>
              <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>Area B</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Current Relationship</div>
              <div className="text-[13px] italic" style={{ color: 'var(--c-subtle)' }}>Unmatched</div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate */}
      <div>
        <SectionLabel label="Closest Schedule Candidate" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-[13px] font-bold"
                style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
              >
                MATERIAL HANDLING — AREA B
              </div>
              <div className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                Civil · Area B
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Historical AI Confidence
              </div>
              <div
                className="text-[15px] font-bold"
                style={{ color: '#B45309', fontFamily: 'var(--font-data)' }}
              >
                58%
              </div>
            </div>
          </div>
          <div
            className="mt-3 rounded-[8px] px-3 py-2 text-[12px]"
            style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.20)', color: '#B45309' }}
          >
            Below safe matching threshold — not automatically linked.
          </div>
        </div>
      </div>

      {/* WHY UNMATCHED */}
      <div>
        <SectionLabel label="Why Unmatched" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <p className="mb-3 text-[13px]" style={{ color: 'var(--c-text)' }}>
            No candidate reached the project's safe matching threshold.
          </p>
          <div className="text-[12px] space-y-1.5" style={{ color: 'var(--c-muted)' }}>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--c-border-strong)' }}>·</span>
              Broad activity terminology ("material shifting")
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--c-border-strong)' }}>·</span>
              No specific equipment or line reference
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--c-border-strong)' }}>·</span>
              Multiple possible schedule activities in Area B
            </div>
          </div>
          <p className="mt-3 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
            A relationship is not forced. The Actual remains a valid execution record.
          </p>
        </div>
      </div>

      {/* Resolved state */}
      {selectedActivity && (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision={`Manually linked to ${selectedActivity.label}`}
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:30"
            preservedNote={`Original AI recommendation (MATERIAL HANDLING — AREA B · 58%) preserved in history.`}
          />
        </div>
      )}
      {workflowStatus === 'kept-unmatched' && (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision="Kept Unmatched — execution event will not update the schedule."
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:30"
            preservedNote="Actual remains searchable in Actuals."
          />
        </div>
      )}
      {workflowStatus === 'flagged-schedule-review' && (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision="Flagged for Schedule Review — possible planning or schedule-structure gap."
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:30"
          />
        </div>
      )}

      {/* ACTIONS */}
      {!isResolved && (
        <div>
          <SectionLabel label="What Can I Do?" />
          <div className="flex flex-col gap-3 rounded-[12px] p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <button
              onClick={() => setChooseActivityOpen(true)}
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              Choose Schedule Activity
            </button>
            <button
              onClick={() => setKeepConfirmOpen(true)}
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              Keep Unmatched
            </button>
            <button
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              <MessageCircle size={14} strokeWidth={2} style={{ color: '#F46F29' }} />
              Request Clarification
            </button>
            <button
              onClick={() => setFlagConfirmOpen(true)}
              className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold hover:opacity-85 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
            >
              Flag for Schedule Review
            </button>
          </div>
        </div>
      )}

      {onViewActual && (
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onViewActual}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
            View Actual
          </button>
        </div>
      )}

      {/* Choose Activity Modal */}
      <ChooseActivityModal
        open={chooseActivityOpen}
        onClose={() => setChooseActivityOpen(false)}
        onSelect={(act) => {
          setSelectedActivity({ id: act.id, label: act.label })
          setChooseActivityOpen(false)
        }}
      />

      {/* Keep Unmatched confirmation */}
      <ConfirmModal
        open={keepConfirmOpen}
        onClose={() => setKeepConfirmOpen(false)}
        title="Keep this Actual unmatched?"
        onConfirm={() => {
          setWorkflowStatus('kept-unmatched')
          setKeepConfirmOpen(false)
        }}
        confirmLabel="Keep Unmatched"
      >
        <div className="flex flex-col gap-3">
          <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            The execution event will remain in SENTINEL but will not update the project schedule.
          </p>
          <div>
            <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              Optional Comment
            </label>
            <textarea
              rows={2}
              value={keepComment}
              onChange={(e) => setKeepComment(e.target.value)}
              placeholder="Reason for keeping unmatched..."
              className="w-full resize-none rounded-[10px] p-3 text-[13px]"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
            />
          </div>
        </div>
      </ConfirmModal>

      {/* Flag for Schedule Review confirmation */}
      <ConfirmModal
        open={flagConfirmOpen}
        onClose={() => setFlagConfirmOpen(false)}
        title="Flag for Schedule Review"
        onConfirm={() => {
          setWorkflowStatus('flagged-schedule-review')
          setFlagConfirmOpen(false)
        }}
        confirmLabel="Flag for Review"
      >
        <div className="flex flex-col gap-3">
          <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            This execution record may indicate a planning or schedule-structure gap. No new schedule
            activity will be created automatically.
          </p>
          <div>
            <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              Optional Comment
            </label>
            <textarea
              rows={2}
              value={flagComment}
              onChange={(e) => setFlagComment(e.target.value)}
              placeholder="Additional context..."
              className="w-full resize-none rounded-[10px] p-3 text-[13px]"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
            />
          </div>
        </div>
      </ConfirmModal>
    </div>
  )
}

// ── DUPLICATE exception layout ────────────────────────────────────────────────

function DuplicateDetail({ onViewActual, onViewScheduleActivity }: { onViewActual?: () => void; onViewScheduleActivity?: () => void }) {
  const [mergeConfirmOpen, setMergeConfirmOpen] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [resolution, setResolution] = useState<'merged' | 'not-duplicate' | 'separate' | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* WHAT HAPPENED */}
      <div>
        <SectionLabel label="What Happened" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <EvidenceCard
            sourceLabel="Actual A · ACT-2026-0851"
            quote="Pump P-204 alignment started this morning."
            date="26 Aug 2026"
            source="Supervisor Update"
          />
          <EvidenceCard
            sourceLabel="Actual B · ACT-2026-0858"
            quote="Alignment of Pump P-204 commenced today."
            date="27 Aug 2026"
            source="Daily Progress Report"
          />
        </div>
      </div>

      {/* Matching signals */}
      <div>
        <SectionLabel label="Matching Signals" />
        <div
          className="rounded-[12px] p-4"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Equipment', match: true },
              { label: 'Activity', match: true },
              { label: 'Time proximity', match: true },
              { label: 'Area', match: true },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-[8px] px-3 py-2"
                style={{
                  background: s.match ? 'rgba(244,111,41,0.06)' : 'var(--c-card)',
                  border: s.match ? '1px solid rgba(244,111,41,0.20)' : '1px solid var(--c-border)',
                }}
              >
                <CheckCircle2 size={12} strokeWidth={2} style={{ color: s.match ? '#F46F29' : 'var(--c-subtle)' }} />
                <span className="text-[12px] font-medium" style={{ color: 'var(--c-text)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: 'var(--c-subtle)' }}>
            SENTINEL detected multiple records describing the same field event. Human review is
            required before any merge.
          </p>
        </div>
      </div>

      {/* RESOLUTION */}
      {!resolved ? (
        <div>
          <SectionLabel label="What Can I Do?" />
          <div
            className="rounded-[12px] p-4"
            style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}
          >
            <p className="mb-4 text-[12px]" style={{ color: 'var(--c-muted)' }}>
              Merging preserves both source evidence records under a single canonical Actual Event.
              No source is deleted.
            </p>
            <div className="flex flex-wrap gap-3">
              <ActionBtn variant="primary" onClick={() => setMergeConfirmOpen(true)}>
                Merge Evidence
              </ActionBtn>
              <ActionBtn
                onClick={() => {
                  setResolution('not-duplicate')
                  setResolved(true)
                }}
              >
                Not a Duplicate
              </ActionBtn>
              <ActionBtn
                variant="ghost"
                onClick={() => {
                  setResolution('separate')
                  setResolved(true)
                }}
              >
                Keep Separate
              </ActionBtn>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <SectionLabel label="Resolution" />
          <ResolvedBanner
            decision={
              resolution === 'merged'
                ? 'Evidence merged — 2 source records preserved under canonical Actual.'
                : resolution === 'not-duplicate'
                ? 'Confirmed not a duplicate — records kept separate.'
                : 'Kept separate — both records remain independent Actuals.'
            }
            resolvedBy="Arjun Mehta"
            resolvedDate="28 Aug 2026 · 11:45"
            preservedNote={
              resolution === 'merged'
                ? 'ACT-2026-0851 is canonical · ACT-2026-0858 evidence preserved.'
                : undefined
            }
          />
          {resolution === 'merged' && (
            <div
              className="mt-3 rounded-[10px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-[12px]">
                <div>
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Canonical Actual</div>
                  <div style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>ACT-2026-0851</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Evidence Records</div>
                  <div style={{ color: 'var(--c-text)' }}>2 sources</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase mb-0.5" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Exception</div>
                  <div style={{ color: '#16A34A' }}>Resolved</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {onViewActual && (
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onViewActual}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
            View Actual
          </button>
          {onViewScheduleActivity && (
            <button
              onClick={onViewScheduleActivity}
              className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: '#F46F29', cursor: 'pointer' }}
            >
              <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
              View Schedule Activity
            </button>
          )}
        </div>
      )}

      {/* Merge confirmation */}
      <ConfirmModal
        open={mergeConfirmOpen}
        onClose={() => setMergeConfirmOpen(false)}
        title="Merge duplicate execution records?"
        onConfirm={() => {
          setResolution('merged')
          setResolved(true)
          setMergeConfirmOpen(false)
        }}
        confirmLabel="Merge Evidence"
      >
        <div className="flex flex-col gap-3">
          <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            Both source records will be preserved as evidence under a single canonical Actual Event.
            Neither source will be deleted.
          </p>
          <div
            className="rounded-[10px] p-3"
            style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
          >
            <div className="text-[12px] space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={11} style={{ color: '#16A34A' }} />
                <span style={{ color: 'var(--c-text)' }}>
                  ACT-2026-0851 becomes canonical Actual
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={11} style={{ color: '#16A34A' }} />
                <span style={{ color: 'var(--c-text)' }}>
                  Both original source records attached as evidence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={11} style={{ color: '#16A34A' }} />
                <span style={{ color: 'var(--c-text)' }}>Duplicate exception resolved</span>
              </div>
            </div>
          </div>
        </div>
      </ConfirmModal>
    </div>
  )
}

// ── Main ExceptionDetail component ────────────────────────────────────────────

interface Props {
  exceptionId: string
  onBack: () => void
  onViewActual?: (actualId: string) => void
  onViewScheduleActivity?: (activityId: string) => void
}

export default function ExceptionDetail({ exceptionId, onBack, onViewActual, onViewScheduleActivity }: Props) {
  const exc = EXCEPTIONS.find((e) => e.id === exceptionId)

  if (!exc) {
    return (
      <div className="flex h-full items-center justify-center" style={{ padding: 32 }}>
        <p style={{ color: 'var(--c-muted)' }}>Exception not found.</p>
      </div>
    )
  }

  const typeCfg = EXCEPTION_TYPE_CONFIG[exc.type]

  const schedActId = exc.scheduleActivityId
  const onViewSched = schedActId && onViewScheduleActivity
    ? () => onViewScheduleActivity(schedActId)
    : undefined

  function renderTypeDetail() {
    switch (exc!.type) {
      case 'conflicting':
        return (
          <ConflictDetail
            onViewActual={onViewActual ? () => onViewActual(exc!.actualId) : undefined}
            onViewScheduleActivity={onViewSched}
          />
        )
      case 'incomplete':
        return (
          <IncompleteDetail
            exceptionId={exceptionId}
            onViewActual={onViewActual ? () => onViewActual(exc!.actualId) : undefined}
            onViewScheduleActivity={onViewSched}
          />
        )
      case 'unmatched':
        return (
          <UnmatchedDetail
            onViewActual={onViewActual ? () => onViewActual(exc!.actualId) : undefined}
            onViewScheduleActivity={onViewSched}
          />
        )
      case 'duplicate':
        return (
          <DuplicateDetail
            onViewActual={onViewActual ? () => onViewActual(exc!.actualId) : undefined}
            onViewScheduleActivity={onViewSched}
          />
        )
    }
  }

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 28px 48px' }}>

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-1.5 text-[12px]"
          style={{ color: 'var(--c-muted)' }}
        >
          <button
            onClick={onBack}
            className="font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--c-muted)' }}
          >
            Exceptions
          </button>
          <ChevronRight size={12} strokeWidth={2} aria-hidden="true" />
          <span style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>{exc.id}</span>
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
                className="text-[22px] font-bold tracking-[-0.02em] leading-[28px]"
                style={{ color: 'var(--c-text)' }}
              >
                {exc.activityName}
              </h1>
              <div
                className="mt-1 text-[12px]"
                style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
              >
                {exc.id}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                {exc.discipline}
                {exc.area ? ` · ${exc.area}` : ''}
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              <TypeBadge type={exc.type} />
              <WorkflowBadge status={exc.workflowStatus} />
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Actual
              </span>
              <div
                className="text-[12px] font-semibold"
                style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
              >
                {exc.actualId}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Source
              </span>
              <div className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                {exc.source}
              </div>
            </div>
            {exc.owner && (
              <div>
                <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                  Owner
                </span>
                <div className="text-[12px]" style={{ color: 'var(--c-text)' }}>
                  {exc.owner}
                </div>
              </div>
            )}
          </div>

          {/* Exception type description */}
          <div
            className="mt-4 rounded-[10px] px-4 py-3 text-[12px]"
            style={{ background: typeCfg.bg, border: `1px solid ${typeCfg.color}22` }}
          >
            <span style={{ color: typeCfg.color, fontWeight: 600 }}>
              {typeCfg.label} Exception
            </span>
            <span className="ml-2" style={{ color: 'var(--c-muted)' }}>
              {exc.type === 'conflicting' &&
                'Two field sources report different values for the same event.'}
              {exc.type === 'incomplete' &&
                'Insufficient information to safely link to the schedule.'}
              {exc.type === 'unmatched' &&
                'No schedule candidate reached the safe matching threshold.'}
              {exc.type === 'duplicate' &&
                'Multiple records may describe the same field event.'}
            </span>
          </div>
        </div>

        {/* Type-specific content */}
        {renderTypeDetail()}
      </div>
    </div>
  )
}
