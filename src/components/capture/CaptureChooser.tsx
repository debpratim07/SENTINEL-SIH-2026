import { ChevronRight, MessageSquareText, Upload, X } from 'lucide-react'
import Modal from '../ui/Modal'

interface CaptureChooserProps {
  open: boolean
  onClose: () => void
  onManualCapture: () => void
}

export default function CaptureChooser({ open, onClose, onManualCapture }: CaptureChooserProps) {
  function openManualCapture() { onClose(); onManualCapture() }

  return (
    <Modal open={open} onClose={onClose} aria-label="Capture Progress">
      <div style={{ width: 480, background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 20, boxShadow: 'var(--c-shadow-elevated)', overflow: 'hidden' }}>
        <div className="flex items-start justify-between" style={{ padding: '24px 24px 0' }}>
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Capture Progress</h2>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--c-muted)' }}>Choose how you want to record field execution.</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors duration-150 hover:bg-[var(--c-border)]" aria-label="Close">
            <X size={16} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 px-6 pb-6 pt-4">
          <button onClick={openManualCapture} className="group flex items-center gap-4 rounded-[14px] p-4 text-left transition-all duration-150" style={{ background: 'rgba(244,111,41,0.07)', border: '1.5px solid rgba(244,111,41,0.25)' }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ background: 'rgba(244,111,41,0.15)' }}>
              <MessageSquareText size={18} strokeWidth={2} style={{ color: '#F46F29' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>Manual field update</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A', letterSpacing: '0.06em' }}>Connected</span>
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Save original field evidence as a pending event for human review.</p>
            </div>
            <ChevronRight size={16} strokeWidth={2} style={{ color: '#F46F29', flexShrink: 0 }} />
          </button>

          <button disabled className="flex cursor-not-allowed items-center gap-4 rounded-[14px] p-4 text-left opacity-60" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }} aria-describedby="upload-status">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ background: 'var(--c-border)' }}>
              <Upload size={18} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>Upload report</span>
                <span id="upload-status" className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ background: 'var(--c-border)', color: 'var(--c-subtle)', letterSpacing: '0.06em' }}>Coming later</span>
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>File ingestion and attachments are not connected yet.</p>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  )
}
