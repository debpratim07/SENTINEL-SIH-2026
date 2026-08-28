import { useState } from 'react'
import { Search, Bell, Sun, Moon, BookOpen } from 'lucide-react'
import { useRole } from '../context/RoleContext'

interface HeaderProps {
  dark: boolean
  onToggleDark: () => void
  onOpenSearch: () => void
  onOpenNotifications: () => void
  onOpenProfile: () => void
  onOpenGuide: () => void
  notificationCount: number
}

export default function Header({
  dark,
  onToggleDark,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  onOpenGuide,
  notificationCount,
}: HeaderProps) {
  const { user, isSimulatedRole } = useRole()

  return (
    <header
      aria-label="Application header"
      style={{
        height: 64,
        background: 'var(--c-glass)',
        backdropFilter: 'var(--backdrop)',
        WebkitBackdropFilter: 'var(--backdrop)',
        borderBottom: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-glass)',
        zIndex: 40,
        flexShrink: 0,
      }}
      className="flex items-center px-7 gap-4"
    >
      {/* Search trigger */}
      <div className="flex-1 max-w-xs">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 transition-all duration-180 text-left"
          style={{
            height: 36,
            background: 'var(--c-page)',
            border: '1px solid var(--c-border)',
          }}
          aria-label="Search SENTINEL (press / to open)"
        >
          <Search size={14} strokeWidth={2} style={{ color: 'var(--c-muted)', flexShrink: 0 }} aria-hidden="true" />
          <span className="flex-1 text-[13px] leading-[19px]" style={{ color: 'var(--c-subtle)' }}>
            Search SENTINEL…
          </span>
          <kbd
            className="shrink-0 rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium leading-none"
            style={{ background: 'var(--c-border)', color: 'var(--c-muted)', border: '1px solid var(--c-border-strong)', fontFamily: 'var(--font-data)' }}
            aria-label="Keyboard shortcut: forward slash"
          >
            /
          </kbd>
        </button>
      </div>

      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Guide */}
        <button
          onClick={onOpenGuide}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-150"
          style={{ color: 'var(--c-muted)' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          aria-label="Open SENTINEL Guide"
          title="SENTINEL Guide"
        >
          <BookOpen size={17} strokeWidth={1.8} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-150"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
            aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
          >
            <Bell size={17} strokeWidth={1.8} />
            {notificationCount > 0 && (
              <span
                className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: '#F46F29', lineHeight: 1 }}
                aria-hidden="true"
              >
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-150"
          style={{ color: 'var(--c-muted)' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={dark}
        >
          {dark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
        </button>

        {/* Divider */}
        <div className="mx-1 h-6" style={{ width: 1, background: 'var(--c-border-strong)' }} aria-hidden="true" />

        {/* User avatar / profile */}
        <button
          onClick={onOpenProfile}
          className="flex h-9 items-center gap-2.5 rounded-[10px] pl-1 pr-3 transition-all duration-150"
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          aria-label={`User profile: ${user.name}, ${user.roleLabel}`}
          aria-haspopup="menu"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)' }}
            aria-hidden="true"
          >
            {user.initials}
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-[13px] font-medium leading-[17px]" style={{ color: 'var(--c-text)' }}>{user.name}</span>
            <span className="text-[11px] leading-[14px]" style={{ color: isSimulatedRole ? '#F46F29' : 'var(--c-muted)' }}>
              {user.roleLabel}{isSimulatedRole ? ' · Demo role' : ''}
            </span>
          </div>
        </button>
      </div>
    </header>
  )
}
