import { useState } from 'react'
import { X, MessageCircle, CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  activityId: string
}

export default function RequestClarificationModal({ open, onClose, activityId }: Props) {
  const [sent, setSent] = useState(false)
  const [question, setQuestion] = useState('Which line or activity does this update refer to?')

  function handleSend() {
    setSent(true)
  }

  function handleClose() {
    setSent(false)
    setQuestion('Which line or activity does this update refer to?')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} aria-label="Request Clarification" zIndex={70}>
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
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] transition-colors duration-150"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div style={{ padding: '18px 20px' }}>
          {!sent ? (
            <div className="flex flex-col gap-4">
              {/* Reference */}
              <div
                className="rounded-[9px] px-3 py-2"
                style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
              >
                <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Re: </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                >
                  {activityId}
                </span>
              </div>

              {/* Question */}
              <div>
                <label
                  htmlFor="clarification-question"
                  className="mb-2 block text-[12px] font-semibold"
                  style={{ color: 'var(--c-muted)' }}
                >
                  Question
                </label>
                <textarea
                  id="clarification-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
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

              {/* Recipient */}
              <div>
                <label className="mb-2 block text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                  Recipient
                </label>
                <div
                  className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5"
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: '#7C3AED' }}
                  >
                    JD
                  </div>
                  <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                    Original Reporter
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
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
                  onClick={handleSend}
                  disabled={!question.trim()}
                  className="flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:opacity-40"
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
                <p className="text-[15px] font-bold" style={{ color: 'var(--c-text)' }}>Request sent</p>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                  The original reporter will be notified.
                </p>
              </div>
              <div
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3"
                style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
              >
                <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>New status</span>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{ background: 'rgba(124,58,237,0.10)', color: '#7C3AED' }}
                >
                  Awaiting Clarification
                </span>
              </div>
              <button
                onClick={handleClose}
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
  )
}
