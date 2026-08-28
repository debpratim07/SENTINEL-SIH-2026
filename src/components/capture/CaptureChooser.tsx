import { X, MessageSquare, Upload, Table2, ChevronRight } from 'lucide-react'
import Modal from '../ui/Modal'

interface CaptureChooserProps {
  open: boolean
  onClose: () => void
  onLogWithSentinel: () => void
  onUploadReport: () => void
}

export default function CaptureChooser({ open, onClose, onLogWithSentinel, onUploadReport }: CaptureChooserProps) {
  function handleLogWithSentinel() {
    onClose()
    onLogWithSentinel()
  }

  function handleUploadReport() {
    onClose()
    onUploadReport()
  }

  return (
    <Modal open={open} onClose={onClose} aria-label="Capture Progress">
      <div
        style={{
          width: 480,
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 20,
          boxShadow: 'var(--c-shadow-elevated)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{ padding: '24px 24px 0' }}
        >
          <div>
            <h2
              className="text-[20px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--c-text)' }}
            >
              Capture Progress
            </h2>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--c-muted)' }}>
              Choose how you want to record field execution.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors duration-150 hover:bg-[var(--c-border)]"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
          </button>
        </div>

        {/* Options */}
        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Log with SENTINEL — primary option */}
          <button
            onClick={handleLogWithSentinel}
            className="group flex items-center gap-4 rounded-[14px] p-4 text-left transition-all duration-150"
            style={{
              background: 'rgba(244, 111, 41, 0.07)',
              border: '1.5px solid rgba(244, 111, 41, 0.25)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(244, 111, 41, 0.12)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244, 111, 41, 0.40)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(244, 111, 41, 0.07)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244, 111, 41, 0.25)'
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: 'rgba(244, 111, 41, 0.15)' }}
            >
              <MessageSquare size={18} strokeWidth={2} style={{ color: '#F46F29' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[15px] font-semibold"
                  style={{ color: 'var(--c-text)' }}
                >
                  Log with SENTINEL
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    background: 'rgba(244, 111, 41, 0.15)',
                    color: '#F46F29',
                    letterSpacing: '0.06em',
                  }}
                >
                  Recommended
                </span>
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                Describe what happened in your own words.
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={2} style={{ color: '#F46F29', flexShrink: 0 }} />
          </button>

          {/* Upload Report */}
          <button
            onClick={handleUploadReport}
            className="group flex items-center gap-4 rounded-[14px] p-4 text-left transition-all duration-150"
            style={{
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border-strong)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)'
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: 'var(--c-brand-tint)' }}
            >
              <Upload size={18} strokeWidth={2} style={{ color: '#F46F29' }} />
            </div>
            <div className="flex-1">
              <span className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                Upload Report
              </span>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                Add a DPR, spreadsheet or site diary.
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={2} style={{ color: 'var(--c-muted)', flexShrink: 0 }} />
          </button>

          {/* Manual Entry */}
          <button
            className="group flex items-center gap-4 rounded-[14px] p-4 text-left transition-all duration-150"
            style={{
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border-strong)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)'
            }}
            title="Coming soon"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: 'var(--c-border)' }}
            >
              <Table2 size={18} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  Manual Entry
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                  style={{ background: 'var(--c-border)', color: 'var(--c-subtle)', letterSpacing: '0.06em' }}
                >
                  Coming soon
                </span>
              </div>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                Enter a structured actual directly.
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={2} style={{ color: 'var(--c-subtle)', flexShrink: 0 }} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
