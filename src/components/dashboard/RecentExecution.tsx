import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { recentExecutions } from '../../data/mockData'
import type { ExecutionStatus } from '../../data/mockData'

const statusConfig: Record<
  ExecutionStatus,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  verified: {
    label: 'Verified',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.10)',
    icon: CheckCircle2,
  },
  'awaiting-review': {
    label: 'Awaiting Review',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.10)',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    color: '#6B7280',
    bg: 'rgba(107,114,128,0.10)',
    icon: Clock,
  },
}

export default function RecentExecution({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  return (
    <section
      className="flex flex-col rounded-[16px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
      }}
    >
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.01em]"
            style={{ color: 'var(--c-text)' }}
          >
            Recent Execution
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            Field captures and actual updates
          </p>
        </div>
      </div>

      <ol className="flex flex-col">
        {recentExecutions.map((entry, i) => {
          const cfg = statusConfig[entry.status]
          const StatusIcon = cfg.icon
          const sub = [entry.captureType, entry.discipline, entry.area]
            .filter(Boolean)
            .join(' · ')

          return (
            <li key={entry.id}>
              <div className="flex items-start justify-between gap-4 py-3">
                {/* Left: activity info */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span
                    className="text-[13px] font-semibold leading-[18px]"
                    style={{ color: 'var(--c-text)' }}
                  >
                    {entry.activity}
                  </span>
                  <span className="text-[12px] leading-[17px]" style={{ color: 'var(--c-muted)' }}>
                    {sub}
                  </span>
                </div>

                {/* Right: date + status */}
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className="text-[12px] tabular-nums"
                    style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
                  >
                    {entry.date}
                  </span>
                  <span
                    className="flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <StatusIcon size={10} strokeWidth={2.2} aria-hidden="true" />
                    {cfg.label}
                  </span>
                </div>
              </div>
              {i < recentExecutions.length - 1 && (
                <div style={{ height: 1, background: 'var(--c-border)' }} />
              )}
            </li>
          )
        })}
      </ol>

      {/* Footer */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => onNavigate?.('actuals')}
          className="flex items-center gap-1 text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
          style={{ color: '#F46F29', cursor: 'pointer' }}
        >
          View Actuals
          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
