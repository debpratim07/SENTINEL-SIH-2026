import { ArrowRight } from 'lucide-react'
import { dataQualityMetrics } from '../../data/mockData'

export default function DataQualityPanel({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
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
          Data Quality
        </h2>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
          Ingestion and matching fidelity
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {dataQualityMetrics.map((metric, i) => {
          const barWidth = metric.good ? metric.numeric : Math.min(metric.numeric * 10, 100)
          const valueColor = metric.good
            ? metric.numeric >= 90
              ? '#16A34A'
              : '#D97706'
            : metric.numeric <= 3
              ? '#D97706'
              : '#DC2626'

          return (
            <div key={metric.label}>
              <div className="flex flex-col gap-1.5 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                    {metric.label}
                  </span>
                  <span
                    className="text-[15px] font-bold tabular-nums"
                    style={{ color: valueColor, fontFamily: 'var(--font-data)' }}
                  >
                    {metric.value}
                  </span>
                </div>
                {/* Thin bar indicator */}
                <div
                  className="overflow-hidden rounded-full"
                  style={{ height: 3, background: 'var(--c-border)' }}
                  role="presentation"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: metric.good
                        ? metric.numeric >= 90
                          ? '#22C55E'
                          : '#F46F29'
                        : metric.numeric <= 3
                          ? '#F59E0B'
                          : '#EF4444',
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
              {i < dataQualityMetrics.length - 1 && (
                <div style={{ height: 1, background: 'var(--c-border)' }} />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onNavigate?.('data-quality')}
          className="flex items-center gap-1 text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
          style={{ color: '#F46F29', cursor: 'pointer' }}
        >
          View Details
          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
