import { useState, useEffect, useRef } from 'react'
import { X, Upload, FileText, CheckCircle2, Loader2, AlertTriangle, ChevronRight } from 'lucide-react'
import Drawer from '../ui/Drawer'

type Step = 'upload' | 'validating' | 'validation-error' | 'processing' | 'result'

interface Props {
  open: boolean
  onClose: () => void
  onReviewReport: () => void
}

const PROCESSING_STEPS = [
  { label: 'Reading source',                  key: 'read' },
  { label: 'Identifying execution statements', key: 'identify' },
  { label: 'Structuring actual events',        key: 'structure' },
  { label: 'Matching schedule activities',     key: 'match' },
  { label: 'Checking completeness',            key: 'complete' },
]

export default function UploadReportDrawer({ open, onClose, onReviewReport }: Props) {
  const [step, setStep] = useState<Step>('upload')
  const [processingStep, setProcessingStep] = useState(0)
  const [discipline, setDiscipline] = useState('Piping')
  const [reportDate, setReportDate] = useState('28 Aug 2026')
  const [area, setArea] = useState('Area B')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setStep('upload')
    setProcessingStep(0)
    setDiscipline('Piping')
    setReportDate('28 Aug 2026')
    setArea('Area B')
  }

  function handleClose() {
    onClose()
    setTimeout(reset, 340)
  }

  function handleAnalyze() {
    setStep('validating')
    setTimeout(() => {
      setStep('processing')
      setProcessingStep(0)
    }, 900)
  }

  useEffect(() => {
    if (step !== 'processing') return
    if (processingStep >= PROCESSING_STEPS.length) {
      setTimeout(() => setStep('result'), 400)
      return
    }
    const t = setTimeout(() => setProcessingStep((s) => s + 1), processingStep === 3 ? 900 : 600)
    return () => clearTimeout(t)
  }, [step, processingStep])

  function handleReviewReport() {
    handleClose()
    setTimeout(onReviewReport, 350)
  }

  return (
    <Drawer open={open} onClose={handleClose} width={620} aria-label="Upload Report">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '28px 28px 20px',
            borderBottom: '1px solid var(--c-border)',
          }}
        >
          <div>
            <h2
              style={{ fontSize: 20, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.02em' }}
            >
              Upload Report
            </h2>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--c-muted)', maxWidth: 460 }}>
              Add a field report and SENTINEL will identify execution events and connect them to
              the project schedule.
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              color: 'var(--c-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {step === 'upload' && <UploadStep discipline={discipline} setDiscipline={setDiscipline} reportDate={reportDate} setReportDate={setReportDate} area={area} setArea={setArea} fileInputRef={fileInputRef} />}
          {step === 'validating' && <ValidatingStep />}
          {step === 'validation-error' && <ValidationErrorStep onRetry={() => setStep('upload')} />}
          {step === 'processing' && <ProcessingStep currentStep={processingStep} />}
          {step === 'result' && <ResultStep />}
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '16px 28px',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          {step === 'upload' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '9px 18px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyze}
                style={{
                  padding: '9px 20px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                  boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                Analyze Report
              </button>
            </>
          )}
          {(step === 'validating' || step === 'processing') && (
            <button
              onClick={handleClose}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
          {step === 'result' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '9px 18px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
              <button
                onClick={handleReviewReport}
                style={{
                  padding: '9px 20px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                  boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  letterSpacing: '-0.01em',
                }}
              >
                Review Report
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  )
}

function UploadStep({
  discipline, setDiscipline,
  reportDate, setReportDate,
  area, setArea,
  fileInputRef,
}: {
  discipline: string; setDiscipline: (v: string) => void
  reportDate: string; setReportDate: (v: string) => void
  area: string; setArea: (v: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileLoaded] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
        style={{
          border: `2px dashed ${isDragging ? '#F46F29' : 'var(--c-border-strong)'}`,
          borderRadius: 14,
          background: isDragging ? 'rgba(244,111,41,0.04)' : 'var(--c-page)',
          padding: '32px 24px',
          textAlign: 'center',
          transition: 'all 150ms',
        }}
      >
        {fileLoaded ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(244,111,41,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={20} strokeWidth={1.8} style={{ color: '#F46F29' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text)' }}>
                Piping_DPR_28Aug.pdf
              </p>
              <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 2 }}>PDF · 2.4 MB</p>
            </div>
            <button
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: '#F46F29',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Replace
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--c-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Upload size={20} strokeWidth={1.8} style={{ color: 'var(--c-muted)' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)', marginBottom: 4 }}>
              Drop a report here
            </p>
            <p style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 12 }}>
              or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ color: '#F46F29', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                browse files
              </button>
            </p>
            <p style={{ fontSize: 11, color: 'var(--c-subtle)' }}>PDF · DOCX · XLSX · CSV · TXT</p>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx,.csv,.txt" style={{ display: 'none' }} aria-label="Upload file" />
          </>
        )}
      </div>

      {/* Validation pre-check */}
      {fileLoaded && (
        <div
          style={{
            background: 'var(--c-page)',
            border: '1px solid var(--c-border)',
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {[
            'File readable',
            'Supported format',
            'Project context available',
          ].map((label) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={13} strokeWidth={2.5} style={{ color: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--c-text)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-subtle)' }}>
          Report Context
        </p>
        {[
          { label: 'Discipline', value: discipline, setter: setDiscipline, options: ['Piping', 'Civil', 'Electrical', 'Rotating Equipment'] },
          { label: 'Area',       value: area,       setter: setArea,       options: ['Area A', 'Area B', 'Utility Block', 'Fabrication Yard'] },
        ].map(({ label, value, setter, options }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--c-muted)', width: 90, flexShrink: 0 }}>{label}</label>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: 8,
                fontSize: 13,
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
              }}
            >
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--c-muted)', width: 90, flexShrink: 0 }}>Report Date</label>
          <input
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            style={{
              flex: 1,
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 13,
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-text)',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ValidatingStep() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          background: 'var(--c-page)',
          border: '1px solid var(--c-border)',
          borderRadius: 12,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <FileText size={18} strokeWidth={1.8} style={{ color: '#F46F29', flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)' }}>
          Piping_DPR_28Aug.pdf
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['File readable', 'Supported format', 'Project context available'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: '#16A34A', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--c-text)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ValidationErrorStep({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          background: 'rgba(220,38,38,0.06)',
          border: '1px solid rgba(220,38,38,0.20)',
          borderRadius: 12,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <AlertTriangle size={18} strokeWidth={2} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>Unable to process this file</p>
          <p style={{ fontSize: 13, color: 'var(--c-muted)', marginTop: 4 }}>
            The uploaded file is corrupted or unsupported.
          </p>
        </div>
      </div>
      <button
        onClick={onRetry}
        style={{
          alignSelf: 'flex-start',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          color: 'var(--c-text)',
          cursor: 'pointer',
        }}
      >
        Choose Another File
      </button>
    </div>
  )
}

function ProcessingStep({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--c-text)', marginBottom: 4 }}>
          Analyzing Report
        </p>
        <p style={{ fontSize: 13, color: 'var(--c-muted)' }}>Piping_DPR_28Aug.pdf</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROCESSING_STEPS.map((s, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {done ? (
                <CheckCircle2 size={15} strokeWidth={2.5} style={{ color: '#16A34A', flexShrink: 0 }} />
              ) : active ? (
                <Loader2
                  size={15}
                  strokeWidth={2.5}
                  style={{ color: '#F46F29', flexShrink: 0, animation: 'spin 1s linear infinite' }}
                />
              ) : (
                <span
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    border: '1.5px solid var(--c-border-strong)',
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 13,
                  color: done ? 'var(--c-text)' : active ? '#F46F29' : 'var(--c-subtle)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResultStep() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(22,163,74,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={20} strokeWidth={2} style={{ color: '#16A34A' }} />
        </div>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.01em' }}>
            Report processed
          </p>
          <p style={{ fontSize: 14, color: 'var(--c-muted)', marginTop: 2 }}>
            6 Actual Events identified
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
        }}
      >
        {[
          { label: 'Strong Matches', value: '4', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
          { label: 'Needs Review',   value: '1', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
          { label: 'Incomplete',     value: '1', color: 'var(--c-muted)', bg: 'var(--c-page)' },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: bg,
              border: '1px solid var(--c-border)',
              borderRadius: 10,
              padding: '12px 14px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 3 }}>{label}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.5 }}>
        Each execution event is evaluated independently before it can affect schedule truth.
      </p>
    </div>
  )
}
