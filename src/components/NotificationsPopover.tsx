import { useEffect, useRef, useState } from 'react'
import { X, CheckCheck } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Notification {
  id: string
  title: string
  body: string
  age: string
  read: boolean
  navTarget: string
  navRecord?: string
  type: 'review' | 'conflict' | 'report' | 'clarification' | 'verified'
}

// ── Demo notifications ────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'Match awaiting review',
    body: 'FOUNDATION BLOCK C-14 requires planner validation.',
    age: '2 min ago',
    read: false,
    navTarget: 'review-queue',
    type: 'review',
  },
  {
    id: 'n-2',
    title: 'Conflict detected',
    body: 'EQUIPMENT ALIGNMENT — P-204 has conflicting Actual Start dates.',
    age: '18 min ago',
    read: false,
    navTarget: 'exceptions',
    navRecord: 'EXC-001',
    type: 'conflict',
  },
  {
    id: 'n-3',
    title: 'Report processed',
    body: 'Piping_DPR_28Aug.pdf produced 6 Actual Events.',
    age: '42 min ago',
    read: false,
    navTarget: 'reports',
    navRecord: 'RPT-2026-0001',
    type: 'report',
  },
  {
    id: 'n-4',
    title: 'Clarification received',
    body: 'Additional context was provided for a Welding Actual.',
    age: '1 hr ago',
    read: true,
    navTarget: 'exceptions',
    type: 'clarification',
  },
  {
    id: 'n-5',
    title: 'Match verified',
    body: 'ERECT LINE 24-XX Actual Start updated.',
    age: '2 hr ago',
    read: true,
    navTarget: 'actuals',
    navRecord: 'ACT-2026-0842',
    type: 'verified',
  },
]

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  review:       { color: '#F46F29', bg: 'rgba(244,111,41,0.12)' },
  conflict:     { color: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
  report:       { color: '#0891B2', bg: 'rgba(8,145,178,0.10)' },
  clarification:{ color: '#7C3AED', bg: 'rgba(124,58,237,0.09)' },
  verified:     { color: '#16A34A', bg: 'rgba(22,163,74,0.09)' },
}

const TYPE_DOTS: Record<string, string> = {
  review: '#F46F29', conflict: '#DC2626', report: '#0891B2',
  clarification: '#7C3AED', verified: '#16A34A',
}

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (nav: string, id?: string) => void
  onCountChange: (n: number) => void
}

export default function NotificationsPopover({ open, onClose, onNavigate, onCountChange }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    onCountChange(unread)
  }, [unread, onCountChange])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose()
    }
    function onClickOutside(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open, onClose])

  function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
  }

  function handleClick(n: Notification) {
    setNotifications((ns) => ns.map((x) => x.id === n.id ? { ...x, read: true } : x))
    onNavigate(n.navTarget, n.navRecord)
    onClose()
  }

  if (!open) return null

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: 68,
        right: 16,
        width: 360,
        maxHeight: 480,
        zIndex: 150,
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        borderRadius: 16,
        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>Notifications</span>
          {unread > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
              style={{ background: '#F46F29' }}>{unread}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[11px] font-medium transition-colors"
              style={{ color: '#F46F29' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-brand-tint)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <CheckCheck size={12} strokeWidth={2} />
              Mark all as read
            </button>
          )}
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-[7px]" style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto" role="list" aria-label="Notification list">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-1.5">
            <p className="text-[14px] font-medium" style={{ color: 'var(--c-muted)' }}>{"You're all caught up."}</p>
            <p className="text-[12px]" style={{ color: 'var(--c-subtle)' }}>No unread project notifications.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const dotColor = TYPE_DOTS[n.type]
            return (
              <button
                key={n.id}
                role="listitem"
                onClick={() => handleClick(n)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
                style={{
                  borderBottom: '1px solid var(--c-border)',
                  background: n.read ? 'transparent' : 'rgba(244,111,41,0.03)',
                  opacity: n.read ? 0.7 : 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-brand-tint)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(244,111,41,0.03)')}
              >
                <div className="mt-1.5 flex-shrink-0">
                  <div className="h-2 w-2 rounded-full" style={{ background: n.read ? 'var(--c-subtle)' : dotColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--c-text)' }}>{n.title}</span>
                    <span className="flex-shrink-0 text-[10px]" style={{ color: 'var(--c-subtle)' }}>{n.age}</span>
                  </div>
                  <p className="text-[12px] leading-[17px]" style={{ color: 'var(--c-muted)' }}>{n.body}</p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
