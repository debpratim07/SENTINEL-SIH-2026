import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import { ChevronRight, TrendingDown, TrendingUp, Minus, ArrowLeft } from 'lucide-react'
import { planVsActualData } from '../../data/mockData'
import { disciplineData } from '../../data/mockData'

// ── Design tokens / helpers ───────────────────────────────────────────────────

const ORANGE = '#F46F29'
const SLATE  = '#94A3B8'
const GREEN  = '#16A34A'
const RED    = '#DC2626'

function verifiedTag() {
  return (
    <span
      className="rounded-[5px] px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: 'rgba(22,163,74,0.09)', color: GREEN }}
    >
      Verified actuals only
    </span>
  )
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function PlanActualTooltip({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-[10px] px-3 py-2.5 text-[12px]"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-elevated)',
        minWidth: 130,
      }}
    >
      <div className="mb-1.5 text-[10px] font-semibold uppercase" style={{ color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
        {label}
      </div>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
            <span
              className="inline-block h-1.5 w-3 rounded-full"
              style={{ background: e.color }}
            />
            {e.name === 'plan' ? 'Plan' : 'Actual'}
          </span>
          <span className="font-semibold" style={{ color: e.name === 'actual' ? ORANGE : 'var(--c-text)', fontFamily: 'var(--font-data)' }}>
            {e.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ── KPI tile ──────────────────────────────────────────────────────────────────

function KpiTile({
  label, value, sub, valueColor,
}: {
  label: string; value: string; sub: string; valueColor?: string
}) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[12px] p-4"
      style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}
    >
      <div className="mb-1 text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div
        className="text-[22px] font-bold leading-[28px] tracking-[-0.02em]"
        style={{ color: valueColor ?? 'var(--c-text)', fontFamily: 'var(--font-ui)' }}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px]" style={{ color: 'var(--c-muted)' }}>
        {sub}
      </div>
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] p-5"
      style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--c-text)' }}>
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  )
}

// ── Variance bar chart data ───────────────────────────────────────────────────

const varianceData = [
  { date: 'Aug 1',  variance: 2 },
  { date: 'Aug 8',  variance: 1 },
  { date: 'Aug 15', variance: -1 },
  { date: 'Aug 22', variance: -2 },
  { date: 'Aug 28', variance: -2.8 },
]

// ── Execution timing data ─────────────────────────────────────────────────────

const TIMING_ROWS = [
  { label: 'Started On Time',        count: 143, pct: 62, color: GREEN,  dim: false },
  { label: 'Started Late',           count: 23,  pct: 10, color: RED,    dim: false },
  { label: 'Finished On Time',       count: 89,  pct: 39, color: GREEN,  dim: false },
  { label: 'Finished Late',          count: 11,  pct: 5,  color: RED,    dim: false },
  { label: 'Missing Actual Start',   count: 64,  pct: 28, color: SLATE,  dim: true  },
  { label: 'Missing Actual Finish',  count: 87,  pct: 38, color: SLATE,  dim: true  },
]

function TimingBar({ label, count, pct, color, dim }: {
  label: string; count: number; pct: number; color: string; dim: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-44 flex-shrink-0 text-[12px]" style={{ color: dim ? 'var(--c-muted)' : 'var(--c-text)' }}>
        {label}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="relative flex-1 h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
          <div
            className="absolute left-0 top-0 h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color, opacity: dim ? 0.45 : 0.85 }}
          />
        </div>
        <span
          className="w-8 text-right text-[11px] font-semibold flex-shrink-0"
          style={{ color: dim ? 'var(--c-subtle)' : color, fontFamily: 'var(--font-data)' }}
        >
          {count}
        </span>
      </div>
    </div>
  )
}

// ── Discipline table row ──────────────────────────────────────────────────────

interface DisciplineRowData {
  name: string; plan: number; actual: number; variance: number
}

function DisciplineTableRow({
  row, onClick,
}: {
  row: DisciplineRowData; onClick: () => void
}) {
  const ahead = row.variance > 0
  const behind = row.variance < -3
  const status = ahead ? 'Ahead' : behind ? 'Behind' : 'Slightly Behind'
  const statusColor = ahead ? GREEN : behind ? RED : '#B45309'
  const statusBg = ahead ? 'rgba(22,163,74,0.09)' : behind ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.10)'

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
      <td className="px-4 py-3 text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
        {row.name}
      </td>
      <td className="px-4 py-3 text-[13px]" style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}>
        {row.plan}%
      </td>
      <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: ORANGE, fontFamily: 'var(--font-data)' }}>
        {row.actual}%
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {ahead ? (
            <TrendingUp size={12} strokeWidth={2} style={{ color: GREEN }} />
          ) : row.variance === 0 ? (
            <Minus size={12} strokeWidth={2} style={{ color: SLATE }} />
          ) : (
            <TrendingDown size={12} strokeWidth={2} style={{ color: RED }} />
          )}
          <span
            className="text-[13px] font-semibold"
            style={{ color: ahead ? GREEN : row.variance === 0 ? 'var(--c-muted)' : RED, fontFamily: 'var(--font-data)' }}
          >
            {row.variance > 0 ? '+' : ''}{row.variance}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: statusBg, color: statusColor }}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <ChevronRight size={13} strokeWidth={2} style={{ color: 'var(--c-subtle)' }} />
      </td>
    </tr>
  )
}

// ── PROJECT TAB ───────────────────────────────────────────────────────────────

function ProjectTab({ onSelectDiscipline }: { onSelectDiscipline: (name: string) => void }) {
  const lastPoint = planVsActualData[planVsActualData.length - 1]

  return (
    <div className="flex flex-col gap-5">
      {/* KPI tiles */}
      <div className="flex flex-wrap gap-3">
        <KpiTile
          label="Overall Progress"
          value="68.4%"
          sub="Plan 71.2% · Variance −2.8%"
          valueColor={ORANGE}
        />
        <KpiTile label="Started Late" value="23" sub="5 require attention" />
        <KpiTile label="Finished Late" value="11" sub="3 over 5 days" />
        <KpiTile label="Verified Actuals" value="1,042" sub="81.2% of reported events" valueColor={GREEN} />
        <KpiTile label="Review Backlog" value="7" sub="3 low confidence" />
      </div>

      <div className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
        All performance values use verified Actual Events only. Unverified, AI-suggested, incomplete,
        or unmatched records are excluded from official metrics.
      </div>

      {/* Plan vs Actual */}
      <SectionCard title="Plan vs Actual Progress" right={verifiedTag()}>
        <div style={{ marginBottom: 8 }}>
          <div className="flex items-baseline gap-4">
            <div>
              <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Actual</span>
              <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: ORANGE, fontFamily: 'var(--font-ui)' }}>
                68.4%
              </div>
            </div>
            <div className="h-8 w-px" style={{ background: 'var(--c-border)' }} />
            <div>
              <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Plan</span>
              <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>
                71.2%
              </div>
            </div>
            <div className="h-8 w-px" style={{ background: 'var(--c-border)' }} />
            <div>
              <span className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Variance</span>
              <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: '#D97706', fontFamily: 'var(--font-ui)' }}>
                −2.8%
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 200, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={planVsActualData} margin={{ top: 4, right: 12, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[30, 80]} tickCount={6} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<PlanActualTooltip />} cursor={{ stroke: 'var(--c-border-strong)', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="plan" stroke={SLATE} strokeWidth={1.5} strokeDasharray="5 4" dot={false} activeDot={false} />
              <Line type="monotone" dataKey="actual" stroke={ORANGE} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: ORANGE, stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" /></svg>
            Plan
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={ORANGE} strokeWidth="2" /></svg>
            Actual (verified)
          </span>
        </div>
      </SectionCard>

      {/* Variance trend */}
      <SectionCard title="Schedule Variance Trend" right={
        <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Aug 2026</span>
      }>
        <p className="mb-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Weekly execution variance from plan. Positive = ahead; negative = behind.
        </p>
        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={varianceData} margin={{ top: 4, right: 12, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tickCount={5} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke="var(--c-border-strong)" strokeWidth={1} />
              <Tooltip
                formatter={(v) => {
                  const n = Number(v)
                  const dir = n >= 0 ? 'ahead of plan' : 'behind plan'
                  return [`${Math.abs(n)}% ${dir}`, 'Variance']
                }}
                contentStyle={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: 'var(--c-muted)', fontSize: 10 }}
              />
              <Bar dataKey="variance" radius={[3, 3, 0, 0]} maxBarSize={36}>
                {varianceData.map((d, i) => (
                  <Cell key={i} fill={d.variance >= 0 ? GREEN : RED} opacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Execution Timing */}
      <SectionCard title="Execution Timing">
        <p className="mb-4 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Distribution of start and finish performance for verified Actual Events. Missing actuals are
          shown separately — missing ≠ late.
        </p>
        <div className="flex flex-col gap-3">
          {TIMING_ROWS.map((r) => (
            <TimingBar key={r.label} {...r} />
          ))}
        </div>
        <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
          Missing Actual Start/Finish are not counted as late. Timing analysis uses verified Actual Events only.
        </p>
      </SectionCard>

      {/* Discipline Performance table */}
      <SectionCard title="Discipline Performance" right={verifiedTag()}>
        <p className="mb-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Click a discipline to view detail. All percentages are based on verified Actual Events.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                {['DISCIPLINE', 'PLAN', 'ACTUAL', 'VARIANCE', 'STATUS', ''].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 text-[10px] font-bold uppercase"
                    style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disciplineData.map((row) => (
                <DisciplineTableRow
                  key={row.name}
                  row={row}
                  onClick={() => onSelectDiscipline(row.name)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

// ── DISCIPLINE DETAIL ─────────────────────────────────────────────────────────

const PIPING_TREND = [
  { date: 'Aug 1',  plan: 55, actual: 57 },
  { date: 'Aug 8',  plan: 60, actual: 61 },
  { date: 'Aug 15', plan: 64, actual: 62 },
  { date: 'Aug 22', plan: 67, actual: 63 },
  { date: 'Aug 28', plan: 69, actual: 64 },
]

const DELAYED_ACTIVITIES = [
  { label: 'ERECT LINE 24-XX',                   variance: '+2 days', status: 'In Progress' },
  { label: 'PIPE SUPPORT INSTALLATION — AREA B', variance: '+3 days', status: 'In Progress' },
  { label: 'HYDROTEST LINE 18-AB',               variance: '+2 days', status: 'Not Started' },
]

const EXECUTION_SIGNALS = [
  { text: '5 activities started later than plan this week.', type: 'observed' as const },
  { text: 'Bolt tightening appears repeatedly in delayed Piping completion records.', type: 'pattern' as const },
  { text: '3 Piping Actual Events remain in review.', type: 'backlog' as const },
]

function DisciplineDetail({
  name,
  onBack,
}: {
  name: string
  onBack: () => void
}) {
  const isPiping = name === 'Piping'
  const row = disciplineData.find((d) => d.name === name) ?? disciplineData[0]

  const trendData = isPiping ? PIPING_TREND : PIPING_TREND.map((d) => ({
    date: d.date,
    plan: Math.round(row.plan - (disciplineData[0].plan - d.plan)),
    actual: Math.round(row.actual - (disciplineData[0].actual - d.actual)),
  }))

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
        <button onClick={onBack} className="font-medium hover:opacity-70 flex items-center gap-1">
          <ArrowLeft size={12} strokeWidth={2} />
          Performance
        </button>
        <ChevronRight size={12} strokeWidth={2} />
        <span style={{ color: 'var(--c-text)' }}>{name}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
          {name} Performance
        </h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
          Verified field execution compared with planned schedule performance.
        </p>
      </div>

      {/* KPI tiles */}
      <div className="flex flex-wrap gap-3">
        <KpiTile label="Actual Progress" value={`${row.actual}%`} sub={`Plan ${row.plan}% · Variance ${row.variance > 0 ? '+' : ''}${row.variance}%`} valueColor={ORANGE} />
        <KpiTile label="Started Late" value={isPiping ? '8' : '5'} sub="This period" />
        <KpiTile label="Finished Late" value={isPiping ? '4' : '3'} sub="This period" />
        <KpiTile label="Verified Actuals" value={isPiping ? '286' : '140'} sub="Verified samples" valueColor={GREEN} />
        <KpiTile label="Review Backlog" value={isPiping ? '3' : '2'} sub="Pending review" />
      </div>

      {/* Trend chart */}
      <SectionCard title={`${name} — Plan vs Actual`} right={verifiedTag()}>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 4, right: 12, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} dy={6} />
              <YAxis domain={[30, 80]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: 'var(--c-muted)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<PlanActualTooltip />} cursor={{ stroke: 'var(--c-border-strong)', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="plan" stroke={SLATE} strokeWidth={1.5} strokeDasharray="5 4" dot={false} activeDot={false} />
              <Line type="monotone" dataKey="actual" stroke={ORANGE} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: ORANGE, stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" /></svg>
            Plan
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={ORANGE} strokeWidth="2" /></svg>
            Actual (verified)
          </span>
        </div>
      </SectionCard>

      {/* Timing breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title="Start Performance">
          {[
            { label: 'On Time',  pct: isPiping ? 62 : 70, color: GREEN },
            { label: 'Late',     pct: isPiping ? 28 : 20, color: RED   },
            { label: 'Missing',  pct: isPiping ? 10 : 10, color: SLATE },
          ].map((r) => (
            <div key={r.label} className="mb-3 flex items-center gap-3">
              <div className="w-20 flex-shrink-0 text-[12px]" style={{ color: r.color === SLATE ? 'var(--c-muted)' : 'var(--c-text)' }}>
                {r.label}
              </div>
              <div className="relative flex-1 h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
                <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${r.pct}%`, background: r.color, opacity: r.color === SLATE ? 0.45 : 0.85 }} />
              </div>
              <span className="text-[11px] font-semibold" style={{ color: r.color === SLATE ? 'var(--c-subtle)' : r.color, fontFamily: 'var(--font-data)' }}>
                {r.pct}%
              </span>
            </div>
          ))}
          <p className="mt-1 text-[10px]" style={{ color: 'var(--c-subtle)' }}>Missing ≠ late</p>
        </SectionCard>

        <SectionCard title="Finish Performance">
          {[
            { label: 'On Time',  pct: isPiping ? 67 : 72, color: GREEN },
            { label: 'Late',     pct: isPiping ? 21 : 15, color: RED   },
            { label: 'Missing',  pct: isPiping ? 12 : 13, color: SLATE },
          ].map((r) => (
            <div key={r.label} className="mb-3 flex items-center gap-3">
              <div className="w-20 flex-shrink-0 text-[12px]" style={{ color: r.color === SLATE ? 'var(--c-muted)' : 'var(--c-text)' }}>
                {r.label}
              </div>
              <div className="relative flex-1 h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
                <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${r.pct}%`, background: r.color, opacity: r.color === SLATE ? 0.45 : 0.85 }} />
              </div>
              <span className="text-[11px] font-semibold" style={{ color: r.color === SLATE ? 'var(--c-subtle)' : r.color, fontFamily: 'var(--font-data)' }}>
                {r.pct}%
              </span>
            </div>
          ))}
          <p className="mt-1 text-[10px]" style={{ color: 'var(--c-subtle)' }}>Missing ≠ late</p>
        </SectionCard>
      </div>

      {/* Top delayed activities */}
      <SectionCard title="Top Delayed Activities">
        <div className="flex flex-col divide-y" style={{ borderTop: '1px solid var(--c-border)' }}>
          {DELAYED_ACTIVITIES.map((a) => (
            <div key={a.label} className="flex items-center justify-between py-3">
              <div>
                <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>
                  {a.label}
                </div>
                <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  {a.status}
                </div>
              </div>
              <span
                className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: 'rgba(220,38,38,0.08)', color: RED, fontFamily: 'var(--font-data)' }}
              >
                {a.variance}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Execution signals */}
      <SectionCard title="Current Execution Signals">
        <p className="mb-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Observations from verified execution history. Not predictions.
        </p>
        <div className="flex flex-col gap-3">
          {EXECUTION_SIGNALS.map((s) => (
            <div
              key={s.text}
              className="flex items-start gap-3 rounded-[10px] p-3"
              style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
            >
              <span
                className="mt-0.5 rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase flex-shrink-0"
                style={{
                  letterSpacing: '0.07em',
                  background: s.type === 'pattern' ? 'rgba(124,58,237,0.09)' : 'rgba(244,111,41,0.09)',
                  color: s.type === 'pattern' ? '#7C3AED' : '#F46F29',
                }}
              >
                {s.type === 'pattern' ? 'Historical signal' : s.type === 'backlog' ? 'Backlog' : 'Observed'}
              </span>
              <p className="text-[12px]" style={{ color: 'var(--c-text)' }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ── DISCIPLINES TAB ───────────────────────────────────────────────────────────

function DisciplinesTab({ onSelectDiscipline }: { onSelectDiscipline: (name: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
        Select a discipline to view detailed performance analysis.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {disciplineData.map((row) => {
          const ahead = row.variance > 0
          const behind = row.variance < -3
          const statusColor = ahead ? GREEN : behind ? RED : '#B45309'
          const statusBg = ahead ? 'rgba(22,163,74,0.09)' : behind ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.10)'
          const status = ahead ? 'Ahead' : behind ? 'Behind' : 'Slightly Behind'
          return (
            <button
              key={row.name}
              onClick={() => onSelectDiscipline(row.name)}
              className="rounded-[14px] p-4 text-left transition-all duration-150 hover:opacity-85"
              style={{
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                boxShadow: 'var(--c-shadow-card)',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  {row.name}
                </span>
                <span
                  className="rounded-[5px] px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: statusBg, color: statusColor }}
                >
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Actual</div>
                  <div className="text-[17px] font-bold" style={{ color: ORANGE, fontFamily: 'var(--font-data)' }}>{row.actual}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Plan</div>
                  <div className="text-[17px] font-bold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>{row.plan}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Variance</div>
                  <div
                    className="text-[17px] font-bold"
                    style={{ color: statusColor, fontFamily: 'var(--font-data)' }}
                  >
                    {row.variance > 0 ? '+' : ''}{row.variance}%
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

type ActiveTab = 'project' | 'disciplines'

interface Props {
  onNavChange?: (nav: string) => void
}

export default function PerformancePage({ onNavChange }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('project')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null)

  function handleSelectDiscipline(name: string) {
    setSelectedDiscipline(name)
    setActiveTab('disciplines')
  }

  function handleBackFromDetail() {
    setSelectedDiscipline(null)
  }

  const showDisciplineDetail = activeTab === 'disciplines' && selectedDiscipline

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 28px 48px' }}>

        {/* Page header */}
        <div className="mb-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
                Performance
              </h1>
              <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
                Track verified execution against the project plan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
              >
                Aug 2026
              </span>
              <button
                className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}
              >
                Export
              </button>
            </div>
          </div>

          {/* Tabs — only show when not in discipline detail */}
          {!showDisciplineDetail && (
            <div className="flex gap-1" style={{ borderBottom: '1px solid var(--c-border)' }}>
              {(['project', 'disciplines'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedDiscipline(null) }}
                  className="px-4 py-2.5 text-[13px] font-semibold transition-colors duration-150"
                  style={{
                    color: activeTab === tab ? '#F46F29' : 'var(--c-muted)',
                    borderBottom: activeTab === tab ? '2px solid #F46F29' : '2px solid transparent',
                    marginBottom: -1,
                    background: 'transparent',
                  }}
                >
                  {tab === 'project' ? 'Project' : 'Disciplines'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {showDisciplineDetail ? (
          <DisciplineDetail name={selectedDiscipline} onBack={handleBackFromDetail} />
        ) : activeTab === 'project' ? (
          <ProjectTab onSelectDiscipline={handleSelectDiscipline} />
        ) : (
          <DisciplinesTab onSelectDiscipline={handleSelectDiscipline} />
        )}
      </div>
    </div>
  )
}
