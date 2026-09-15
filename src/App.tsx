import { useState, useEffect, useCallback } from 'react'
import { RoleProvider } from './context/RoleContext'
import { useConnectedAuth } from './context/ConnectedAuthContext'
import { useConnectedProject } from './context/ConnectedProjectContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/dashboard/Dashboard'
import ReviewQueue from './pages/ReviewQueue'
import SchedulePage from './pages/schedule/SchedulePage'
import ScheduleActivityDetail from './pages/schedule/ScheduleActivityDetail'
import Reports from './pages/Reports'
import ReportAnalysis from './pages/ReportAnalysis'
import CaptureChooser from './components/capture/CaptureChooser'
import LogWithSentinelDrawer from './components/capture/LogWithSentinelDrawer'
import UploadReportDrawer from './components/capture/UploadReportDrawer'
import ActualsPage from './pages/actuals/ActualsPage'
import ActualDetail from './pages/actuals/ActualDetail'
import ExceptionsPage from './pages/exceptions/ExceptionsPage'
import ExceptionDetail from './pages/exceptions/ExceptionDetail'
import PerformancePage from './pages/performance/PerformancePage'
import DataQualityPage from './pages/insights/DataQualityPage'
import ExecutionKnowledgePage from './pages/insights/ExecutionKnowledgePage'
import AuditLogPage from './pages/audit/AuditLogPage'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/auth/LoginPage'
import GlobalSearch from './components/GlobalSearch'
import NotificationsPopover from './components/NotificationsPopover'
import { ProfileDropdown, ProfilePage } from './components/ProfileMenu'
import SentinelGuide from './components/SentinelGuide'

const OVERFLOW_HIDDEN_ROUTES = new Set([
  'schedule', 'reports', 'actuals', 'exceptions', 'audit-log', 'admin', 'review-queue',
])

function AppShell() {
  const auth = useConnectedAuth()
  const [dark, setDark] = useState(false)
  const [shellError, setShellError] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')

  // Overlay states
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  // Capture drawers
  const [captureChooserOpen, setCaptureChooserOpen] = useState(false)
  const [logDrawerOpen, setLogDrawerOpen] = useState(false)
  const [uploadReportOpen, setUploadReportOpen] = useState(false)

  // Detail states
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [activeReportId, setActiveReportId] = useState<string | null>(null)
  const [activeActualId, setActiveActualId] = useState<string | null>(null)
  const [activeExceptionId, setActiveExceptionId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Global / keyboard shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleNavChange(nav: string) {
    setActiveNav(nav)
    if (nav !== 'schedule') setSelectedActivityId(null)
    if (nav !== 'reports') setActiveReportId(null)
    if (nav !== 'actuals') setActiveActualId(null)
    if (nav !== 'exceptions') setActiveExceptionId(null)
  }

  function handleNavigateToRecord(page: string, recordId?: string) {
    handleNavChange(page)
    if (recordId) {
      if (page === 'schedule') setSelectedActivityId(recordId)
      else if (page === 'actuals') setActiveActualId(recordId)
      else if (page === 'exceptions') setActiveExceptionId(recordId)
      else if (page === 'reports') setActiveReportId(recordId)
    }
  }

  function handleSearchNavigate(nav: string, id?: string) {
    setSearchOpen(false)
    handleNavigateToRecord(nav, id)
  }

  function handleProfileNavigate(nav: string) {
    setProfileOpen(false)
    if (nav === '__logout') {
      void auth.signOut().catch(cause => setShellError(cause instanceof Error ? cause.message : 'Unable to sign out.'))
      return
    }
    handleNavChange(nav)
  }

  function handleViewActualFromException(actualId: string) {
    setActiveNav('actuals')
    setActiveExceptionId(null)
    setActiveActualId(actualId)
  }

  function handleViewExceptionFromActual(exceptionId: string) {
    setActiveNav('exceptions')
    setActiveActualId(null)
    setActiveExceptionId(exceptionId)
  }

  const handleReviewReport = useCallback((reportId: string) => {
    setActiveNav('reports')
    setActiveReportId(reportId)
  }, [])

  const isScheduleNoDetail = activeNav === 'schedule' && !selectedActivityId
  const isReportsListPage = activeNav === 'reports' && !activeReportId
  const isActualsList = activeNav === 'actuals' && !activeActualId
  const isExceptionsList = activeNav === 'exceptions' && !activeExceptionId

  const mainOverflow =
    OVERFLOW_HIDDEN_ROUTES.has(activeNav) &&
    (isScheduleNoDetail || isReportsListPage || isActualsList || isExceptionsList ||
      activeNav === 'audit-log' || activeNav === 'admin' || activeNav === 'review-queue')
      ? 'hidden'
      : 'auto'

  // All known nav routes (for fallback detection)
  const KNOWN_ROUTES = new Set([
    'dashboard','review-queue','schedule','reports','actuals','exceptions',
    'performance','data-quality','exec-knowledge','audit-log','admin','profile',
  ])

  if (activeNav === 'profile') {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-page)' }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)}
          activeNav={activeNav} onNavChange={handleNavChange} onCaptureProgress={() => setCaptureChooserOpen(true)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {shellError && <p role="alert" className="px-6 py-2 text-[13px] text-red-600">{shellError}</p>}
          <Header dark={dark} onToggleDark={() => setDark((d) => !d)}
            onOpenSearch={() => setSearchOpen(true)} onOpenNotifications={() => setNotificationsOpen((v) => !v)}
            onOpenProfile={() => setProfileOpen((v) => !v)} onOpenGuide={() => setGuideOpen((v) => !v)}
            notificationCount={0} />
          <ProfilePage onBack={() => handleNavChange('dashboard')} dark={dark} onToggleDark={() => setDark((d) => !d)} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-page)' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onCaptureProgress={() => setCaptureChooserOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {shellError && <p role="alert" className="px-6 py-2 text-[13px] text-red-600">{shellError}</p>}
        <Header
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotificationsOpen((v) => !v)}
          onOpenProfile={() => setProfileOpen((v) => !v)}
          onOpenGuide={() => setGuideOpen((v) => !v)}
          notificationCount={0}
        />

        <div role="note" className="shrink-0 px-7 py-2 text-[12px]" style={{ background: 'var(--c-brand-tint)', color: 'var(--c-text)', borderBottom: '1px solid var(--c-border)' }}>
          Capture, human review, schedule and verified actuals are connected to this project. Audit and analytics screens still use sample data; their real audit records remain in <a className="font-semibold underline" href="/workspace">Connected Workspace</a>.
        </div>

        <main
          className="flex-1"
          id="main-content"
          tabIndex={-1}
          aria-label="Main content"
          style={{ overflow: mainOverflow, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          {activeNav === 'dashboard' && <Dashboard onCaptureProgress={() => setCaptureChooserOpen(true)} onNavigate={handleNavigateToRecord} />}
          {activeNav === 'review-queue' && <ReviewQueue />}

          {activeNav === 'schedule' && !selectedActivityId && (
            <SchedulePage onSelectActivity={(id) => setSelectedActivityId(id)} />
          )}
          {activeNav === 'schedule' && selectedActivityId && (
            <ScheduleActivityDetail
              activityId={selectedActivityId}
              onBack={() => setSelectedActivityId(null)}
              onViewActual={(id) => handleNavigateToRecord('actuals', id)}
              onViewAuditLog={() => handleNavigateToRecord('audit-log')}
              onViewSourceEvidence={() => handleNavigateToRecord('reports', 'RPT-2026-0001')}
            />
          )}

          {activeNav === 'reports' && !activeReportId && (
            <Reports onOpenReport={(id) => setActiveReportId(id)} onUploadReport={() => setUploadReportOpen(true)} />
          )}
          {activeNav === 'reports' && activeReportId && (
            <ReportAnalysis reportId={activeReportId} onBack={() => setActiveReportId(null)} onOpenReviewMatch={(_eventId) => {}} />
          )}

          {activeNav === 'actuals' && !activeActualId && (
            <ActualsPage onSelectActual={(id) => setActiveActualId(id)} onCaptureProgress={() => setCaptureChooserOpen(true)} />
          )}
          {activeNav === 'actuals' && activeActualId && (
            <ActualDetail
              actualId={activeActualId}
              onBack={() => setActiveActualId(null)}
              onViewException={handleViewExceptionFromActual}
              onViewScheduleActivity={(id) => handleNavigateToRecord('schedule', id)}
              onViewSourceEvidence={() => handleNavigateToRecord('reports', 'RPT-2026-0001')}
            />
          )}

          {activeNav === 'exceptions' && !activeExceptionId && (
            <ExceptionsPage onSelectException={(id) => setActiveExceptionId(id)} />
          )}
          {activeNav === 'exceptions' && activeExceptionId && (
            <ExceptionDetail
              exceptionId={activeExceptionId}
              onBack={() => setActiveExceptionId(null)}
              onViewActual={handleViewActualFromException}
              onViewScheduleActivity={(id) => handleNavigateToRecord('schedule', id)}
            />
          )}

          {activeNav === 'performance'    && <PerformancePage />}
          {activeNav === 'data-quality'   && <DataQualityPage />}
          {activeNav === 'exec-knowledge' && <ExecutionKnowledgePage />}
          {activeNav === 'audit-log'      && <AuditLogPage />}
          {activeNav === 'admin'          && <AdminPage />}

          {/* Fallback for unknown routes */}
          {!KNOWN_ROUTES.has(activeNav) && (
            <div className="flex h-full items-center justify-center" style={{ padding: 32 }}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px]"
                  style={{ background: 'var(--c-brand-tint)' }}>
                  <span className="text-[20px]" style={{ color: '#F46F29' }}>⊘</span>
                </div>
                <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
                  Page not available
                </h2>
                <p className="mt-2 text-[14px] leading-[21px]" style={{ color: 'var(--c-muted)', maxWidth: 360 }}>
                  This section of SENTINEL is not available for your current role.
                </p>
                <button onClick={() => handleNavChange('dashboard')} className="mt-4 text-[13px] font-medium hover:underline" style={{ color: '#F46F29' }}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Global overlays ──────────────────────────────────────── */}
      <CaptureChooser
        open={captureChooserOpen}
        onClose={() => setCaptureChooserOpen(false)}
        onManualCapture={() => setLogDrawerOpen(true)}
      />
      <LogWithSentinelDrawer open={logDrawerOpen} onClose={() => setLogDrawerOpen(false)} />
      <UploadReportDrawer open={uploadReportOpen} onClose={() => setUploadReportOpen(false)}
        onReviewReport={() => handleReviewReport('RPT-2026-0001')} />

      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />

      <NotificationsPopover
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigate={(nav, id) => { setNotificationsOpen(false); handleNavigateToRecord(nav, id) }}
        onCountChange={() => {}}
      />

      <ProfileDropdown
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onNavigate={handleProfileNavigate}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
      />

      <SentinelGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        currentPage={activeNav}
        onNavigate={(nav) => { setGuideOpen(false); handleNavChange(nav) }}
      />
    </div>
  )
}

export default function App({ authError = '' }: { authError?: string }) {
  const auth = useConnectedAuth()
  const access = useConnectedProject()

  if (auth.loading) return <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--c-page)', color: 'var(--c-text)' }}>Loading your session…</main>
  if (!auth.session) return <LoginPage initialError={authError} />

  if (access.loading && !access.identity) return <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--c-page)', color: 'var(--c-text)' }}>Loading project access…</main>

  if (access.error || !access.project) return <main className="flex min-h-screen items-center justify-center px-6" style={{ background: 'var(--c-page)', color: 'var(--c-text)' }}>
    <section className="w-full max-w-md rounded-[18px] p-8" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
      <p className="mb-2 text-[12px] font-semibold uppercase" style={{ color: '#F46F29' }}>SENTINEL · PROJECT ACCESS</p>
      <h1 className="mb-2 text-[22px] font-bold">{access.error ? 'Unable to load project access' : 'Your account is ready'}</h1>
      <p className="mb-2 text-[13px]" style={{ color: 'var(--c-muted)' }}>{access.error || 'A project administrator must assign your account to a project before you can use this workspace.'}</p>
      <p className="mb-5 text-[12px]" style={{ color: 'var(--c-subtle)' }}>{access.identity?.user.email ?? auth.user?.email}</p>
      <div className="flex gap-4 text-[13px] font-semibold">
        <button onClick={() => void access.refresh()} style={{ color: '#F46F29' }}>Check access again</button>
        <button onClick={() => void auth.signOut()} style={{ color: 'var(--c-muted)' }}>Sign out</button>
      </div>
    </section>
  </main>

  return <RoleProvider><AppShell key={`${auth.user?.id}:${access.project.id}`} /></RoleProvider>
}
