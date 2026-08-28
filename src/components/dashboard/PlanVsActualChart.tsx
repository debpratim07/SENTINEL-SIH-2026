import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { ArrowRight } from 'lucide-react'
import { planVsActualData } from '../../data/mockData'

function ChartTooltip({
  active,
  payload,
  label,
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
        minWidth: 140,
      }}
    >
      <div
        className="mb-1.5 text-[10px] font-semibold uppercase"
        style={{ color: 'var(--c-muted)', letterSpacing: '0.08em' }}
      >
        {label}
      </div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
            <span
              className="inline-block h-1.5 w-3 rounded-full"
              style={{ background: entry.color, opacity: entry.name === 'plan' ? 0.7 : 1 }}
            />
            {entry.name === 'plan' ? 'Plan' : 'Actual'}
          </span>
          <span
            className="font-semibold"
            style={{
              color: entry.name === 'actual' ? '#F46F29' : 'var(--c-text)',
              fontFamily: 'var(--font-ui)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}
          >
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

// Terminal dots on final data points
const lastPoint = planVsActualData[planVsActualData.length - 1]

export default function PlanVsActualChart({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  return (
    <section
      className="flex flex-col rounded-[16px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h2
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.01em]"
            style={{ color: 'var(--c-text)' }}
          >
            Plan vs Actual
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            Verified execution progress
          </p>
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-5 text-[12px]"
          style={{ color: 'var(--c-muted)' }}
        >
          <span className="flex items-center gap-1.5">
            <svg width="22" height="10" aria-hidden="true">
              <line
                x1="0"
                y1="5"
                x2="22"
                y2="5"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </svg>
            Plan
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="22" height="10" aria-hidden="true">
              <line x1="0" y1="5" x2="22" y2="5" stroke="#F46F29" strokeWidth="2" />
            </svg>
            Actual
          </span>
        </div>
      </div>

      {/* Key metrics row */}
      <div
        className="mb-4 mt-3 flex items-center gap-6 rounded-[10px] px-3.5 py-2.5"
        style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}
      >
        <div>
          <span className="text-[10px] uppercase" style={{ color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
            Actual
          </span>
          <div
            className="text-[20px] font-bold tracking-[-0.02em]"
            style={{ color: '#F46F29', fontFamily: 'var(--font-ui)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}
          >
            68.4%
          </div>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: 'var(--c-border)' }}
          aria-hidden="true"
        />
        <div>
          <span className="text-[10px] uppercase" style={{ color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
            Plan
          </span>
          <div
            className="text-[20px] font-bold"
            style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}
          >
            71.2%
          </div>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: 'var(--c-border)' }}
          aria-hidden="true"
        />
        <div>
          <span className="text-[10px] uppercase" style={{ color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
            Variance
          </span>
          <div
            className="text-[20px] font-bold"
            style={{ color: '#D97706', fontFamily: 'var(--font-ui)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}
          >
            −2.8%
          </div>
        </div>
      </div>
      <div
        className="mt-1 text-[11px]"
        style={{ color: 'var(--c-subtle)' }}
      >
        Verified actuals only
      </div>

      {/* Chart */}
      <div style={{ height: 188, minWidth: 0, minHeight: 188 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={planVsActualData}
            margin={{ top: 4, right: 12, left: -22, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--c-border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{
                fontSize: 11,
                fill: 'var(--c-muted)',
                fontFamily: 'var(--font-data)',
              }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[30, 80]}
              tickCount={6}
              tickFormatter={(v) => `${v}%`}
              tick={{
                fontSize: 11,
                fill: 'var(--c-muted)',
                fontFamily: 'var(--font-data)',
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: 'var(--c-border-strong)',
                strokeWidth: 1,
              }}
            />

            {/* Plan line — neutral slate dashed */}
            <Line
              type="monotone"
              dataKey="plan"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
            />

            {/* Actual line — SENTINEL orange */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#F46F29"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#F46F29', stroke: 'white', strokeWidth: 2 }}
            />

            {/* Terminal dots at Aug 28 */}
            <ReferenceDot
              x={lastPoint.date}
              y={lastPoint.plan}
              r={3}
              fill="#94A3B8"
              stroke="white"
              strokeWidth={1.5}
            />
            <ReferenceDot
              x={lastPoint.date}
              y={lastPoint.actual}
              r={4}
              fill="#F46F29"
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer action */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>
          Aug 2026 · Week 34
        </span>
        <button
          onClick={() => onNavigate?.('schedule')}
          className="flex items-center gap-1 text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
          style={{ color: '#F46F29', cursor: 'pointer' }}
        >
          View Schedule
          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
