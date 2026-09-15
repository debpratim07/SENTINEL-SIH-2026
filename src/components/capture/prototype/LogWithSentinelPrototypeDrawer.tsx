// PROTOTYPE REFERENCE ONLY. This simulated AI journey is intentionally not imported
// by the connected application. Retain it as visual reference for the later real AI phase.
import { useEffect, useState } from 'react'
import {
  X,
  Camera,
  FileText,
  StickyNote,
  Check,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Circle,
} from 'lucide-react'
import Drawer from '../../ui/Drawer'

type LogStep =
  | 'input'
  | 'processing'
  | 'clarification'
  | 'structured'
  | 'match-processing'
  | 'match-preview'
  | 'success'

const AREA_OPTIONS = ['Utility Block', 'Area A', 'Area B', 'Tank Farm', "Other", "I don't know"]

const ACTIVITIES = [
  { id: 'EQUIP-ALIGN-P204', label: 'EQUIPMENT ALIGNMENT — P-204', tier: 'L6', discipline: 'Rotating Equipment', area: 'Utility Block' },
  { id: 'P204-INSTALL', label: 'P-204 INSTALLATION', tier: 'L6', discipline: 'Rotating Equipment', area: 'Utility Block', confidence: 42 },
  { id: 'P204-COMM', label: 'P-204 COMMISSIONING', tier: 'L6', discipline: 'Rotating Equipment', area: 'Utility Block', confidence: 21 },
]

function StepIcon({ done, active }: { done: boolean; active: boolean }) {
  if (done) return <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#16A34A' }} />
  if (active) return <Loader2 size={16} strokeWidth={2} style={{ color: '#F46F29' }} className="animate-spin" />
  return <Circle size={16} strokeWidth={1.5} style={{ color: 'var(--c-subtle)' }} />
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function LogWithSentinelPrototypeDrawer({ open, onClose }: Props) {
  const [step, setStep] = useState<LogStep>('input')
  const [inputText, setInputText] = useState('Pump P-204 alignment started this morning.')
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [matchStep, setMatchStep] = useState(0)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  // Reset state on open
  useEffect(() => {
    if (open) {
      setStep('input')
      setInputText('Pump P-204 alignment started this morning.')
      setSelectedArea(null)
      setProcessingStep(0)
      setMatchStep(0)
      setShowAlternatives(false)
      setEditingField(null)
    }
  }, [open])

  // Processing animation
  useEffect(() => {
    if (step !== 'processing') return
    setProcessingStep(0)
    const t1 = setTimeout(() => setProcessingStep(1), 500)
    const t2 = setTimeout(() => setProcessingStep(2), 1050)
    const t3 = setTimeout(() => setProcessingStep(3), 1600)
    const t4 = setTimeout(() => setProcessingStep(4), 2200)
    const t5 = setTimeout(() => setStep('clarification'), 3100)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [step])

  // Match processing animation
  useEffect(() => {
    if (step !== 'match-processing') return
    setMatchStep(0)
    const t1 = setTimeout(() => setMatchStep(1), 450)
    const t2 = setTimeout(() => setMatchStep(2), 950)
    const t3 = setTimeout(() => setMatchStep(3), 1450)
    const t4 = setTimeout(() => setMatchStep(4), 1950)
    const t5 = setTimeout(() => setMatchStep(5), 2500)
    const t6 = setTimeout(() => setStep('match-preview'), 3300)
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout)
  }, [step])

  function handleContinue() {
    if (step === 'input') setStep('processing')
    else if (step === 'clarification') setStep('structured')
    else if (step === 'structured') setStep('match-processing')
    else if (step === 'match-preview') setStep('success')
  }

  function handleBack() {
    if (step === 'clarification') setStep('input')
    else if (step === 'structured') setStep('clarification')
    else if (step === 'match-preview') setStep('structured')
  }

  function handleDone() {
    onClose()
  }

  const stepTitles: Record<LogStep, string> = {
    input: 'Log Progress',
    processing: 'Log Progress',
    clarification: 'Log Progress',
    structured: 'Log Progress',
    'match-processing': 'Log Progress',
    'match-preview': 'Log Progress',
    success: 'Progress Submitted',
  }

  return (
    <Drawer open={open} onClose={onClose} width={620} aria-label="Log Progress">
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-[18px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--c-text)' }}
            >
              {stepTitles[step]}
            </h2>
            {step !== 'success' && (
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                {step === 'input' || step === 'processing' || step === 'clarification'
                  ? 'Describe what happened on site. SENTINEL will structure the update and connect it to the schedule.'
                  : step === 'structured'
                  ? 'Review the structured actual before confirming.'
                  : step === 'match-preview'
                  ? 'SENTINEL has found a likely schedule match.'
                  : 'Finding schedule activity...'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors duration-150"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Step dots */}
        {step !== 'success' && (
          <div className="mt-3 flex items-center gap-1.5">
            {(['input', 'clarification', 'structured', 'match-preview'] as LogStep[]).map((s, i) => {
              const stepOrder: LogStep[] = ['input', 'processing', 'clarification', 'structured', 'match-processing', 'match-preview', 'success']
              const currentIdx = stepOrder.indexOf(step)
              const thisIdx = stepOrder.indexOf(s)
              const done = currentIdx > thisIdx
              const active = currentIdx === thisIdx || (s === 'input' && step === 'processing') || (s === 'clarification' && step === 'clarification') || (s === 'structured' && step === 'structured') || (s === 'match-preview' && (step === 'match-processing' || step === 'match-preview'))
              return (
                <div
                  key={i}
                  style={{
                    height: 3,
                    width: active ? 24 : done ? 16 : 12,
                    borderRadius: 2,
                    background: done ? '#F46F29' : active ? '#F46F29' : 'var(--c-border)',
                    opacity: done ? 0.7 : 1,
                    transition: 'width 200ms, background 200ms',
                  }}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
        {/* ── INPUT ────────────────────────────────────────────── */}
        {step === 'input' && (
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="log-input"
                className="mb-2 block text-[13px] font-semibold"
                style={{ color: 'var(--c-text)' }}
              >
                What happened on site?
              </label>
              <textarea
                id="log-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe the activity, location, equipment and what changed..."
                rows={5}
                className="w-full resize-none rounded-[12px] p-4 text-[14px] leading-relaxed transition-colors duration-150"
                style={{
                  background: 'var(--c-page)',
                  border: '1.5px solid var(--c-border)',
                  color: 'var(--c-text)',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
              />
            </div>

            {/* Helper chips */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Quick context
              </p>
              <div className="flex flex-wrap gap-2">
                {['Activity started', 'Activity completed', 'Work on hold'].map((chip) => (
                  <button
                    key={chip}
                    className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150"
                    style={{
                      background: 'var(--c-page)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,111,41,0.4)'
                      ;(e.currentTarget as HTMLElement).style.color = '#F46F29'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--c-muted)'
                    }}
                    onClick={() => {
                      const suffix = ` ${chip.toLowerCase()}.`
                      if (!inputText.toLowerCase().includes(chip.toLowerCase())) {
                        setInputText((t) => t.trimEnd() + suffix)
                      }
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Evidence */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-3 text-[12px] font-semibold" style={{ color: 'var(--c-muted)', letterSpacing: '0.02em' }}>
                Add Evidence <span style={{ color: 'var(--c-subtle)', fontWeight: 400 }}>— optional</span>
              </p>
              <div className="flex gap-2">
                {[
                  { icon: Camera, label: 'Photo' },
                  { icon: FileText, label: 'Document' },
                  { icon: StickyNote, label: 'Note' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[12px] font-medium transition-colors duration-150"
                    style={{
                      background: 'var(--c-card)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border-strong)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)'
                    }}
                  >
                    <Icon size={13} strokeWidth={2} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROCESSING ───────────────────────────────────────── */}
        {step === 'processing' && (
          <div className="flex flex-col gap-5">
            {/* Original statement */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-2 text-[10px] font-semibold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>
                Your update
              </p>
              <p className="text-[14px] italic leading-relaxed" style={{ color: 'var(--c-text)' }}>
                "{inputText}"
              </p>
            </div>

            {/* Processing steps */}
            <div>
              <p className="mb-4 text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>
                Understanding update
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Activity identified',
                  'Event identified',
                  'Equipment identified',
                  'Checking project context',
                ].map((label, i) => {
                  const done = processingStep > i + 1
                  const active = processingStep === i + 1
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3"
                      style={{
                        opacity: processingStep >= i + 1 ? 1 : 0.35,
                        transition: 'opacity 300ms',
                      }}
                    >
                      <StepIcon done={done} active={active} />
                      <span
                        className="text-[14px]"
                        style={{
                          color: done ? 'var(--c-text)' : active ? 'var(--c-text)' : 'var(--c-muted)',
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        {done ? <span style={{ color: '#16A34A' }}>✓</span> : active ? '→ '  : ''}{label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CLARIFICATION ────────────────────────────────────── */}
        {step === 'clarification' && (
          <div className="flex flex-col gap-5">
            {/* Original */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-1.5 text-[10px] font-semibold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>
                Your update
              </p>
              <p className="text-[13px] italic" style={{ color: 'var(--c-muted)' }}>"{inputText}"</p>
            </div>

            {/* Detected */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-3 text-[11px] font-semibold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Detected
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Activity', value: 'Pump P-204 alignment' },
                  { label: 'Event', value: 'Actual Start' },
                  { label: 'Equipment', value: 'P-204' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-20 text-[12px]" style={{ color: 'var(--c-muted)' }}>{label}</span>
                    <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                      <Check size={12} strokeWidth={2.5} style={{ color: '#16A34A' }} />
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question */}
            <div>
              <p className="mb-3 text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
                Which project area did this occur in?
              </p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((area) => {
                  const selected = selectedArea === area
                  return (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area === selectedArea ? null : area)}
                      className="rounded-[10px] px-4 py-2.5 text-[13px] font-medium transition-all duration-150"
                      style={{
                        background: selected ? 'rgba(244,111,41,0.12)' : 'var(--c-page)',
                        border: selected ? '1.5px solid rgba(244,111,41,0.45)' : '1.5px solid var(--c-border)',
                        color: selected ? '#F46F29' : 'var(--c-text)',
                      }}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>

              {selectedArea === "I don't know" && (
                <div
                  className="mt-4 rounded-[10px] p-3.5"
                  style={{ background: 'rgba(244,111,41,0.06)', border: '1px solid rgba(244,111,41,0.2)' }}
                >
                  <p className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                    <span style={{ fontWeight: 600 }}>That's okay.</span> The update can still be recorded and may require planner review before it affects the schedule.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STRUCTURED ACTUAL PREVIEW ─────────────────────────── */}
        {step === 'structured' && (
          <div className="flex flex-col gap-5">
            {/* Actual Event */}
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: '1px solid var(--c-border)' }}
            >
              <div
                className="px-4 py-3"
                style={{ background: 'var(--c-page)', borderBottom: '1px solid var(--c-border)' }}
              >
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>
                  Actual Event
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--c-border)' }}>
                {[
                  { label: 'Activity', value: 'Pump P-204 alignment', inferred: false },
                  { label: 'Event', value: 'Actual Start', inferred: false },
                  { label: 'Discipline', value: 'Rotating Equipment', inferred: true },
                  { label: 'Area', value: selectedArea && selectedArea !== "I don't know" ? selectedArea : 'Not reported', inferred: false },
                  { label: 'Equipment', value: 'P-204', inferred: false },
                  { label: 'Reported Time', value: 'Morning · 28 Aug 2026', inferred: false },
                ].map(({ label, value, inferred }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 px-4 py-3"
                    style={{ background: 'var(--c-card)' }}
                  >
                    <span
                      className="w-32 shrink-0 text-[12px]"
                      style={{ color: 'var(--c-muted)' }}
                    >
                      {label}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      {editingField === label ? (
                        <input
                          autoFocus
                          defaultValue={value}
                          className="flex-1 rounded-[6px] px-2 py-1 text-[13px]"
                          style={{
                            background: 'var(--c-page)',
                            border: '1px solid rgba(244,111,41,0.4)',
                            color: 'var(--c-text)',
                            outline: 'none',
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        />
                      ) : (
                        <span className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
                          {value}
                        </span>
                      )}
                      {inferred && editingField !== label && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: 'rgba(244,111,41,0.10)',
                            color: '#D97706',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Inferred
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingField(editingField === label ? null : label)}
                      className="text-[11px] font-medium transition-opacity duration-150 hover:opacity-70"
                      style={{ color: 'var(--c-subtle)' }}
                    >
                      {editingField === label ? 'Done' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Original statement */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>
                Original Statement
              </p>
              <p className="text-[13px] italic leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                "{inputText}"
              </p>
            </div>
          </div>
        )}

        {/* ── MATCH PROCESSING ─────────────────────────────────── */}
        {step === 'match-processing' && (
          <div className="flex flex-col gap-5">
            <p className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>
              Finding schedule activity
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Checking equipment reference',
                'Checking discipline',
                'Checking area',
                'Comparing schedule terminology',
                'Ranking candidates',
              ].map((label, i) => {
                const done = matchStep > i + 1
                const active = matchStep === i + 1
                return (
                  <div
                    key={label}
                    className="flex items-center gap-3"
                    style={{
                      opacity: matchStep >= i + 1 ? 1 : 0.3,
                      transition: 'opacity 300ms',
                    }}
                  >
                    <StepIcon done={done} active={active} />
                    <span
                      className="text-[14px]"
                      style={{
                        color: done ? 'var(--c-text)' : active ? 'var(--c-text)' : 'var(--c-muted)',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── MATCH PREVIEW ────────────────────────────────────── */}
        {step === 'match-preview' && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em' }}>
                Likely Schedule Match
              </p>
              <p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>
                SENTINEL matched your update to the following activity.
              </p>
            </div>

            {/* AI Suggested card — distinct from Verified */}
            <div
              className="rounded-[14px] p-5"
              style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1.5px dashed rgba(217,119,6,0.35)',
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
                  style={{
                    background: 'rgba(245,158,11,0.15)',
                    color: '#D97706',
                    letterSpacing: '0.08em',
                    border: '1px solid rgba(217,119,6,0.3)',
                  }}
                >
                  AI Suggested
                </span>
                <div className="text-right">
                  <span
                    className="text-[22px] font-bold"
                    style={{ color: '#D97706', fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    93%
                  </span>
                  <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Strong match</p>
                </div>
              </div>
              <p
                className="text-[16px] font-bold tracking-[-0.01em]"
                style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
              >
                {ACTIVITIES[0].label}
              </p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                {ACTIVITIES[0].tier} · {ACTIVITIES[0].discipline} · {ACTIVITIES[0].area}
              </p>
            </div>

            {/* Why this match */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <p className="mb-3 text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
                Why this match?
              </p>
              <div className="flex flex-col gap-2">
                {['Equipment P-204', 'Rotating Equipment', 'Utility Block', 'Strong terminology match'].map((sig) => (
                  <div key={sig} className="flex items-center gap-2">
                    <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#16A34A' }} />
                    <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives */}
            <div
              className="rounded-[12px] overflow-hidden"
              style={{ border: '1px solid var(--c-border)' }}
            >
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                style={{ background: 'var(--c-page)' }}
                onClick={() => setShowAlternatives((v) => !v)}
              >
                <span className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  2 alternative matches
                </span>
                {showAlternatives ? (
                  <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
                ) : (
                  <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />
                )}
              </button>
              {showAlternatives && (
                <div
                  className="divide-y"
                  style={{ borderColor: 'var(--c-border)' }}
                >
                  {ACTIVITIES.slice(1).map((alt) => (
                    <div
                      key={alt.id}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ background: 'var(--c-card)' }}
                    >
                      <div>
                        <p
                          className="text-[12px] font-semibold"
                          style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                        >
                          {alt.label}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                          {alt.tier} · {alt.discipline} · {alt.area}
                        </p>
                      </div>
                      <span
                        className="text-[14px] font-bold"
                        style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {alt.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="flex flex-col items-center py-8 text-center gap-5">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'rgba(22, 163, 74, 0.12)' }}
            >
              <CheckCircle2 size={28} strokeWidth={1.5} style={{ color: '#16A34A' }} />
            </div>
            <div>
              <h3
                className="text-[20px] font-bold tracking-[-0.02em]"
                style={{ color: 'var(--c-text)' }}
              >
                Progress submitted
              </h3>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--c-muted)' }}>
                Your execution update has been recorded.
              </p>
            </div>

            <div
              className="w-full rounded-[14px] p-5 text-left"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <div className="mb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>Status</span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706' }}
                  >
                    Awaiting Review
                  </span>
                </div>
                <div
                  className="h-px"
                  style={{ background: 'var(--c-border)' }}
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>Likely Match</span>
                  <span
                    className="text-right text-[12px] font-semibold"
                    style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                  >
                    EQUIPMENT ALIGNMENT — P-204
                  </span>
                </div>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
                This relationship will follow the project's review policy before becoming verified schedule truth.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 pt-2">
              <button
                className="w-full rounded-[10px] py-2.5 text-[14px] font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--c-page)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-text)',
                }}
              >
                View Actual
              </button>
              <button
                onClick={() => {
                  setStep('input')
                  setSelectedArea(null)
                  setInputText('')
                }}
                className="w-full rounded-[10px] py-2.5 text-[14px] font-semibold transition-opacity hover:opacity-80"
                style={{ color: '#F46F29' }}
              >
                Log Another Update
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {step !== 'success' && step !== 'processing' && step !== 'match-processing' && (
        <div
          style={{
            flexShrink: 0,
            padding: '16px 24px',
            borderTop: '1px solid var(--c-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--c-card)',
          }}
        >
          {/* Left action */}
          {step === 'input' ? (
            <button
              onClick={onClose}
              className="rounded-[10px] px-4 py-2.5 text-[14px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="rounded-[10px] px-4 py-2.5 text-[14px] font-medium transition-colors duration-150"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-muted)',
              }}
            >
              Back
            </button>
          )}

          {/* Right action */}
          <div className="flex items-center gap-3">
            {step === 'match-preview' && (
              <p className="text-right text-[11px]" style={{ color: 'var(--c-subtle)', maxWidth: 220 }}>
                This relationship will follow the project's review policy before becoming verified schedule truth.
              </p>
            )}
            <button
              onClick={() => {
                if (step === 'structured') handleContinue()
                else if (step === 'match-preview') handleContinue()
                else handleContinue()
              }}
              disabled={step === 'clarification' && !selectedArea}
              className="rounded-[10px] px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                boxShadow: '0 2px 10px rgba(244,111,41,0.28)',
                letterSpacing: '-0.01em',
              }}
            >
              {step === 'structured' ? 'Confirm Actual' : step === 'match-preview' ? 'Submit Progress' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div
          style={{
            flexShrink: 0,
            padding: '16px 24px',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          <button
            onClick={handleDone}
            className="w-full rounded-[10px] py-2.5 text-[14px] font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 10px rgba(244,111,41,0.28)',
            }}
          >
            Done
          </button>
        </div>
      )}
    </Drawer>
  )
}
