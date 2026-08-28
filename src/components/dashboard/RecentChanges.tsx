import { ArrowRight } from 'lucide-react'
import { recentChanges } from '../../data/mockData'
import type { ChangeType } from '../../data/mockData'
import { useRole } from '../../context/RoleContext'

const changeTypeStyle: Record<
  ChangeType,
  { label: string; color: string; bg: string }
> = {
  updated: { label: 'Updated', color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  verified: { label: 'Verified', color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  extracted: { label: 'Extracted', color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  created: { label: 'Created', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  resolved: { label: 'Resolved', color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
}

export default function RecentChanges({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  const { canSeeNav } = useRole()
  return (
    <section
      className="rounded-[16px] p-5"
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
            Recent Changes
          </h2>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>
            Today · 28 Aug 2026
          </p>
        </div>
        {canSeeNav('audit-log') && (
          <button
            onClick={() => onNavigate?.('audit-log')}
            className="flex items-center gap-1 text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
            style={{ color: '#F46F29', cursor: 'pointer' }}
          >
            View Audit Log
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Column header */}
      <div
        className="mb-1 grid text-[10px] font-semibold uppercase"
        style={{
          gridTemplateColumns: '44px 120px 1fr auto auto',
          gap: '0 16px',
          color: 'var(--c-subtle)',
          letterSpacing: '0.07em',
        }}
      >
        <span>Time</span>
        <span>Change</span>
        <span>Entity</span>
        <span>Detail</span>
        <span>By</span>
      </div>

      <ol className="flex flex-col" aria-label="Recent audit changes">
        {recentChanges.map((entry, i) => {
          const style = changeTypeStyle[entry.changeType]

          return (
            <li key={entry.id}>
              <div
                className="grid items-center py-2.5"
                style={{ gridTemplateColumns: '44px 120px 1fr auto auto', gap: '0 16px' }}
              >
                {/* Time */}
                <span
                  className="text-[12px] tabular-nums"
                  style={{ color: 'var(--c-subtle)', fontFamily: 'var(--font-data)' }}
                >
                  {entry.time}
                </span>

                {/* Change type badge */}
                <span
                  className="inline-flex w-fit items-center rounded-[6px] px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: style.bg, color: style.color }}
                >
                  {entry.changeLabel}
                </span>

                {/* Entity */}
                <span
                  className="truncate text-[13px] font-medium"
                  style={{ color: 'var(--c-text)' }}
                >
                  {entry.entity}
                </span>

                {/* Detail */}
                <span
                  className="text-[12px] tabular-nums"
                  style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)', whiteSpace: 'nowrap' }}
                >
                  {entry.detail || '—'}
                </span>

                {/* Actor */}
                <span
                  className="text-right text-[12px] font-medium"
                  style={{
                    color: entry.actorIsSystem ? '#F46F29' : 'var(--c-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.actor}
                </span>
              </div>
              {i < recentChanges.length - 1 && (
                <div style={{ height: 1, background: 'var(--c-border)' }} />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
