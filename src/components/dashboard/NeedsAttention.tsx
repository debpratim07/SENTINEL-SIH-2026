import { ArrowRight } from 'lucide-react'
import { attentionItems } from '../../data/mockData'
import type { AttentionType } from '../../data/mockData'
import { useRole } from '../../context/RoleContext'

const typeStyle: Record<
  AttentionType,
  { color: string; bg: string }
> = {
  'late-start': { color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  conflict: { color: '#DC2626', bg: 'rgba(220,38,38,0.11)' },
  missing: { color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  review: { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
}

const ITEM_NAV: Record<string, { page: string; id?: string }> = {
  'erect-line-24-xx':       { page: 'schedule',     id: 'erect-line-24-xx' },
  'equipment-alignment-p204':{ page: 'exceptions',  id: 'EXC-001' },
  'cable-tray-utility':     { page: 'actuals',      id: 'ACT-2026-0855' },
  'foundation-block-c14':   { page: 'review-queue' },
}

interface Props {
  onNavigate?: (page: string, id?: string) => void
}

export default function NeedsAttention({ onNavigate }: Props) {
  const { user } = useRole()
  const isPM = user.role === 'project-manager'

  return (
    <section
      className="flex flex-col rounded-[16px] p-5"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-card)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2
            className="text-[16px] font-semibold leading-[22px] tracking-[-0.01em]"
            style={{ color: 'var(--c-text)' }}
          >
            Needs Attention
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            7 active items
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('exceptions')}
          className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 hover:opacity-70"
          style={{
            background: 'var(--c-border)',
            color: 'var(--c-muted)',
            border: '1px solid var(--c-border)',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>

      {/* Items — compact rows with dividers */}
      <ol className="flex flex-col">
        {attentionItems.map((item, i) => {
          const style = typeStyle[item.type]
          const sub = [item.discipline, item.location].filter(Boolean).join(' · ')
          const dest = ITEM_NAV[item.id]

          // PM sees "View Conflict" instead of "Resolve" for conflicts
          let actionLabel = item.action
          if (isPM && item.type === 'conflict') actionLabel = 'View Conflict'

          return (
            <li key={item.id}>
              <div className="flex items-start gap-3 py-3">
                {/* Type badge */}
                <span
                  className="mt-0.5 shrink-0 rounded-[5px] px-1.5 py-0.5 text-[9px] font-bold uppercase"
                  style={{
                    color: style.color,
                    background: style.bg,
                    letterSpacing: '0.07em',
                  }}
                >
                  {item.typeLabel}
                </span>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span
                    className="truncate text-[13px] font-semibold leading-[18px]"
                    style={{ color: 'var(--c-text)' }}
                  >
                    {item.entity}
                  </span>
                  <span className="text-[12px] leading-[17px]" style={{ color: 'var(--c-muted)' }}>
                    {item.reason}
                    {sub && (
                      <>
                        {' · '}
                        <span style={{ color: 'var(--c-subtle)' }}>{sub}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Action */}
                <button
                  onClick={() => dest && onNavigate?.(dest.page, dest.id)}
                  className="flex shrink-0 items-center gap-0.5 text-[12px] font-medium transition-opacity duration-150 hover:opacity-70"
                  style={{ color: style.color, cursor: 'pointer' }}
                  aria-label={`${actionLabel}: ${item.entity}`}
                >
                  {actionLabel}
                  <ArrowRight size={11} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
              {i < attentionItems.length - 1 && (
                <div style={{ height: 1, background: 'var(--c-border)' }} />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
