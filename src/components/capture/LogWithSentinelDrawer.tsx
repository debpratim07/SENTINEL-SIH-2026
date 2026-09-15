import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Quote, ShieldCheck, X } from 'lucide-react'
import { useConnectedProject } from '../../context/ConnectedProjectContext'
import { captureManualEvent } from '../../lib/connected-api'
import {
  buildManualCaptureInput,
  canCaptureProgress,
  resolveCaptureRequest,
  validateManualCapture,
  type ManualCaptureDraft,
  type PendingCaptureRequest,
} from '../../lib/manual-capture'
import type { ProposedEvent } from '../../lib/connected-types'
import Drawer from '../ui/Drawer'

interface Props { open: boolean; onClose: () => void }

const emptyDraft: ManualCaptureDraft = {
  report_date: '', text: '', event_type: 'progress_observation', actual_date: null, source_quote: '',
}

const fieldStyle = {
  width: '100%', borderRadius: 10, border: '1px solid var(--c-border)',
  background: 'var(--c-page)', color: 'var(--c-text)', padding: '10px 12px',
  fontSize: 13, outline: 'none',
} as const

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{children}</span>
}

export default function LogWithSentinelDrawer({ open, onClose }: Props) {
  const access = useConnectedProject()
  const [draft, setDraft] = useState<ManualCaptureDraft>(emptyDraft)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [savedEventId, setSavedEventId] = useState<string | null>(null)
  const rawTextRef = useRef<HTMLTextAreaElement>(null)
  const pendingRequest = useRef<PendingCaptureRequest | null>(null)
  const submissionActive = useRef(false)

  useEffect(() => {
    if (!open) return
    setDraft(emptyDraft); setBusy(false); setError(''); setSavedEventId(null)
    pendingRequest.current = null; submissionActive.current = false
  }, [open])

  const canCapture = canCaptureProgress(access.role)

  function update<K extends keyof ManualCaptureDraft>(key: K, value: ManualCaptureDraft[K]) {
    setDraft(current => ({ ...current, [key]: value })); setError('')
  }

  function useSelectedQuote() {
    const input = rawTextRef.current
    if (!input || input.selectionStart === input.selectionEnd) {
      setError('Select the supporting words in the raw field update first.'); return
    }
    update('source_quote', draft.text.slice(input.selectionStart, input.selectionEnd))
  }

  function handleClose() { if (!busy) onClose() }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submissionActive.current || !access.project) return
    if (!canCapture) { setError('Your current project role cannot capture progress.'); return }
    const validationError = validateManualCapture(draft)
    if (validationError) { setError(validationError); return }

    pendingRequest.current = resolveCaptureRequest(pendingRequest.current, draft, () => crypto.randomUUID())
    submissionActive.current = true; setBusy(true); setError('')
    try {
      const saved = await captureManualEvent(
        access.project.id,
        buildManualCaptureInput(draft, pendingRequest.current.key),
      )
      setSavedEventId(saved.id); pendingRequest.current = null
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save this update. Please retry.')
    } finally {
      submissionActive.current = false; setBusy(false)
    }
  }

  function captureAnother() {
    setDraft(emptyDraft); setSavedEventId(null); setError(''); pendingRequest.current = null
  }

  return (
    <Drawer open={open} onClose={handleClose} width={620} aria-label="Manual progress capture">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-start justify-between px-7 pb-5 pt-7" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full px-2 py-1 text-[10px] font-bold uppercase" style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A', letterSpacing: '0.07em' }}>Connected</span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--c-muted)' }}>Manual capture</span>
            </div>
            <h2 className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
              {savedEventId ? 'Progress saved' : 'Log field progress'}
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              {savedEventId ? 'The update is waiting for an authorized human review.' : 'Record the observation exactly as it was reported on site.'}
            </p>
          </div>
          <button onClick={handleClose} disabled={busy} className="flex h-8 w-8 items-center justify-center rounded-[8px]" aria-label="Close" style={{ color: 'var(--c-muted)' }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {savedEventId ? (
            <div className="flex min-h-full flex-col items-center justify-center py-10 text-center" aria-live="polite">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(22,163,74,0.12)' }}>
                <CheckCircle2 size={32} strokeWidth={1.8} style={{ color: '#16A34A' }} />
              </div>
              <h3 className="text-[22px] font-bold" style={{ color: 'var(--c-text)' }}>Saved to {access.project?.name}</h3>
              <p className="mt-2 max-w-md text-[14px] leading-6" style={{ color: 'var(--c-muted)' }}>
                SENTINEL created a proposed event and preserved your original field update and source quote.
              </p>
              <div className="mt-6 w-full max-w-md rounded-[14px] p-5 text-left" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
                <div className="flex items-start gap-3">
                  <ClipboardCheck size={18} className="mt-0.5 shrink-0" style={{ color: '#F46F29' }} />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>Pending human review</p>
                    <p className="mt-1 text-[12px] leading-5" style={{ color: 'var(--c-muted)' }}>The schedule has not been updated. No AI extraction or activity matching has occurred.</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[11px]" style={{ color: 'var(--c-subtle)' }}>Event reference: {savedEventId}</p>
            </div>
          ) : (
            <form id="connected-manual-capture" onSubmit={submit} className="flex flex-col gap-5">
              <div className="rounded-[12px] p-4" style={{ background: 'var(--c-brand-tint)', border: '1px solid rgba(244,111,41,0.22)' }}>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: '#F46F29' }} />
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{access.project?.name ?? 'No selected project'}</p>
                    <p className="mt-1 text-[12px] leading-5" style={{ color: 'var(--c-muted)' }}>This form saves directly to the selected project. It creates a pending event for human review and does not update the schedule.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label><Label>Report date <span style={{ color: '#DC2626' }}>*</span></Label>
                  <input type="date" required value={draft.report_date} onChange={e => update('report_date', e.target.value)} disabled={busy} style={fieldStyle} />
                </label>
                <label><Label>Event type <span style={{ color: '#DC2626' }}>*</span></Label>
                  <select value={draft.event_type} onChange={e => update('event_type', e.target.value as ProposedEvent['event_type'])} disabled={busy} style={fieldStyle}>
                    <option value="progress_observation">Progress observation</option><option value="start">Activity started</option><option value="finish">Activity finished</option>
                  </select>
                </label>
              </div>

              <label><Label>Actual date <span className="font-normal" style={{ color: 'var(--c-subtle)' }}>— leave blank if unknown</span></Label>
                <input type="date" value={draft.actual_date ?? ''} max={draft.report_date || undefined} onChange={e => update('actual_date', e.target.value || null)} disabled={busy} style={fieldStyle} />
                <span className="mt-1.5 block text-[11px]" style={{ color: 'var(--c-subtle)' }}>Use only the date explicitly reported for this observation.</span>
              </label>

              <label><Label>Raw field update <span style={{ color: '#DC2626' }}>*</span></Label>
                <textarea ref={rawTextRef} rows={6} maxLength={50000} required value={draft.text} onChange={e => update('text', e.target.value)} disabled={busy} placeholder="Paste or type the original site update without rewriting it." style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.55 }} />
                <span className="mt-1.5 block text-[11px]" style={{ color: 'var(--c-subtle)' }}>The complete text is stored as the original evidence.</span>
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3"><Label>Source quote <span style={{ color: '#DC2626' }}>*</span></Label>
                  <div className="flex gap-3"><button type="button" onClick={useSelectedQuote} disabled={busy || !draft.text} className="text-[11px] font-semibold" style={{ color: '#F46F29' }}>Use selected text</button>
                    <button type="button" onClick={() => update('source_quote', draft.text)} disabled={busy || !draft.text} className="text-[11px] font-semibold" style={{ color: '#F46F29' }}>Use complete update</button></div>
                </div>
                <div className="relative"><Quote size={15} className="absolute left-3 top-3" style={{ color: 'var(--c-subtle)' }} />
                  <textarea rows={3} maxLength={50000} required value={draft.source_quote} onChange={e => update('source_quote', e.target.value)} disabled={busy} placeholder="Copy the exact words that support this event." style={{ ...fieldStyle, paddingLeft: 36, resize: 'vertical', lineHeight: 1.5 }} />
                </div>
                <span className="mt-1.5 block text-[11px]" style={{ color: 'var(--c-subtle)' }}>This must be an exact, unchanged part of the raw field update.</span>
              </div>

              <div className="rounded-[12px] px-4 py-3 text-[12px] leading-5" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
                This is structured manual capture. SENTINEL is not running AI extraction, confidence scoring or schedule matching in this step.
              </div>
              {!canCapture && <p role="alert" className="text-[12px] text-red-600">Your current project role cannot capture progress.</p>}
              {error && <p role="alert" className="rounded-[10px] px-3 py-2 text-[12px] text-red-700" style={{ background: 'rgba(220,38,38,0.08)' }}>{error}</p>}
            </form>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 px-7 py-4" style={{ borderTop: '1px solid var(--c-border)' }}>
          {savedEventId ? <><button onClick={captureAnother} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)' }}>Capture another update</button>
            <button onClick={handleClose} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold" style={{ color: 'var(--c-muted)' }}>Close</button></>
          : <><button onClick={handleClose} disabled={busy} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold" style={{ color: 'var(--c-muted)' }}>Cancel</button>
            <button form="connected-manual-capture" type="submit" disabled={busy || !canCapture || !access.project} className="rounded-[9px] px-5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)', boxShadow: '0 2px 8px rgba(244,111,41,0.28)' }}>{busy ? 'Saving securely…' : 'Save for human review'}</button></>}
        </div>
      </div>
    </Drawer>
  )
}
