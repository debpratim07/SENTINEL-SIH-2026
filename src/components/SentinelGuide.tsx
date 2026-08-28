import { useState, useEffect, useRef } from 'react'
import { X, BookOpen, ChevronRight } from 'lucide-react'

// ── Contextual help content per page ─────────────────────────────────────────

interface GuideItem {
  question: string
  answer: string
  action?: { label: string; nav: string }
}

interface GuideSection {
  title: string
  items: GuideItem[]
}

const GUIDE_CONTENT: Record<string, GuideSection> = {
  'review-queue': {
    title: 'Review Queue',
    items: [
      {
        question: 'What does confidence mean?',
        answer: 'Confidence indicates how strongly the available execution evidence aligns with a schedule candidate. It does not mean the relationship has been verified. A high-confidence match still requires human review and approval before it affects schedule truth.',
        action: { label: 'Go to Review Queue', nav: 'review-queue' },
      },
      {
        question: 'When should I bulk verify?',
        answer: 'Bulk verification is only available for strong, complete matches where review policy allows it. Ambiguous or incomplete records must be individually reviewed.',
      },
      {
        question: "What happens after I verify?",
        answer: 'After a planner verifies a match, the Actual Event creates a trusted schedule relationship. The Schedule Mirror applies the verified dates. The action is recorded in the Audit Log.',
      },
    ],
  },
  exceptions: {
    title: 'Exceptions',
    items: [
      {
        question: 'Why is this schedule update blocked?',
        answer: 'This Actual Event contains conflicting field evidence. SENTINEL preserves both values and blocks the schedule update until an authorized reviewer resolves the conflict. No automatic resolution occurs.',
        action: { label: 'Open Exceptions', nav: 'exceptions' },
      },
      {
        question: 'What is an Unmatched exception?',
        answer: 'An Unmatched record is an Actual Event with no safe schedule link. It remains stored in SENTINEL without a forced schedule relationship. Unmatched does not mean the work did not happen.',
      },
      {
        question: 'Can SENTINEL resolve conflicts automatically?',
        answer: 'No. SENTINEL preserves both conflicting sources and blocks the schedule update. An authorized reviewer must make the resolution decision. The original evidence is always retained.',
      },
    ],
  },
  'data-quality': {
    title: 'Data Quality',
    items: [
      {
        question: 'What does Match Confidence mean?',
        answer: 'Match Confidence is the average confidence score across schedule candidates. It reflects how strongly evidence aligns with candidates — not whether a match has been verified or approved. Confidence is not approval.',
      },
      {
        question: 'What is the Conflict-Free Rate?',
        answer: 'The Conflict-Free Rate shows the percentage of execution records without unresolved conflicting values. A 97% rate means 3% of records have a conflict that needs resolution.',
      },
      {
        question: 'Does missing data mean work did not happen?',
        answer: 'No. Missing data means the information was not captured in the reporting source. Missing is not zero, and missing is not late. Data quality metrics are separate from performance metrics.',
      },
    ],
  },
  'exec-knowledge': {
    title: 'Execution Knowledge',
    items: [
      {
        question: 'Is Execution Knowledge a prediction?',
        answer: 'No. Execution Knowledge is historical observation from verified Actual Events. It reflects what has been recorded in completed work — not a forecast, AI inference, or schedule recommendation.',
      },
      {
        question: 'Does this automatically update the schedule?',
        answer: 'No. Execution Knowledge cannot modify schedule baselines or create forecast entries. Any schedule changes must go through the formal project controls change process.',
      },
    ],
  },
  actuals: {
    title: 'Actuals',
    items: [
      {
        question: 'What is an Actual Event?',
        answer: 'An Actual Event is a field execution record extracted from a reporting source. It captures what was observed in the field — not what was planned. Actuals become trusted schedule information only after human verification.',
      },
      {
        question: 'What does AI Suggested mean?',
        answer: 'AI Suggested means SENTINEL has proposed a schedule match but a human reviewer has not yet approved it. AI Suggested is not Verified. It does not affect schedule truth until a planner approves it.',
      },
    ],
  },
  performance: {
    title: 'Performance',
    items: [
      {
        question: 'What data is used for performance metrics?',
        answer: 'All performance values use verified Actual Events only. Unverified, AI-suggested, incomplete, or unmatched records are excluded from official metrics.',
      },
      {
        question: 'Does missing actual mean late?',
        answer: 'No. Missing Actual Start or Finish means the information was not reported. It is never treated as late. Missing and late are tracked separately.',
      },
    ],
  },
  dashboard: {
    title: 'Dashboard',
    items: [
      {
        question: 'How do I capture field progress?',
        answer: 'Use the Capture Progress button in the sidebar. You can log events directly with SENTINEL or upload a daily progress report for automated extraction.',
      },
      {
        question: 'What is the Review Backlog?',
        answer: 'The Review Backlog shows Actual Events pending human decision. These are excluded from performance metrics until a planner verifies or resolves them.',
      },
    ],
  },
}

const DEFAULT_GUIDE: GuideSection = {
  title: 'SENTINEL Guide',
  items: [
    {
      question: 'What is SENTINEL?',
      answer: 'SENTINEL is a field execution and schedule intelligence platform. It captures execution evidence, proposes schedule matches, and ensures only verified human decisions create trusted schedule relationships.',
    },
    {
      question: 'How does trust work in SENTINEL?',
      answer: 'Evidence is always preserved. Missing data is never fabricated. AI suggestions are not treated as verified. Only authorized human review creates trusted schedule relationships.',
    },
    {
      question: 'What cannot SENTINEL Guide do?',
      answer: 'The Guide cannot verify matches, resolve conflicts, modify schedule truth, delete evidence, or change administration settings. It provides information and navigation help only.',
    },
  ],
}

interface Props {
  open: boolean
  onClose: () => void
  currentPage: string
  onNavigate: (nav: string) => void
}

export default function SentinelGuide({ open, onClose, currentPage, onNavigate }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)
  const ref = useRef<HTMLDivElement>(null)

  const section = GUIDE_CONTENT[currentPage] ?? DEFAULT_GUIDE

  useEffect(() => {
    setExpandedIdx(0)
  }, [currentPage])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.18)' }}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={ref}
        role="dialog"
        aria-label="SENTINEL Guide"
        aria-modal="true"
        style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, zIndex: 95,
          background: 'var(--c-card)', borderLeft: '1px solid var(--c-border)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.14)', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ background: 'var(--c-brand-tint)' }}>
              <BookOpen size={15} strokeWidth={2} style={{ color: '#F46F29' }} />
            </div>
            <div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>SENTINEL Guide</div>
              <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Contextual workflow help</div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Close guide"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-page)' }}>
          <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
            Context
          </div>
          <div className="mt-0.5 text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
            {section.title}
          </div>
        </div>

        {/* Q&A items */}
        <div className="flex-1 overflow-auto px-5 py-4">
          <div className="flex flex-col gap-2">
            {section.items.map((item, i) => (
              <div
                key={item.question}
                className="rounded-[12px] overflow-hidden"
                style={{ border: '1px solid var(--c-border)' }}
              >
                <button
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  style={{ background: expandedIdx === i ? 'var(--c-brand-tint)' : 'transparent' }}
                  aria-expanded={expandedIdx === i}
                >
                  <span className="text-[13px] font-semibold" style={{ color: expandedIdx === i ? '#F46F29' : 'var(--c-text)' }}>
                    {item.question}
                  </span>
                  <ChevronRight
                    size={13} strokeWidth={2}
                    style={{
                      color: expandedIdx === i ? '#F46F29' : 'var(--c-subtle)',
                      flexShrink: 0,
                      transform: expandedIdx === i ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 150ms',
                    }}
                  />
                </button>
                {expandedIdx === i && (
                  <div className="px-4 pb-4 pt-1">
                    <p className="text-[13px] leading-[20px]" style={{ color: 'var(--c-muted)' }}>
                      {item.answer}
                    </p>
                    {item.action && (
                      <button
                        onClick={() => { onNavigate(item.action!.nav); onClose() }}
                        className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold hover:underline"
                        style={{ color: '#F46F29' }}
                      >
                        {item.action.label}
                        <ChevronRight size={11} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Restrictions notice */}
          <div className="mt-4 rounded-[10px] px-4 py-3" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
            <div className="mb-1.5 text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
              What Guide cannot do
            </div>
            <ul className="flex flex-col gap-1">
              {['Verify or approve matches', 'Resolve conflicts', 'Modify schedule truth', 'Delete evidence', 'Change admin settings'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--c-muted)' }}>
                  <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: 'var(--c-subtle)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
