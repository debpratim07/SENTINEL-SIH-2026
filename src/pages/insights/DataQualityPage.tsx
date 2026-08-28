import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

// ── Colors ────────────────────────────────────────────────────────────────────

const GREEN  = '#16A34A'
const ORANGE = '#F46F29'
const AMBER  = '#D97706'
const RED    = '#DC2626'
const SLATE  = '#94A3B8'
const PURPLE = '#7C3AED'

function scoreColor(pct: number) {
  if (pct >= 90) return GREEN
  if (pct >= 75) return AMBER
  return RED
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color, icon }: {
  label: string; value: string; sub: string; color: string; icon?: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-0 rounded-[12px] p-4"
      style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{label}</span>
        {icon}
      </div>
      <div className="text-[22px] font-bold leading-[28px] tracking-[-0.02em]" style={{ color, fontFamily: 'var(--font-ui)' }}>{value}</div>
      <div className="mt-1 text-[11px]" style={{ color: 'var(--c-muted)' }}>{sub}</div>
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}>
      <div className="mb-1">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c-text)' }}>{title}</h3>
        {sub && <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>{sub}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

// ── Score row ─────────────────────────────────────────────────────────────────

function ScoreRow({ label, pct, note }: { label: string; pct: number; note: string }) {
  const color = scoreColor(pct)
  return (
    <div className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--c-border)' }}>
      <div className="w-44 flex-shrink-0">
        <div className="text-[12px] font-medium" style={{ color: 'var(--c-text)' }}>{label}</div>
        <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{note}</div>
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="relative flex-1 h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
          <div className="absolute left-0 top-0 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color, opacity: 0.85 }} />
        </div>
        <span className="w-10 text-right text-[12px] font-semibold flex-shrink-0" style={{ color, fontFamily: 'var(--font-data)' }}>{pct}%</span>
      </div>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

// B3: Use SENTINEL's established source types
const SOURCE_COV = [
  { source: 'Supervisor Updates',       pct: 92, color: GREEN },
  { source: 'Daily Progress Reports',   pct: 89, color: GREEN },
  { source: 'Spreadsheets',             pct: 74, color: AMBER },
  { source: 'Manual Entries',           pct: 68, color: AMBER },
  { source: 'Site Diaries',             pct: 83, color: GREEN },
]

const MISSING_DATA = [
  { label: 'Area',             count: 18 },
  { label: 'Line / Equipment', count: 14 },
  { label: 'Actual Date',      count: 7  },
  { label: 'Discipline',       count: 5  },
]

const UNMATCHED_REASONS = [
  { reason: 'No candidate within tolerance',  count: 22 },
  { reason: 'Activity label mismatch',        count: 14 },
  { reason: 'Date outside schedule window',   count: 8  },
  { reason: 'Missing line/equipment ID',      count: 4  },
]

// B4/B5: Correct reconciliation issues
const ISSUES = [
  {
    label: 'EQUIPMENT ALIGNMENT — P-204',
    sub: 'Rotating Equipment · Utility Block',
    issue: 'Conflicting Actual Start: 26 Aug 2026 vs 27 Aug 2026',
    severity: 'Conflict' as const,
  },
  {
    label: 'Material shifting near Area B',
    sub: '',
    issue: 'No safe schedule link — record is unmatched',
    severity: 'Unmatched' as const,
  },
  {
    label: 'PIPE SUPPORT — Area B (3 records)',
    sub: '',
    issue: 'Discipline not reported across batch',
    severity: 'Incomplete' as const,
  },
]

const SEV_CONFIG = {
  Conflict:   { color: RED,   bg: 'rgba(220,38,38,0.08)'   },
  Unmatched:  { color: SLATE, bg: 'rgba(100,116,139,0.09)' },
  Incomplete: { color: AMBER, bg: 'rgba(217,119,6,0.10)'   },
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DataQualityPage() {
  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 28px 48px' }}>

        <div className="mb-6">
          <h1 className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Data Quality</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
            Health of reported execution data — coverage, completeness, and reconciliation integrity.
          </p>
        </div>

        {/* Top metric cards */}
        <div className="mb-5 flex flex-wrap gap-3">
          <MetricCard
            label="Source Coverage"
            value="94%"
            sub="Events with a known reporting source"
            color={GREEN}
            icon={<CheckCircle2 size={14} strokeWidth={2} style={{ color: GREEN }} />}
          />
          {/* B2: Correct Match Confidence description */}
          <MetricCard
            label="Match Confidence"
            value="89%"
            sub="Average confidence across matched schedule candidates"
            color={GREEN}
          />
          <MetricCard
            label="Missing Data"
            value="4.2%"
            sub="Events with ≥1 required field absent"
            color={AMBER}
            icon={<AlertCircle size={14} strokeWidth={2} style={{ color: AMBER }} />}
          />
          <MetricCard
            label="Unmatched Rate"
            value="2.8%"
            sub="Events without a schedule match"
            color={AMBER}
          />
          <MetricCard
            label="Review Backlog"
            value="7"
            sub="Events awaiting human decision"
            color={RED}
            icon={<Info size={14} strokeWidth={2} style={{ color: RED }} />}
          />
        </div>

        {/* Quality breakdown */}
        <div className="mb-5">
          <SectionCard title="Data Quality Breakdown" sub="Scores across key quality dimensions. All values reflect the current reconciled dataset.">
            <div>
              {[
                { label: 'Evidence Coverage',   pct: 94, note: 'Events with a linked source document' },
                { label: 'Completeness',        pct: 96, note: 'Required fields present and non-null' },
                { label: 'Schedule Linkage',    pct: 91, note: 'Events matched to a plan activity' },
                { label: 'Review Health',       pct: 83, note: 'Verified or reviewed vs total' },
                // B1: "Conflict-Free Rate" not "Conflict Rate"
                { label: 'Conflict-Free Rate',  pct: 97, note: 'Execution records without unresolved conflicting values' },
                { label: 'Source Consistency',  pct: 88, note: 'Events with consistent multi-source data' },
              ].map((r) => <ScoreRow key={r.label} {...r} />)}
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Missing information */}
          <SectionCard title="Missing Information" sub="Count of Actual Events missing each required field.">
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MISSING_DATA} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-ui)' }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip
                    formatter={(v) => [v, 'Missing events']}
                    contentStyle={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: 'var(--c-muted)', fontSize: 10 }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18} fill={AMBER} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
              Missing fields are not treated as incorrect — data may not have been captured at time of reporting.
            </p>
          </SectionCard>

          {/* Unmatched analysis */}
          <SectionCard title="Unmatched Analysis" sub="48 total unmatched events. Why they could not be reconciled.">
            <div className="flex flex-col gap-2">
              {UNMATCHED_REASONS.map((r) => (
                <div key={r.reason} className="flex items-center gap-3">
                  <div className="flex-1 text-[12px]" style={{ color: 'var(--c-text)' }}>{r.reason}</div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-2 rounded-full" style={{ width: 80, background: 'var(--c-border)' }}>
                      <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${(r.count / 22) * 100}%`, background: SLATE, opacity: 0.6 }} />
                    </div>
                    <span className="w-6 text-right text-[11px] font-semibold" style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}>{r.count}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
              Unmatched ≠ not completed. Activities may have occurred outside the recorded schedule window or with label variations.
            </p>
          </SectionCard>

          {/* B3: Source coverage by SENTINEL source types */}
          <SectionCard title="Source Coverage by Type">
            <div className="flex flex-col gap-3">
              {SOURCE_COV.map((s) => (
                <div key={s.source} className="flex items-center gap-3">
                  <div className="w-44 flex-shrink-0 text-[12px]" style={{ color: 'var(--c-text)' }}>{s.source}</div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div className="relative flex-1 h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
                      <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.8 }} />
                    </div>
                    <span className="w-10 text-right text-[12px] font-semibold" style={{ color: s.color, fontFamily: 'var(--font-data)' }}>{s.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
              Source type alone does not determine trustworthiness. All sources require human verification to create trusted schedule relationships.
            </p>
          </SectionCard>

          {/* B4/B5: Corrected reconciliation issues */}
          <SectionCard title="Active Reconciliation Issues" sub="Top items requiring attention.">
            <div className="flex flex-col gap-3">
              {ISSUES.map((item) => {
                const cfg = SEV_CONFIG[item.severity]
                return (
                  <div key={item.label} className="rounded-[10px] p-3" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{item.label}</div>
                        {item.sub && <div className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>{item.sub}</div>}
                      </div>
                      <span className="flex-shrink-0 rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color, letterSpacing: '0.06em' }}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>{item.issue}</p>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </div>

        {/* B6: Corrected review health wording */}
        <div className="mt-5 flex items-start gap-3 rounded-[12px] p-4"
          style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <Info size={14} strokeWidth={2} style={{ color: PURPLE, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>Review Health</div>
            <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
              7 records are pending human review. AI-suggested matches are not treated as verified until an authorized reviewer approves them.
              Pending review records are excluded from official verified-only performance metrics until verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
