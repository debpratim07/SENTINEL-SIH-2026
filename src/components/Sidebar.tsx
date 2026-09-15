import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { useConnectedProject } from '../context/ConnectedProjectContext'
import { shellNavVisible } from '../lib/connected-shell'
import { canCaptureProgress } from '../lib/manual-capture'
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  ListChecks,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  ScrollText,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  FolderOpen,
} from 'lucide-react'

// ── Logo — exact supplied artwork, ~12% reduced ──────────────────────────────

function SentinelFullLogo() {
  return (
    <svg
      width="131"
      height="37"
      viewBox="0 0 317 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SENTINEL"
      role="img"
    >
      <path
        d="M107.549 43.8676C107.151 41.8302 106.083 40.2152 104.343 39.0225C102.654 37.7802 100.741 37.159 98.6039 37.159C96.5168 37.159 94.7775 37.6808 93.3861 38.7244C91.9947 39.7182 91.3239 41.0599 91.3736 42.7495C91.3736 44.3397 92.1935 45.582 93.8334 46.4765C95.4732 47.371 97.5604 48.0667 100.095 48.5636C103.673 49.2096 106.604 49.9798 108.89 50.8743C111.176 51.7688 112.965 53.0111 114.257 54.6013C115.549 56.1915 116.195 58.2289 116.195 60.7135C116.195 63.1982 115.425 65.2853 113.885 66.9749C112.394 68.6147 110.431 69.8571 107.996 70.7018C105.611 71.4969 103.002 71.8945 100.169 71.8945C96.8398 71.8945 93.8582 71.3479 91.2245 70.2546C88.5908 69.1614 86.5037 67.6209 84.9632 65.6331C83.4227 63.5957 82.5531 61.2353 82.3543 58.5519L90.33 58.0301C90.6282 59.5706 91.1748 60.8875 91.9699 61.9807C92.8147 63.0243 93.9079 63.8442 95.2496 64.4405C96.641 64.9871 98.2561 65.2605 100.095 65.2605C102.182 65.2605 104.045 64.8878 105.685 64.1424C107.325 63.3473 108.145 62.1049 108.145 60.4154C108.095 59.2227 107.723 58.2786 107.027 57.5829C106.381 56.8872 105.561 56.3654 104.567 56.0175C103.573 55.6697 102.207 55.3218 100.467 54.974C100.07 54.9243 99.4984 54.8001 98.753 54.6013C95.4236 53.9056 92.6904 53.1602 90.5536 52.3651C88.4168 51.5203 86.6776 50.3525 85.3359 48.8617C83.9942 47.3213 83.3233 45.3832 83.3233 43.0477C83.3233 40.5133 83.9693 38.3268 85.2613 36.4882C86.5533 34.5998 88.392 33.1587 90.7773 32.1649C93.2122 31.1213 96.0447 30.5995 99.2748 30.5995C103.499 30.5995 107.101 31.7673 110.083 34.1029C113.065 36.3888 114.878 39.4946 115.524 43.4204L107.549 43.8676ZM116.191 51.247C116.191 47.0728 116.961 43.4452 118.502 40.3642C120.042 37.2336 122.229 34.8235 125.061 33.1339C127.894 31.4443 131.174 30.5995 134.901 30.5995C138.131 30.5995 141.038 31.3201 143.622 32.7612C146.255 34.2023 148.367 36.4385 149.958 39.4698C151.597 42.501 152.492 46.2777 152.641 50.7998L152.716 53.4832H124.316C124.614 57.2102 125.683 60.0924 127.521 62.1298C129.36 64.1672 131.82 65.1859 134.901 65.1859C136.888 65.1859 138.702 64.6641 140.342 63.6206C141.982 62.5273 143.199 61.0365 143.994 59.1482L152.119 59.7445C150.976 63.4218 148.815 66.3785 145.634 68.6147C142.504 70.8012 138.926 71.8945 134.901 71.8945C131.174 71.8945 127.894 71.0497 125.061 69.3601C122.229 67.6706 120.042 65.2853 118.502 62.2043C116.961 59.0737 116.191 55.4212 116.191 51.247ZM144.516 47.52C144.019 43.9918 142.901 41.4078 141.162 39.7679C139.423 38.128 137.336 37.3081 134.901 37.3081C132.018 37.3081 129.683 38.2026 127.894 39.9915C126.105 41.7805 124.962 44.29 124.465 47.52H144.516ZM161.9 31.494L162.273 42.0041L161.304 41.1842C161.95 37.6063 163.416 34.9477 165.702 33.2084C168.037 31.4692 170.87 30.5995 174.199 30.5995C178.473 30.5995 181.753 31.9909 184.039 34.7738C186.374 37.5069 187.542 41.1096 187.542 45.582V71H179.79V47.8927C179.79 45.5075 179.541 43.5446 179.044 42.0041C178.547 40.4139 177.727 39.2213 176.585 38.4262C175.491 37.5814 174.025 37.159 172.187 37.159C169.205 37.159 166.87 38.0783 165.18 39.917C163.49 41.7556 162.646 44.4142 162.646 47.8927V71H154.894V31.494H161.9ZM202.548 22.5493V59.7445C202.548 61.3347 202.92 62.5522 203.666 63.397C204.461 64.1921 205.629 64.5896 207.169 64.5896H212.983V71H206.498C202.672 71 199.765 70.031 197.777 68.093C195.789 66.1549 194.795 63.3721 194.795 59.7445V22.5493H202.548ZM213.058 31.494V37.9044H188.832V31.494H213.058ZM222.676 31.494V71H214.924V31.494H222.676ZM222.9 18.0769V25.6054H214.85V18.0769H222.9ZM233.857 31.494L234.23 42.0041L233.261 41.1842C233.907 37.6063 235.373 34.9477 237.659 33.2084C239.994 31.4692 242.827 30.5995 246.156 30.5995C250.43 30.5995 253.71 31.9909 255.995 34.7738C258.331 37.5069 259.499 41.1096 259.499 45.582V71H251.747V47.8927C251.747 45.5075 251.498 43.5446 251.001 42.0041C250.504 40.4139 249.684 39.2213 248.541 38.4262C247.448 37.5814 245.982 37.159 244.144 37.159C241.162 37.159 238.826 38.0783 237.137 39.917C235.447 41.7556 234.603 44.4142 234.603 47.8927V71H226.85V31.494H233.857ZM260.699 51.247C260.699 47.0728 261.469 43.4452 263.01 40.3642C264.55 37.2336 266.737 34.8235 269.569 33.1339C272.402 31.4443 275.681 30.5995 279.408 30.5995C282.638 30.5995 285.545 31.3201 288.13 32.7612C290.763 34.2023 292.875 36.4385 294.465 39.4698C296.105 42.501 297 46.2777 297.149 50.7998L297.223 53.4832H268.824C269.122 57.2102 270.19 60.0924 272.029 62.1298C273.868 64.1672 276.327 65.1859 279.408 65.1859C281.396 65.1859 283.21 64.6641 284.85 63.6206C286.49 62.5273 287.707 61.0365 288.502 59.1482L296.627 59.7445C295.484 63.4218 293.322 66.3785 290.142 68.6147C287.011 70.8012 283.434 71.8945 279.408 71.8945C275.681 71.8945 272.402 71.0497 269.569 69.3601C266.737 67.6706 264.55 65.2853 263.01 62.2043C261.469 59.0737 260.699 55.4212 260.699 51.247ZM289.024 47.52C288.527 43.9918 287.409 41.4078 285.67 39.7679C283.93 38.128 281.843 37.3081 279.408 37.3081C276.526 37.3081 274.191 38.2026 272.402 39.9915C270.613 41.7805 269.47 44.29 268.973 47.52H289.024ZM307.963 18.0769V61.9807C307.963 62.8255 308.162 63.4715 308.559 63.9187C309.006 64.366 309.652 64.5896 310.497 64.5896H313.777V71H308.857C306.273 71 304.186 70.2049 302.596 68.6147C301.006 67.0246 300.211 64.9374 300.211 62.3534V18.0769H307.963Z"
        fill="var(--c-text)"
      />
      <path
        d="M40.5437 14.2436C40.9913 14.2428 41.4347 14.3302 41.8485 14.5009C42.2623 14.6716 42.6384 14.9221 42.9553 15.2382V15.2518C47.3367 19.5819 51.3177 24.2992 54.8494 29.3463C59.6589 36.3425 64.3866 45.5594 64.3866 55.117C64.3866 64.225 61.9341 71.1394 57.4449 75.7921C52.9488 80.4449 47.1951 83.2449 40.8734 83.2449C34.5516 83.2449 28.1319 80.4449 23.6426 75.7921C19.1533 71.1394 16.7009 64.225 16.7009 55.117C16.7009 45.5594 21.4286 36.3425 26.2381 29.3463C29.7673 24.2972 33.746 19.5775 38.1254 15.245C38.4417 14.9277 38.8244 14.6759 39.2382 14.504C39.652 14.3322 40.0957 14.2437 40.5437 14.2436Z"
        fill="url(#fullLogoGrad)"
      />
      <defs>
        <linearGradient
          id="fullLogoGrad"
          x1="29.5563"
          y1="79.9487"
          x2="40.9832"
          y2="14.4634"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F46F29" />
          <stop offset="1" stopColor="#F59B4C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SentinelSymbol() {
  return (
    <svg
      width="26"
      height="37"
      viewBox="14 12 52 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SENTINEL"
      role="img"
    >
      <path
        d="M40.5437 14.2436C40.9913 14.2428 41.4347 14.3302 41.8485 14.5009C42.2623 14.6716 42.6384 14.9221 42.9553 15.2382V15.2518C47.3367 19.5819 51.3177 24.2992 54.8494 29.3463C59.6589 36.3425 64.3866 45.5594 64.3866 55.117C64.3866 64.225 61.9341 71.1394 57.4449 75.7921C52.9488 80.4449 47.1951 83.2449 40.8734 83.2449C34.5516 83.2449 28.1319 80.4449 23.6426 75.7921C19.1533 71.1394 16.7009 64.225 16.7009 55.117C16.7009 45.5594 21.4286 36.3425 26.2381 29.3463C29.7673 24.2972 33.746 19.5775 38.1254 15.245C38.4417 14.9277 38.8244 14.6759 39.2382 14.504C39.652 14.3322 40.0957 14.2437 40.5437 14.2436Z"
        fill="url(#symbolGrad)"
      />
      <defs>
        <linearGradient
          id="symbolGrad"
          x1="29.5563"
          y1="79.9487"
          x2="40.9832"
          y2="14.4634"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F46F29" />
          <stop offset="1" stopColor="#F59B4C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Nav data ─────────────────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'EXECUTION',
    items: [
      { id: 'actuals', label: 'Actuals', icon: ClipboardCheck },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'PLANNING',
    items: [{ id: 'schedule', label: 'Schedule', icon: CalendarDays }],
  },
  {
    label: 'REVIEW',
    items: [
      { id: 'review-queue', label: 'Review Queue', icon: ListChecks },
      { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { id: 'performance', label: 'Performance', icon: TrendingUp },
      { id: 'data-quality', label: 'Data Quality', icon: ShieldCheck },
      { id: 'exec-knowledge', label: 'Execution Knowledge', icon: BookOpen },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'audit-log', label: 'Audit Log', icon: ScrollText },
      { id: 'admin', label: 'Administration', icon: Settings2 },
    ],
  },
]

// ── Tooltip ───────────────────────────────────────────────────────────────────
// Rendered via portal into document.body so the sidebar's overflow:hidden
// containers never clip it.

function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    if (!anchorRef.current) return
    timerRef.current = setTimeout(() => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      })
    }, 440)
  }, [])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPos(null)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div
      ref={anchorRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {pos && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium leading-none"
          style={{
            top: pos.top,
            left: pos.left,
            transform: 'translateY(-50%)',
            background: 'var(--c-text)',
            color: 'var(--c-page)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '-0.01em',
          }}
          role="tooltip"
          aria-hidden="true"
        >
          {label}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent"
            style={{ borderRightColor: 'var(--c-text)' }}
          />
        </div>,
        document.body,
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeNav: string
  onNavChange: (id: string) => void
  onCaptureProgress?: () => void
}

export default function Sidebar({ collapsed, onToggle, activeNav, onNavChange, onCaptureProgress }: SidebarProps) {
  const [projectOpen, setProjectOpen] = useState(false)
  const access = useConnectedProject()
  const showCapture = canCaptureProgress(access.role)

  return (
    <aside
      aria-label="Primary navigation"
      style={{
        width: collapsed ? 72 : 248,
        minWidth: collapsed ? 72 : 248,
        background: 'var(--c-glass)',
        backdropFilter: 'var(--backdrop)',
        WebkitBackdropFilter: 'var(--backdrop)',
        borderRight: '1px solid var(--c-border)',
        boxShadow: 'var(--c-shadow-glass)',
        transition: 'width 220ms ease-out, min-width 220ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. Fixed brand area ───────────────────────────────── */}
      <div
        className="flex shrink-0 items-center overflow-hidden"
        style={{
          height: 60,
          paddingLeft: collapsed ? 22 : 18,
          paddingRight: collapsed ? 22 : 18,
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        {collapsed ? <SentinelSymbol /> : <SentinelFullLogo />}
      </div>

      {/* ── 2. Fixed project selector ─────────────────────────── */}
      <div
        className="shrink-0"
        style={{
          borderBottom: '1px solid var(--c-border)',
          padding: collapsed ? '8px 10px' : '8px 10px',
        }}
      >
        {collapsed ? (
          <NavTooltip label={access.project?.name ?? 'Project'}>
            <div className="flex justify-center">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{ background: 'var(--c-brand-tint)' }}
              >
                <FolderOpen size={15} strokeWidth={1.8} style={{ color: '#F46F29' }} />
              </div>
            </div>
          </NavTooltip>
        ) : (
          <div>
            <span
              className="block px-1 text-[10px] font-semibold uppercase"
              style={{ color: 'var(--c-subtle)', letterSpacing: '0.09em', marginBottom: 3 }}
            >
              Project
            </span>
            <button
              className="flex w-full items-center justify-between rounded-[8px] px-2 py-1.5 text-left transition-colors duration-150"
              onClick={() => setProjectOpen((o) => !o)}
              aria-expanded={access.projects.length > 1 ? projectOpen : undefined}
              disabled={access.projects.length <= 1}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
              }
            >
              <span
                className="text-[13px] font-medium leading-[18px]"
                style={{ color: 'var(--c-text)' }}
              >
                {access.project?.name}
              </span>
              {access.projects.length > 1 && <ChevronDown
                size={13}
                strokeWidth={2}
                style={{
                  color: 'var(--c-muted)',
                  transform: projectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease-out',
                  flexShrink: 0,
                  marginLeft: 4,
                }}
              />}
            </button>
            {projectOpen && access.projects.length > 1 && access.projects.map(project => (
              <button key={project.id} className="mt-0.5 flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left transition-colors duration-150"
                onClick={() => { access.selectProject(project.id); setProjectOpen(false) }}
                aria-current={project.id === access.project?.id ? 'true' : undefined}
                style={{ color: project.id === access.project?.id ? '#F46F29' : 'var(--c-muted)' }}>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.id === access.project?.id ? '#F46F29' : 'var(--c-border-strong)' }} />
                <span className="truncate text-[12px]">{project.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Scrollable navigation ──────────────────────────── */}
      <nav
        className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-2 py-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}
        aria-label="Main navigation"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.scrollbarColor =
            'var(--c-border-strong) transparent')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.scrollbarColor = 'transparent transparent')
        }
      >
        {navGroups
          .map((group) => ({ ...group, items: group.items.filter((item) => shellNavVisible(access.role, item.id)) }))
          .filter((group) => group.items.length > 0)
          .map((group, groupIdx) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <div
                className="mb-0.5 px-2 py-1 text-[10px] font-semibold uppercase"
                style={{ color: 'var(--c-subtle)', letterSpacing: '0.1em' }}
              >
                {group.label}
              </div>
            )}
            {collapsed && groupIdx > 0 && (
              <div
                className="mx-auto my-2 w-6"
                style={{ height: '1px', background: 'var(--c-border)' }}
              />
            )}
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id

              const navButton = (
                <button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative flex w-full items-center transition-colors duration-150"
                  style={{
                    height: 42,
                    borderRadius: 10,
                    paddingLeft: collapsed ? 0 : 10,
                    paddingRight: collapsed ? 0 : 10,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 10,
                    background: isActive ? 'var(--c-brand-tint)' : 'transparent',
                    color: isActive ? '#F46F29' : 'var(--c-muted)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                      style={{ width: 3, height: 22, background: '#F46F29' }}
                    />
                  )}
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={{ color: isActive ? '#F46F29' : 'var(--c-muted)', flexShrink: 0 }}
                  />
                  {!collapsed && (
                    <span
                      className="truncate text-[14px] leading-[21px]"
                      style={{
                        color: isActive ? '#F46F29' : 'var(--c-text)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              )

              return collapsed ? (
                <NavTooltip key={item.id} label={item.label}>
                  {navButton}
                </NavTooltip>
              ) : (
                <div key={item.id}>{navButton}</div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── 4. Fixed bottom area ─────────────────────────────── */}
      <div
        className="shrink-0 p-2"
        style={{ borderTop: '1px solid var(--c-border)' }}
      >
        {/* Capture Progress — gradient CTA (hidden for read-only roles) */}
        {showCapture && (collapsed ? (
          <NavTooltip label="Capture Progress">
            <button
              onClick={onCaptureProgress}
              className="flex w-full items-center justify-center rounded-[10px] transition-all duration-[180ms] hover:opacity-90 active:scale-[0.99]"
              style={{
                height: 42,
                background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                boxShadow: '0 2px 8px rgba(244,111,41,0.28)',
              }}
              aria-label="Capture Progress"
            >
              <PlusCircle size={17} strokeWidth={2} color="white" />
            </button>
          </NavTooltip>
        ) : (
          <button
            onClick={onCaptureProgress}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold text-white transition-all duration-[180ms] hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
            style={{
              height: 42,
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 10px rgba(244,111,41,0.26)',
              letterSpacing: '-0.01em',
            }}
          >
            <PlusCircle size={15} strokeWidth={2.2} />
            Capture Progress
          </button>
        ))}

        {/* Collapse toggle — subtle icon-only */}
        <div className="mt-1 flex justify-center">
          <NavTooltip label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors duration-150"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ color: 'var(--c-subtle)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--c-border)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--c-muted)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--c-subtle)'
              }}
            >
              {collapsed ? (
                <ChevronRight size={13} strokeWidth={2} />
              ) : (
                <ChevronLeft size={13} strokeWidth={2} />
              )}
            </button>
          </NavTooltip>
        </div>
      </div>
    </aside>
  )
}
