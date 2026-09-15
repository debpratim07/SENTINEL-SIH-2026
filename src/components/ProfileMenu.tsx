import { useEffect, useRef, useState } from 'react'
import { X, ChevronRight, Moon, Sun } from 'lucide-react'
import { useConnectedAuth } from '../context/ConnectedAuthContext'
import { useConnectedProject } from '../context/ConnectedProjectContext'
import { emailInitials, roleLabel } from '../lib/connected-shell'

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (nav: string) => void
  dark: boolean
  onToggleDark: () => void
}

export function ProfileDropdown({ open, onClose, onNavigate, dark, onToggleDark }: Props) {
  const auth = useConnectedAuth()
  const access = useConnectedProject()
  const email = access.identity?.user.email ?? auth.user?.email ?? ''
  const currentRole = roleLabel(access.role)
  const ref = useRef<HTMLDivElement>(null)

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

  if (!open) return null

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Profile menu"
      style={{
        position: 'fixed',
        top: 68,
        right: 16,
        width: 260,
        zIndex: 150,
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        borderRadius: 14,
        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}
    >
      {/* Identity */}
      <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)' }}>
            {emailInitials(email)}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{email}</div>
            <div className="text-[11px]" style={{ color: 'var(--c-muted)' }}>{currentRole}</div>
            <div className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>{access.project?.name}</div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {[
          { label: 'My Profile', nav: 'profile' },
        ].map((item) => (
          <button
            key={item.label}
            role="menuitem"
            onClick={() => { onNavigate(item.nav); onClose() }}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px]"
            style={{ color: 'var(--c-text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-brand-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item.label}
            <ChevronRight size={12} strokeWidth={2} style={{ color: 'var(--c-subtle)' }} />
          </button>
        ))}

        {/* Theme toggle */}
        <button
          role="menuitem"
          onClick={() => { onToggleDark(); onClose() }}
          className="flex w-full items-center justify-between px-4 py-2.5 text-[13px]"
          style={{ color: 'var(--c-text)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-brand-tint)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          {dark ? <Sun size={13} strokeWidth={2} style={{ color: 'var(--c-muted)' }} /> : <Moon size={13} strokeWidth={2} style={{ color: 'var(--c-muted)' }} />}
        </button>
      </div>

      {/* Sign out */}
      <div style={{ borderTop: '1px solid var(--c-border)' }}>
        <button
          role="menuitem"
          onClick={() => { onNavigate('__logout'); onClose() }}
          className="flex w-full items-center px-4 py-3 text-[13px]"
          style={{ color: '#DC2626' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────

interface ProfilePageProps {
  onBack: () => void
  dark: boolean
  onToggleDark: () => void
}

export function ProfilePage({ onBack, dark, onToggleDark }: ProfilePageProps) {
  const auth = useConnectedAuth()
  const access = useConnectedProject()
  const email = access.identity?.user.email ?? auth.user?.email ?? ''
  const currentRole = roleLabel(access.role)
  const projectName = access.project?.name ?? 'No project assigned'

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 28px 48px' }}>
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-[13px] hover:opacity-70"
          style={{ color: 'var(--c-muted)' }}
        >
          ← Back to Dashboard
        </button>

        <h1 className="mb-6 text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
          My Profile
        </h1>

        {/* Identity card */}
        <div className="mb-5 flex items-center gap-4 rounded-[16px] p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-[18px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)' }}>
            {emailInitials(email)}
          </div>
          <div>
            <div className="text-[18px] font-bold" style={{ color: 'var(--c-text)' }}>{email}</div>
            <div className="text-[13px]" style={{ color: 'var(--c-muted)' }}>{currentRole} · {projectName}</div>
          </div>
        </div>

        {/* Fields */}
        {[
          { label: 'Email', value: email },
          { label: 'Project Role', value: currentRole, note: 'This role comes from your project membership.' },
          { label: 'Project', value: projectName },
        ].map((f) => (
          <div key={f.label} className="mb-4 rounded-[12px] px-4 py-3" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="mb-0.5 text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{f.label}</div>
            <div className="text-[14px]" style={{ color: 'var(--c-text)' }}>{f.value}</div>
            {f.note && <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-subtle)' }}>{f.note}</div>}
          </div>
        ))}

        {/* Theme preference */}
        <div className="mb-4 rounded-[12px] px-4 py-3" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="mb-2 text-[11px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Theme · this browser only</div>
          <div className="flex gap-2">
            {['Light', 'Dark'].map((t) => {
              const active = t === 'Dark' ? dark : t === 'Light' ? !dark : false
              return (
                <button
                  key={t}
                  onClick={() => { if (t === 'Dark' && !dark) onToggleDark(); if (t === 'Light' && dark) onToggleDark() }}
                  className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors"
                  style={{
                    background: active ? 'var(--c-brand-tint)' : 'var(--c-page)',
                    border: `1px solid ${active ? 'rgba(244,111,41,0.35)' : 'var(--c-border)'}`,
                    color: active ? '#F46F29' : 'var(--c-muted)',
                  }}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
