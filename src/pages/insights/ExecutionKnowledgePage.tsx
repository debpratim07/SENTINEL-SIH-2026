import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChevronRight, ArrowLeft, Database, CheckCircle2, AlertTriangle } from 'lucide-react'

// ── Colors ────────────────────────────────────────────────────────────────────

const GREEN  = '#16A34A'
const ORANGE = '#F46F29'
const AMBER  = '#D97706'
const RED    = '#DC2626'
const SLATE  = '#94A3B8'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pattern {
  id: string
  name: string
  discipline: string
  samples: number
  bottlenecks: number
  avgDelay: string
  // C1: remove riskScore; use observedCategory instead
  observedCategory: 'Well documented' | 'Frequently delayed' | 'On target'
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PATTERNS: Pattern[] = [
  { id: 'erect-line',    name: 'ERECT LINE',                  discipline: 'Piping',             samples: 18, bottlenecks: 3, avgDelay: '+1.2d', observedCategory: 'Frequently delayed' },
  { id: 'pipe-support',  name: 'PIPE SUPPORT INSTALLATION',   discipline: 'Piping',             samples: 14, bottlenecks: 2, avgDelay: '+2.1d', observedCategory: 'Frequently delayed' },
  { id: 'equip-align',   name: 'EQUIPMENT ALIGNMENT',         discipline: 'Rotating Equipment', samples: 11, bottlenecks: 1, avgDelay: '+0.8d', observedCategory: 'Well documented'    },
  { id: 'hydrotest',     name: 'HYDROTEST',                   discipline: 'Piping',             samples: 9,  bottlenecks: 2, avgDelay: '+1.5d', observedCategory: 'Frequently delayed' },
  { id: 'grout-found',   name: 'GROUTING FOUNDATIONS',        discipline: 'Civil',              samples: 8,  bottlenecks: 1, avgDelay: '+0.5d', observedCategory: 'On target'          },
  { id: 'cable-pull',    name: 'CABLE PULLING',               discipline: 'Electrical',         samples: 7,  bottlenecks: 1, avgDelay: '+1.2d', observedCategory: 'Well documented'    },
]

const OBS_CONFIG: Record<string, { color: string; bg: string }> = {
  'Frequently delayed': { color: AMBER,  bg: 'rgba(217,119,6,0.10)'   },
  'Well documented':    { color: GREEN,  bg: 'rgba(22,163,74,0.09)'   },
  'On target':          { color: SLATE,  bg: 'rgba(100,116,139,0.10)' },
}

// C2: Correct ERECT LINE hero values
const ERECT_LINE_DURATION_DATA = [
  { label: 'Planned',  value: 6.2, color: SLATE  },
  { label: 'Observed', value: 7.4, color: ORANGE },
]

// C3: Correct bottleneck counts (9 of 18, not 12 of 18)
const ERECT_LINE_BOTTLENECKS = [
  {
    name: 'Final bolt tightening',
    frequency: '9 / 18 verified samples',
    note: 'Frequently reported alongside late-stage completion delay. Association is observed — causality is not confirmed.',
  },
  {
    name: 'Weld inspection hold',
    frequency: '8 / 18 verified samples',
    note: 'Third-party inspection scheduling gap observed in completion records.',
  },
  {
    name: 'Fit-up re-work',
    frequency: '5 / 18 verified samples',
    note: 'Tolerance non-conformance resolved before sign-off in observed records.',
  },
]

// C5: Simplified historical execution sequence
const ERECT_LINE_SEQUENCE = [
  'Material readiness',
  'Spool positioning',
  'Erection',
  'Alignment',
  'Bolt tightening',
  'Completion',
]

const ERECT_LINE_FIELD_LANGUAGE = [
  '"Tightening bolts"',
  '"Final tighten"',
  '"Torquing complete"',
  '"Bolts done"',
  '"NDT release"',
  '"Fit-up rework"',
]

// ── Shared components ─────────────────────────────────────────────────────────

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}>
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c-text)' }}>{title}</h3>
        {sub && <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-[12px] p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}>
      <div className="mb-1 text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{label}</div>
      <div className="text-[22px] font-bold leading-[28px] tracking-[-0.02em]" style={{ color: color ?? 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{value}</div>
      <div className="mt-1 text-[11px]" style={{ color: 'var(--c-muted)' }}>{sub}</div>
    </div>
  )
}

// ── Pattern list row ──────────────────────────────────────────────────────────

function PatternRow({ pattern, onClick }: { pattern: Pattern; onClick: () => void }) {
  const oCfg = OBS_CONFIG[pattern.observedCategory]
  return (
    <tr
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="cursor-pointer"
      style={{ borderBottom: '1px solid var(--c-border)' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-brand-tint)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
    >
      {/* C6: Use system font for pattern names, not monospace */}
      <td className="px-4 py-3">
        <div className="text-[13px] font-semibold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{pattern.name}</div>
        <div className="mt-0.5 text-[10px]" style={{ color: 'var(--c-subtle)' }}>{pattern.discipline}</div>
      </td>
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{pattern.samples}</td>
      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{pattern.bottlenecks}</td>
      <td className="px-4 py-3 text-[12px] font-semibold" style={{ color: RED, fontFamily: 'var(--font-data)' }}>{pattern.avgDelay}</td>
      <td className="px-4 py-3">
        <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold" style={{ background: oCfg.bg, color: oCfg.color }}>
          {pattern.observedCategory}
        </span>
      </td>
      <td className="px-4 py-3">
        <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--c-subtle)' }} />
      </td>
    </tr>
  )
}

// ── Pattern list view ─────────────────────────────────────────────────────────

function PatternList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-2 rounded-[10px] px-4 py-3"
        style={{ background: 'var(--c-brand-tint)', border: '1px solid rgba(244,111,41,0.15)' }}>
        <Database size={14} strokeWidth={2} style={{ color: ORANGE, flexShrink: 0, marginTop: 1 }} />
        <p className="text-[12px]" style={{ color: 'var(--c-text)' }}>
          <strong>Execution Knowledge is historical observation from verified Actual Events.</strong>{' '}
          Patterns describe what has been observed in completed work — they are not predictions, schedule modifications,
          or AI inferences applied forward. All samples are human-verified Actual Events.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <KpiTile label="Verified Samples" value="1,042" sub="Human-verified Actual Events" color={GREEN} />
        <KpiTile label="Patterns Identified" value="36" sub="Recurring activity sequences" />
        <KpiTile label="Bottlenecks Documented" value="8" sub="Observed completion delays" color={AMBER} />
        <KpiTile label="Disciplines Covered" value="6" sub="Activities with ≥5 samples" />
      </div>

      <SectionCard title="Activity Patterns" sub="Recurring patterns in verified execution history. Click to view detail.">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: 540 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                {['ACTIVITY PATTERN','SAMPLES','BOTTLENECKS','AVG DELAY','OBSERVED',''].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATTERNS.map((p) => (
                <PatternRow key={p.id} pattern={p} onClick={() => onSelect(p.id)} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
          Average delay measured against planned finish from verified Actual Events only.
          Not used to automatically adjust schedule or predict future performance.
        </p>
      </SectionCard>
    </div>
  )
}

// ── Pattern detail ────────────────────────────────────────────────────────────

function PatternDetail({ patternId, onBack }: { patternId: string; onBack: () => void }) {
  const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0]
  const isErectLine = patternId === 'erect-line'
  const oCfg = OBS_CONFIG[pattern.observedCategory]

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
        <button onClick={onBack} className="font-medium hover:opacity-70 flex items-center gap-1">
          <ArrowLeft size={12} strokeWidth={2} />
          Execution Knowledge
        </button>
        <ChevronRight size={12} strokeWidth={2} />
        {/* C6: system font for main pattern title */}
        <span style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{pattern.name}</span>
      </nav>

      {/* Header — C6: system font, no monospace for main title */}
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>
            {pattern.name}
          </h2>
          {/* C1: Replace "High Risk" with "Historical Pattern" */}
          <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold" style={{ background: oCfg.bg, color: oCfg.color }}>
            Historical Pattern
          </span>
        </div>
        <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
          {pattern.discipline} · {pattern.samples} verified samples
        </p>
      </div>

      {/* C4: Correct trust wording */}
      <div className="flex items-start gap-3 rounded-[12px] px-4 py-3"
        style={{ background: 'var(--c-brand-tint)', border: '1px solid rgba(244,111,41,0.15)' }}>
        <CheckCircle2 size={14} strokeWidth={2} style={{ color: GREEN, flexShrink: 0, marginTop: 1 }} />
        <p className="text-[12px]" style={{ color: 'var(--c-text)' }}>
          This pattern is derived from <strong>{pattern.samples} human-verified Actual Events</strong> and their verified schedule relationships.
          It reflects observed execution history only and is not an automatic forecast or schedule recommendation.
        </p>
      </div>

      {/* C2: Correct KPI values for ERECT LINE */}
      <div className="flex flex-wrap gap-3">
        <KpiTile label="Verified Samples" value={String(pattern.samples)} sub="Human-verified events" color={GREEN} />
        <KpiTile label="Avg Planned Duration" value={isErectLine ? '6.2 days' : `${(pattern.samples * 0.4).toFixed(1)} days`} sub="From verified schedule" />
        <KpiTile label="Avg Observed Actual" value={isErectLine ? '7.4 days' : `${(pattern.samples * 0.46).toFixed(1)} days`} sub="From verified actuals" color={ORANGE} />
        <KpiTile label="Observed Variance" value={isErectLine ? '+1.2 days' : pattern.avgDelay} sub="Planned vs observed" color={AMBER} />
        <KpiTile label="Completed Within Plan" value={isErectLine ? '39%' : '55%'} sub="Of verified samples" />
      </div>

      {/* C7: Planned vs Observed Duration chart */}
      <SectionCard title="Planned vs Observed Duration" sub="Historical observation only — not a prediction.">
        <div className="mb-3 flex items-baseline gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Planned</div>
            <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>{isErectLine ? '6.2' : (pattern.samples * 0.4).toFixed(1)} days</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Observed Actual</div>
            <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: ORANGE }}>{isErectLine ? '7.4' : (pattern.samples * 0.46).toFixed(1)} days</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Difference</div>
            <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: AMBER }}>+{isErectLine ? '1.2' : '0.8'} days</div>
          </div>
        </div>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={isErectLine ? ERECT_LINE_DURATION_DATA : [
              { label: 'Planned', value: parseFloat((pattern.samples * 0.4).toFixed(1)), color: SLATE },
              { label: 'Observed', value: parseFloat((pattern.samples * 0.46).toFixed(1)), color: ORANGE },
            ]} margin={{ top: 4, right: 24, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--c-muted)', fontFamily: 'var(--font-ui)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}d`} />
              <Tooltip
                formatter={(v) => [`${v} days`, 'Duration']}
                contentStyle={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {(isErectLine ? ERECT_LINE_DURATION_DATA : [{ color: SLATE }, { color: ORANGE }]).map((d, i) => (
                  <Cell key={i} fill={d.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
          Based on {pattern.samples} verified samples. Historical observation — not a forecast or schedule estimate.
        </p>
      </SectionCard>

      {/* Bottlenecks — C3: 9 of 18 */}
      <SectionCard title="Observed Bottlenecks" sub="Recurring delay or interruption points seen in verified completion records.">
        <div className="flex flex-col gap-3">
          {(isErectLine ? ERECT_LINE_BOTTLENECKS : [
            { name: `${pattern.name} — primary hold`, frequency: `${Math.floor(pattern.samples * 0.55)} / ${pattern.samples} verified samples`, note: 'Most common delay in this activity type.' },
            { name: 'Inspection sign-off gap', frequency: `${Math.floor(pattern.samples * 0.4)} / ${pattern.samples} verified samples`, note: 'Third-party scheduling gap.' },
          ]).map((b) => (
            <div key={b.name} className="rounded-[10px] p-3" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-[12px] font-semibold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{b.name}</span>
                <span className="text-[11px]" style={{ color: AMBER, fontFamily: 'var(--font-data)' }}>{b.frequency}</span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>{b.note}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* C5: Simplified execution sequence */}
      {isErectLine && (
        <SectionCard title="Common Observed Sequence" sub="Observed across verified historical records. Individual activities may follow different execution sequences.">
          <ol className="flex flex-col gap-2">
            {ERECT_LINE_SEQUENCE.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: 'var(--c-brand-tint)', color: ORANGE, border: '1px solid rgba(244,111,41,0.25)' }}>
                  {i + 1}
                </div>
                {i < ERECT_LINE_SEQUENCE.length - 1 && (
                  <>
                    {/* C6: system font for sequence steps */}
                    <span className="text-[13px]" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{step}</span>
                    <ChevronRight size={12} strokeWidth={2} style={{ color: 'var(--c-subtle)' }} />
                  </>
                )}
                {i === ERECT_LINE_SEQUENCE.length - 1 && (
                  <span className="text-[13px]" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{step}</span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
            Not a prescriptive engineering work method. Observed from {pattern.samples} verified historical records.
          </p>
        </SectionCard>
      )}

      {/* Field language — C6: plain text styling */}
      {isErectLine && (
        <SectionCard title="Field Language Observed" sub="Common phrasings seen in verified completion notes and reports.">
          <div className="flex flex-wrap gap-2">
            {ERECT_LINE_FIELD_LANGUAGE.map((phrase) => (
              <span key={phrase} className="rounded-[8px] px-3 py-1.5 text-[12px]"
                style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>
                {phrase}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>Language extracted verbatim from field completion records. Not normalised or inferred.</p>
        </SectionCard>
      )}

      {/* Traceability */}
      <SectionCard title="Traceability">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Pattern ID',    value: `EKP-${pattern.id.slice(0, 4).toUpperCase()}` },
            { label: 'Samples',       value: `${pattern.samples} verified` },
            { label: 'Last Updated',  value: '28 Aug 2026' },
            { label: 'Discipline',    value: pattern.discipline },
            { label: 'Review Status', value: 'Verified' },
            { label: 'Source',        value: 'Actual Event records' },
          ].map((r) => (
            <div key={r.label}>
              <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{r.label}</div>
              {/* C6: mono only for technical ID */}
              <div className="mt-0.5 text-[12px] font-semibold"
                style={{ color: 'var(--c-text)', fontFamily: r.label === 'Pattern ID' ? 'var(--font-data)' : 'var(--font-ui)' }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Schedule relevance disclaimer */}
      <div className="flex items-start gap-3 rounded-[12px] px-4 py-3" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
        <AlertTriangle size={14} strokeWidth={2} style={{ color: AMBER, flexShrink: 0, marginTop: 1 }} />
        <div>
          <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>Schedule Relevance</div>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            This execution pattern is provided as historical knowledge for informed decision-making.
            It does not automatically update schedule baselines, create forecast entries, or generate plan modifications.
            Any schedule changes must be initiated through the formal project controls change process.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ExecutionKnowledgePage() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null)

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 28px 48px' }}>
        {!selectedPatternId && (
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Execution Knowledge</h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Historical patterns derived from verified Actual Events. Not predictions.</p>
          </div>
        )}
        {selectedPatternId ? (
          <PatternDetail patternId={selectedPatternId} onBack={() => setSelectedPatternId(null)} />
        ) : (
          <PatternList onSelect={setSelectedPatternId} />
        )}
      </div>
    </div>
  )
}
