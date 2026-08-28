import { disciplineData } from '../../data/mockData'

export default function DisciplinePerformance() {
  const maxPlan = Math.max(...disciplineData.map((d) => d.plan))

  return (
    <section
      className="flex flex-col rounded-[16px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
      }}
    >
      <div className="mb-4">
        <h2
          className="text-[16px] font-semibold leading-[22px] tracking-[-0.01em]"
          style={{ color: 'var(--c-text)' }}
        >
          Discipline Performance
        </h2>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Plan vs actual by discipline
        </p>
      </div>

      {/* Column headers */}
      <div
        className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase"
        style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em' }}
      >
        <span className="flex-1">Discipline</span>
        <span style={{ width: 80, textAlign: 'right' }}>Plan</span>
        <span style={{ width: 80, textAlign: 'right' }}>Actual</span>
        <span style={{ width: 40, textAlign: 'right' }}>Var</span>
      </div>

      <div className="flex flex-col gap-0">
        {disciplineData.map((row, i) => {
          const isPositive = row.variance > 0
          const varColor = isPositive ? '#16A34A' : row.variance <= -4 ? '#DC2626' : '#D97706'
          const barScale = 100 / maxPlan

          return (
            <div key={row.name}>
              <div className="flex flex-col gap-1.5 py-2.5">
                {/* Name row with numbers */}
                <div className="flex items-center gap-3">
                  <span
                    className="flex-1 text-[13px] font-medium leading-[18px]"
                    style={{ color: 'var(--c-text)' }}
                  >
                    {row.name}
                  </span>
                  <span
                    className="w-20 text-right text-[12px] tabular-nums"
                    style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
                  >
                    {row.plan}%
                  </span>
                  <span
                    className="w-20 text-right text-[12px] tabular-nums"
                    style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                  >
                    {row.actual}%
                  </span>
                  <span
                    className="w-10 text-right text-[12px] font-semibold tabular-nums"
                    style={{ color: varColor, fontFamily: 'var(--font-data)' }}
                  >
                    {isPositive ? '+' : ''}
                    {row.variance}%
                  </span>
                </div>

                {/* Stacked bars */}
                <div className="flex flex-col gap-1">
                  {/* Plan bar */}
                  <div
                    className="overflow-hidden rounded-full"
                    style={{ height: 4, background: 'var(--c-border)' }}
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.plan * barScale}%`,
                        background: '#94A3B8',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  {/* Actual bar */}
                  <div
                    className="overflow-hidden rounded-full"
                    style={{ height: 4, background: 'var(--c-border)' }}
                    role="progressbar"
                    aria-valuenow={row.actual}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${row.name} actual progress: ${row.actual}%`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${row.actual * barScale}%`,
                        background:
                          isPositive
                            ? '#22C55E'
                            : row.variance <= -4
                              ? '#EF4444'
                              : '#F46F29',
                      }}
                    />
                  </div>
                </div>
              </div>
              {i < disciplineData.length - 1 && (
                <div style={{ height: 1, background: 'var(--c-border)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-3 flex items-center gap-4 text-[11px]"
        style={{ color: 'var(--c-subtle)' }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-5 rounded-full"
            style={{ background: '#94A3B8', opacity: 0.6 }}
            aria-hidden="true"
          />
          Plan
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-5 rounded-full"
            style={{ background: '#F46F29' }}
            aria-hidden="true"
          />
          Actual
        </span>
      </div>
    </section>
  )
}
