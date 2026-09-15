// PROTOTYPE REFERENCE ONLY. Unmatched persistence has no connected contract yet.
import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import Modal from '../../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (comment: string) => void
  activityId: string
}

export default function MarkUnmatchedPrototypeDialog({ open, onClose, onConfirm, activityId }: Props) {
  const [comment, setComment] = useState('')

  function handleConfirm() {
    onConfirm(comment)
    setComment('')
  }

  return (
    <Modal open={open} onClose={onClose} aria-label="Mark Unmatched" zIndex={70}>
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
        {/* Header */}
        <div className="flex items-start gap-3" style={{ padding: '20px 20px 16px' }}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]"
            style={{ background: 'rgba(220,38,38,0.10)', marginTop: 1 }}
          >
            <AlertCircle size={17} strokeWidth={2} style={{ color: '#DC2626' }} />
          </div>
          <div className="flex-1">
            <h3
              className="text-[15px] font-bold tracking-[-0.01em]"
              style={{ color: 'var(--c-text)' }}
            >
              Keep this Actual unmatched?
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              The execution event will remain in SENTINEL but will not update the project schedule.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] transition-colors duration-150"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Reference */}
          <div
            className="rounded-[9px] px-3.5 py-2.5"
            style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
          >
            <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Reference: </span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
            >
              {activityId}
            </span>
          </div>

          {/* Optional comment */}
          <div>
            <label
              htmlFor="unmatched-comment"
              className="mb-2 block text-[12px] font-semibold"
              style={{ color: 'var(--c-muted)' }}
            >
              Optional Comment
            </label>
            <textarea
              id="unmatched-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Reason for leaving unmatched..."
              rows={3}
              className="w-full resize-none rounded-[10px] p-3 text-[13px]"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-[10px] py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
              style={{
                background: 'rgba(220,38,38,0.10)',
                border: '1px solid rgba(220,38,38,0.25)',
                color: '#DC2626',
              }}
            >
              Keep Unmatched
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
