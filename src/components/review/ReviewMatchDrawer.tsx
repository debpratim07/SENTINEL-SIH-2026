import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CheckCircle2, Quote, Search, ShieldCheck, X } from 'lucide-react'
import { approveActual } from '../../lib/connected-api'
import type { ProposedEvent, ScheduleActivity, ScheduleActual } from '../../lib/connected-types'
import {
  buildApprovalInput, eligibleL6Activities, eventReviewBlockReason, resolveApprovalRequest,
  validateApprovalDraft, type PendingApprovalRequest,
} from '../../lib/real-review'
import Drawer from '../ui/Drawer'
import { CompletionFlow } from '../industrial-flow/CompletionFlow'

interface Props {
  open: boolean
  event: ProposedEvent | null
  activities: ScheduleActivity[]
  actuals: ScheduleActual[]
  projectId: string
  canReview: boolean
  onClose: () => void
  onApproved: () => Promise<void>
}

function readable(value: string) { return value.replace(/_/g, ' ') }

function actualFor(activityId: string, actuals: ScheduleActual[]) {
  return actuals.find(actual => actual.activity_id === activityId)
}

export default function ReviewMatchDrawer({
  open, event, activities, actuals, projectId, canReview, onClose, onApproved,
}: Props) {
  const [search, setSearch] = useState('')
  const [activityId, setActivityId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [decisionId, setDecisionId] = useState<string | null>(null)
  const pendingRequest = useRef<PendingApprovalRequest | null>(null)
  const submissionActive = useRef(false)

  useEffect(() => {
    if (!open) return
    setSearch(''); setActivityId(''); setReason(''); setError(''); setBusy(false); setDecisionId(null)
    pendingRequest.current = null; submissionActive.current = false
  }, [open, event?.id])

  const eligible = useMemo(
    () => event ? eligibleL6Activities(event, activities, actuals) : [],
    [event, activities, actuals],
  )
  const visibleActivities = eligible.filter(activity => {
    const value = search.toLowerCase().trim()
    return !value || [activity.external_id, activity.name, activity.discipline, activity.area, activity.equipment_ref]
      .some(field => field?.toLowerCase().includes(value))
  })
  // Keep the chosen activity visible after refresh makes it ineligible for a second approval.
  const selectedActivity = activities.find(activity => activity.id === activityId) ?? null
  const blockReason = event ? eventReviewBlockReason(event) : 'No event selected.'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!event || !canReview || blockReason || submissionActive.current) return
    const draft = { activity_id: activityId, reason }
    const draftError = validateApprovalDraft(draft)
    if (draftError) { setError(draftError); return }
    if (!eligible.some(activity => activity.id === activityId)) {
      setError('Select an eligible L6 activity from the connected schedule.'); return
    }

    pendingRequest.current = resolveApprovalRequest(pendingRequest.current, event, draft, () => crypto.randomUUID())
    submissionActive.current = true; setBusy(true); setError('')
    try {
      const result = await approveActual(projectId, buildApprovalInput(event, draft, pendingRequest.current.key))
      setDecisionId(result.id); pendingRequest.current = null
      await onApproved()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Approval failed. Refresh and retry safely.')
    } finally {
      submissionActive.current = false; setBusy(false)
    }
  }

  function handleClose() { if (!busy) onClose() }

  return (
    <Drawer open={open} onClose={handleClose} width={720} aria-label="Human event review">
      <div className="workflow-drawer flex h-full flex-col">
        <div className="flex shrink-0 items-start justify-between px-7 pb-5 pt-7" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full px-2 py-1 text-[10px] font-bold uppercase" style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A', letterSpacing: '0.07em' }}>Connected</span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--c-muted)' }}>Human verification</span>
            </div>
            <h2 className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
              {decisionId ? 'Actual verified' : 'Review field evidence'}
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>Choose the matching real L6 activity only when the evidence supports it.</p>
          </div>
          <button onClick={handleClose} disabled={busy} className="flex h-8 w-8 items-center justify-center rounded-[8px]" aria-label="Close" style={{ color: 'var(--c-muted)' }}><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {!event ? <p style={{ color: 'var(--c-muted)' }}>No event selected.</p> : decisionId ? (
            <div className="flex min-h-full flex-col items-center justify-center py-10 text-center" aria-live="polite">
              <CompletionFlow className="workflow-completion" title="Operation confirmed"/>
              <h3 className="text-[22px] font-bold" style={{ color: 'var(--c-text)' }}>Human verification complete</h3>
              <p className="mt-2 max-w-md text-[14px] leading-6" style={{ color: 'var(--c-muted)' }}>
                The {readable(event.event_type)} actual for {selectedActivity?.external_id} was persisted as {event.actual_date}. The event is verified and the review is recorded in audit history.
              </p>
              <div className="mt-5 rounded-[12px] px-4 py-3 text-[12px]" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>Decision reference: {decisionId}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <section className="rounded-[14px] p-5" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize" style={{ background: 'rgba(244,111,41,0.12)', color: '#F46F29' }}>{readable(event.event_type)}</span>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize" style={{ background: event.review_status === 'pending' ? 'rgba(217,119,6,0.12)' : 'rgba(22,163,74,0.12)', color: event.review_status === 'pending' ? '#B45309' : '#16A34A' }}>{event.review_status}</span>
                  <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>Revision {event.revision}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div><p style={{ color: 'var(--c-subtle)' }}>Report date</p><p className="mt-1 font-semibold" style={{ color: 'var(--c-text)' }}>{event.report?.report_date ?? 'Unknown'}</p></div>
                  <div><p style={{ color: 'var(--c-subtle)' }}>Reported actual date</p><p className="mt-1 font-semibold" style={{ color: 'var(--c-text)' }}>{event.actual_date ?? 'Unknown'}</p></div>
                </div>
                <div className="mt-5"><p className="text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Raw field update</p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] leading-6" style={{ color: 'var(--c-text)' }}>{event.report?.raw_text ?? 'Original report unavailable.'}</p></div>
                <div className="evidence-quote mt-5 rounded-[12px] p-4" style={{ background: 'rgba(244,111,41,0.07)', border: '1px solid rgba(244,111,41,0.22)' }}>
                  <div className="flex items-start gap-3"><Quote size={17} className="mt-0.5 shrink-0" style={{ color: '#F46F29' }} /><div><p className="text-[11px] font-bold uppercase" style={{ color: '#F46F29', letterSpacing: '0.08em' }}>Exact source quote</p><blockquote className="mt-2 whitespace-pre-wrap text-[13px] font-medium leading-6" style={{ color: 'var(--c-text)' }}>{event.source_quote}</blockquote></div></div>
                </div>
              </section>

              {blockReason ? <div role="note" className="rounded-[12px] p-4 text-[13px]" style={{ background: 'rgba(217,119,6,0.10)', color: '#92400E', border: '1px solid rgba(217,119,6,0.24)' }}>{blockReason} No schedule actual can be created from this event.</div>
              : !canReview ? <div role="note" className="rounded-[12px] p-4 text-[13px]" style={{ background: 'var(--c-page)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>Your project role has read-only access to this review. A planner, project controls reviewer, or administrator must verify it.</div>
              : <form id="connected-human-review" onSubmit={submit} className="flex flex-col gap-5">
                  <section><div className="mb-2 flex items-end justify-between"><div><h3 className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>Select the matching L6 activity</h3><p className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>Manual selection from {eligible.length} eligible connected activities. No AI ranking is applied.</p></div></div>
                    <div className="relative mb-3"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--c-muted)' }} /><input value={search} onChange={e => setSearch(e.target.value)} aria-label="Search eligible L6 activities" placeholder="Search ID, activity, discipline, area or equipment…" className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-[13px]" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} /></div>
                    <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                      {visibleActivities.length === 0 && <p className="rounded-[10px] p-4 text-[12px]" style={{ background: 'var(--c-page)', color: 'var(--c-muted)' }}>No eligible L6 activities match this search.</p>}
                      {visibleActivities.map(activity => { const actual = actualFor(activity.id, actuals); const selected = activity.id === activityId; return <label key={activity.id} className="cursor-pointer rounded-[12px] p-4" style={{ background: selected ? 'rgba(244,111,41,0.07)' : 'var(--c-card)', border: selected ? '1.5px solid rgba(244,111,41,0.45)' : '1px solid var(--c-border)' }}>
                        <div className="flex items-start gap-3"><input type="radio" name="activity" value={activity.id} checked={selected} onChange={() => { setActivityId(activity.id); setError('') }} className="mt-1" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-[12px]" style={{ color: '#F46F29' }}>{activity.external_id}</strong><span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'var(--c-border)', color: 'var(--c-muted)' }}>L6</span></div><p className="mt-1 text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{activity.name}</p><p className="mt-1 text-[11px]" style={{ color: 'var(--c-muted)' }}>{[activity.discipline, activity.area, activity.equipment_ref].filter(Boolean).join(' · ') || 'No additional schedule metadata'}</p><p className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--c-subtle)' }}><CalendarDays size={12} />Plan {activity.planned_start ?? 'unknown'} → {activity.planned_finish ?? 'unknown'} · Actual {actual?.actual_start ?? '—'} → {actual?.actual_finish ?? '—'}</p></div></div>
                      </label> })}
                    </div>
                  </section>
                  <label><span className="mb-1.5 block text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>Human review reason <span style={{ color: '#DC2626' }}>*</span></span><textarea value={reason} onChange={e => { setReason(e.target.value); setError('') }} rows={3} maxLength={2000} required placeholder="Explain how the original evidence supports the selected activity and date." className="w-full resize-y rounded-[10px] p-3 text-[13px] leading-5" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} /><span className="mt-1 block text-[11px]" style={{ color: 'var(--c-subtle)' }}>Written by the human reviewer. SENTINEL does not generate this rationale.</span></label>
                  <div className="flex items-start gap-3 rounded-[12px] p-4" style={{ background: 'var(--c-brand-tint)', border: '1px solid rgba(244,111,41,0.22)' }}><ShieldCheck size={17} className="mt-0.5 shrink-0" style={{ color: '#F46F29' }} /><p className="text-[12px] leading-5" style={{ color: 'var(--c-muted)' }}>Verification will persist the reported {readable(event.event_type)} date to the selected L6 activity and create review and audit records. Existing actuals cannot be silently overwritten.</p></div>
                  {error && <p role="alert" className="rounded-[10px] px-3 py-2 text-[12px] text-red-700" style={{ background: 'rgba(220,38,38,0.08)' }}>{error}</p>}
                </form>}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 px-7 py-4" style={{ borderTop: '1px solid var(--c-border)' }}>
          {decisionId ? <button onClick={handleClose} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)' }}>Done</button>
          : <><button onClick={handleClose} disabled={busy} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold" style={{ color: 'var(--c-muted)' }}>Close</button>{event && canReview && !blockReason && <button form="connected-human-review" type="submit" disabled={busy || !activityId || !reason.trim()} className="rounded-[9px] px-5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)', boxShadow: '0 2px 8px rgba(244,111,41,0.28)' }}>{busy ? 'Verifying securely…' : 'Verify and save actual'}</button>}</>}
        </div>
      </div>
    </Drawer>
  )
}
