import { ArrowRight } from 'lucide-react'
import { reviewHealth } from '../../data/mockData'

export default function ReviewHealth({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  return (
    <section
      className="flex flex-col rounded-[16px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.01em]"
            style={{ color: 'var(--c-text)' }}
          >
            Review Health
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            Items pending verification
          </p>
        </div>
        <span
          className="rounded-[8px] px-2.5 py-1 text-[18px] font-bold tabular-nums"
          style={{
            color: '#D97706',
            fontFamily: 'var(--font-data)',
            background: 'rgba(217,119,6,0.10)',
          }}
        >
          {reviewHealth.total}
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {reviewHealth.items.map((item, i) => (
          <div key={item.label}>
            <div
              className="flex items-center justify-between py-2.5"
            >
              <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>
                {item.label}
              </span>
              <span
                className="text-[15px] font-bold tabular-nums"
                style={{
                  color: item.value >= 3 ? '#D97706' : 'var(--c-text)',
                  fontFamily: 'var(--font-data)',
                }}
              >
                {item.value}
              </span>
            </div>
            {i < reviewHealth.items.length - 1 && (
              <div style={{ height: 1, background: 'var(--c-border)' }} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onNavigate?.('review-queue')}
          className="flex items-center gap-1 text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
          style={{ color: '#F46F29', cursor: 'pointer' }}
        >
          View Queue
          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
