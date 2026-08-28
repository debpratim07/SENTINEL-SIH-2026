import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import Modal from '../ui/Modal'

interface Activity {
  id: string
  label: string
  tier: string
  discipline: string
  area: string
}

const ACTIVITIES: Activity[] = [
  { id: 'ERECT-24-XX', label: 'ERECT LINE 24-XX', tier: 'L6', discipline: 'Piping', area: 'Area B' },
  { id: 'PIPE-SUPP-24-XX', label: 'INSTALL PIPE SUPPORT 24-XX', tier: 'L6', discipline: 'Piping', area: 'Area B' },
  { id: 'HYDRO-24-XX', label: 'HYDROTEST LINE 24-XX', tier: 'L6', discipline: 'Piping', area: 'Area B' },
  { id: 'ERECT-22-YY', label: 'ERECT LINE 22-YY', tier: 'L6', discipline: 'Piping', area: 'Area B' },
  { id: 'FLUSH-24-XX', label: 'FLUSH LINE 24-XX', tier: 'L6', discipline: 'Piping', area: 'Area B' },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (activity: Activity) => void
  currentActivityId?: string
}

export default function ChooseActivityModal({ open, onClose, onSelect, currentActivityId }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Activity | null>(null)

  const filtered = ACTIVITIES.filter(
    (a) =>
      query === '' ||
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase())
  )

  function handleConfirm() {
    if (selected) {
      onSelect(selected)
      setSelected(null)
      setQuery('')
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-label="Choose Schedule Activity" zIndex={70}>
      <div
        style={{
          width: 520,
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 18,
          boxShadow: 'var(--c-shadow-elevated)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--c-border)' }}
        >
          <h3 className="text-[16px] font-bold tracking-[-0.01em]" style={{ color: 'var(--c-text)' }}>
            Choose Schedule Activity
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] transition-colors duration-150"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--c-border)' }}>
          <div className="relative">
            <Search
              size={14}
              strokeWidth={2}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--c-muted)',
              }}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search activity ID or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-[13px]"
              style={{
                background: 'var(--c-page)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(244,111,41,0.45)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--c-border)')}
            />
          </div>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {filtered.map((activity, i) => {
            const isCurrent = activity.id === currentActivityId
            const isSelected = selected?.id === activity.id
            return (
              <button
                key={activity.id}
                onClick={() => setSelected(isSelected ? null : activity)}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-100"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--c-border)' : 'none',
                  background: isSelected
                    ? 'rgba(244,111,41,0.07)'
                    : 'var(--c-card)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--c-page)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--c-card)'
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}
                    >
                      {activity.label}
                    </span>
                    {isCurrent && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={{ background: 'var(--c-border)', color: 'var(--c-muted)', letterSpacing: '0.07em' }}
                      >
                        Current AI
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                    {activity.tier} · {activity.discipline} · {activity.area}
                  </p>
                </div>
                {isSelected && (
                  <Check size={16} strokeWidth={2.5} style={{ color: '#F46F29', flexShrink: 0 }} />
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>
              No activities match "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3"
          style={{ padding: '14px 20px', borderTop: '1px solid var(--c-border)' }}
        >
          <button
            onClick={onClose}
            className="rounded-[9px] px-4 py-2 text-[13px] font-medium transition-colors duration-150"
            style={{
              background: 'var(--c-page)',
              border: '1px solid var(--c-border)',
              color: 'var(--c-muted)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 8px rgba(244,111,41,0.25)',
            }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </Modal>
  )
}
