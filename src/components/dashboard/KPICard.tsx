import type { ProjectKPI } from '../../data/mockData'

const sub2Colors = {
  warning: { color: '#D97706' },
  danger: { color: '#DC2626' },
  neutral: { color: 'var(--c-muted)' },
}

interface KPICardProps {
  kpi: ProjectKPI
}

export default function KPICard({ kpi }: KPICardProps) {
  const sub2Style = sub2Colors[kpi.sub2Color ?? 'neutral']

  return (
    <article
      className="flex flex-col rounded-[16px] px-5 py-4"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
        gap: 0,
      }}
    >
      {/* Label */}
      <span
        className="mb-3 block text-[10px] font-semibold uppercase"
        style={{ color: 'var(--c-muted)', letterSpacing: '0.09em' }}
      >
        {kpi.label}
      </span>

      {/* Value */}
      <span
        className="block font-bold leading-none"
        style={{
          fontSize: 31,
          letterSpacing: '-0.015em',
          color: 'var(--c-text)',
          fontFamily: 'var(--font-ui)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {kpi.value}
      </span>

      {/* Spacer */}
      <div style={{ height: 10 }} aria-hidden="true" />

      {/* Secondary metrics */}
      <div className="flex flex-col gap-0.5">
        {kpi.sub1 && (
          <span className="text-[12px] leading-[18px]" style={{ color: 'var(--c-muted)' }}>
            {kpi.sub1}
          </span>
        )}
        <span className="text-[12px] font-medium leading-[18px]" style={sub2Style}>
          {kpi.sub2}
        </span>
      </div>
    </article>
  )
}
