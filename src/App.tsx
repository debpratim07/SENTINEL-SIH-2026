import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RoleProvider, useRole } from './context/RoleContext'
import { ScheduleDataProvider } from './context/ScheduleDataContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CaptureChooser from './components/capture/CaptureChooser'
import LogWithSentinelDrawer from './components/capture/LogWithSentinelDrawer'
import UploadReportDrawer from './components/capture/UploadReportDrawer'
import LoginPage from './pages/auth/LoginPage'
import GlobalSearch from './components/GlobalSearch'
import NotificationsPopover from './components/NotificationsPopover'
import { ProfileDropdown, ProfilePage } from './components/ProfileMenu'
import SentinelGuide from './components/SentinelGuide'
import { knownRoutes, parseRoute, routeFor } from './routing'

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const ReviewQueue = lazy(() => import('./pages/ReviewQueue'))
const SchedulePage = lazy(() => import('./pages/schedule/SchedulePage'))
const ScheduleActivityDetail = lazy(() => import('./pages/schedule/ScheduleActivityDetail'))
const Reports = lazy(() => import('./pages/Reports'))
const ReportAnalysis = lazy(() => import('./pages/ReportAnalysis'))
const ActualsPage = lazy(() => import('./pages/actuals/ActualsPage'))
const ActualDetail = lazy(() => import('./pages/actuals/ActualDetail'))
const ExceptionsPage = lazy(() => import('./pages/exceptions/ExceptionsPage'))
const ExceptionDetail = lazy(() => import('./pages/exceptions/ExceptionDetail'))
const PerformancePage = lazy(() => import('./pages/performance/PerformancePage'))
const DataQualityPage = lazy(() => import('./pages/insights/DataQualityPage'))
const ExecutionKnowledgePage = lazy(() => import('./pages/insights/ExecutionKnowledgePage'))
const AuditLogPage = lazy(() => import('./pages/audit/AuditLogPage'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

const OVERFLOW_HIDDEN_ROUTES = new Set([
  'schedule', 'reports', 'actuals', 'exceptions', 'audit-log', 'admin', 'review-queue',
])

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--c-page)', color: 'var(--c-muted)' }}>
      <span className="text-[13px]">Loading SENTINEL…</span>
    </div>
  )
}

function UnavailablePage({ unauthorized, onReturn }: { unauthorized: boolean; onReturn: () => void }) {
  return (
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
          {unauthorized
            ? 'This section of SENTINEL is not available for your current role.'
            : 'The requested SENTINEL page does not exist.'}
        </p>
        <button onClick={onReturn} className="mt-4 text-[13px] font-medium hover:underline" style={{ color: '#F46F29' }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}

function AppShell() {
  const auth = useAuth()
  const { canSeeNav, membershipLoading } = useRole()
  const location = useLocation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [notifCount, setNotifCount] = useState(3)

  const [captureChooserOpen, setCaptureChooserOpen] = useState(false)
  const [logDrawerOpen, setLogDrawerOpen] = useState(false)
  const [uploadReportOpen, setUploadReportOpen] = useState(false)

  const parsedRoute = parseRoute(location.pathname)
  const activeNav = parsedRoute.nav === 'login' || parsedRoute.nav === '' ? 'dashboard' : parsedRoute.nav
  const selectedActivityId = activeNav === 'schedule' ? parsedRoute.recordId : null
  const activeReportId = activeNav === 'reports' ? parsedRoute.recordId : null
  const activeActualId = activeNav === 'actuals' ? parsedRoute.recordId : null
  const activeExceptionId = activeNav === 'exceptions' ? parsedRoute.recordId : null
  const routeExists = knownRoutes.has(activeNav)
  const routeAllowed = routeExists && canSeeNav(activeNav)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (auth.user && (location.pathname === '/' || location.pathname === '/login')) {
      navigate('/dashboard', { replace: true })
    }
  }, [auth.user, location.pathname, navigate])

  function handleNavChange(nav: string) {
    navigate(routeFor(nav))
  }

  function handleNavigateToRecord(page: string, recordId?: string) {
    navigate(routeFor(page, recordId))
  }

  function handleSearchNavigate(nav: string, id?: string) {
    setSearchOpen(false)
    handleNavigateToRecord(nav, id)
  }

  async function handleProfileNavigate(nav: string) {
    setProfileOpen(false)
    if (nav === '__logout') {
      await auth.signOut()
      navigate('/login', { replace: true })
      return
    }
    handleNavChange(nav)
  }

  const handleReviewReport = useCallback((reportId: string) => {
    navigate(routeFor('reports', reportId))
  }, [navigate])

  if (auth.loading || membershipLoading) return <LoadingScreen />

  if (!auth.user) {
    return (
      <LoginPage
        isDemoMode={auth.isDemoMode}
        onLogin={async (email, password) => {
          await auth.signIn(email, password)
          navigate('/dashboard', { replace: true })
        }}
        onForgotPassword={auth.requestPasswordReset}
      />
    )
  }

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

  if (activeNav === 'profile') {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-page)' }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)}
          activeNav={activeNav} onNavChange={handleNavChange} onCaptureProgress={() => setCaptureChooserOpen(true)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header dark={dark} onToggleDark={() => setDark((current) => !current)}
            onOpenSearch={() => setSearchOpen(true)} onOpenNotifications={() => setNotificationsOpen((value) => !value)}
            onOpenProfile={() => setProfileOpen((value) => !value)} onOpenGuide={() => setGuideOpen((value) => !value)}
            notificationCount={notifCount} />
          <ProfilePage onBack={() => handleNavChange('dashboard')} dark={dark} onToggleDark={() => setDark((current) => !current)} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-page)' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onCaptureProgress={() => setCaptureChooserOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          dark={dark}
          onToggleDark={() => setDark((current) => !current)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotificationsOpen((value) => !value)}
          onOpenProfile={() => setProfileOpen((value) => !value)}
          onOpenGuide={() => setGuideOpen((value) => !value)}
          notificationCount={notifCount}
        />

        <main
          className="flex-1"
          id="main-content"
          tabIndex={-1}
          aria-label="Main content"
          style={{ overflow: mainOverflow, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <Suspense fallback={<LoadingScreen />}>
          {!routeAllowed && <UnavailablePage unauthorized={routeExists} onReturn={() => handleNavChange('dashboard')} />}

          {routeAllowed && activeNav === 'dashboard' && <Dashboard onCaptureProgress={() => setCaptureChooserOpen(true)} onNavigate={handleNavigateToRecord} />}
          {routeAllowed && activeNav === 'review-queue' && <ReviewQueue />}

          {routeAllowed && activeNav === 'schedule' && !selectedActivityId && (
            <SchedulePage onSelectActivity={(id) => handleNavigateToRecord('schedule', id)} />
          )}
          {routeAllowed && activeNav === 'schedule' && selectedActivityId && (
            <ScheduleActivityDetail
              activityId={selectedActivityId}
              onBack={() => handleNavChange('schedule')}
              onViewActual={(id) => handleNavigateToRecord('actuals', id)}
              onViewAuditLog={() => handleNavigateToRecord('audit-log')}
              onViewSourceEvidence={() => handleNavigateToRecord('reports', 'RPT-2026-0001')}
            />
          )}

          {routeAllowed && activeNav === 'reports' && !activeReportId && (
            <Reports onOpenReport={(id) => handleNavigateToRecord('reports', id)} onUploadReport={() => setUploadReportOpen(true)} />
          )}
          {routeAllowed && activeNav === 'reports' && activeReportId && (
            <ReportAnalysis
              reportId={activeReportId}
              onBack={() => handleNavChange('reports')}
              onOpenReviewMatch={(eventId) => navigate(`/review-queue?eventId=${encodeURIComponent(eventId)}`)}
            />
          )}

          {routeAllowed && activeNav === 'actuals' && !activeActualId && (
            <ActualsPage onSelectActual={(id) => handleNavigateToRecord('actuals', id)} onCaptureProgress={() => setCaptureChooserOpen(true)} />
          )}
          {routeAllowed && activeNav === 'actuals' && activeActualId && (
            <ActualDetail
              actualId={activeActualId}
              onBack={() => handleNavChange('actuals')}
              onViewException={(id) => handleNavigateToRecord('exceptions', id)}
              onViewScheduleActivity={(id) => handleNavigateToRecord('schedule', id)}
              onViewSourceEvidence={() => handleNavigateToRecord('reports', 'RPT-2026-0001')}
            />
          )}

          {routeAllowed && activeNav === 'exceptions' && !activeExceptionId && (
            <ExceptionsPage onSelectException={(id) => handleNavigateToRecord('exceptions', id)} />
          )}
          {routeAllowed && activeNav === 'exceptions' && activeExceptionId && (
            <ExceptionDetail
              exceptionId={activeExceptionId}
              onBack={() => handleNavChange('exceptions')}
              onViewActual={(id) => handleNavigateToRecord('actuals', id)}
              onViewScheduleActivity={(id) => handleNavigateToRecord('schedule', id)}
            />
          )}

          {routeAllowed && activeNav === 'performance' && <PerformancePage />}
          {routeAllowed && activeNav === 'data-quality' && <DataQualityPage />}
          {routeAllowed && activeNav === 'exec-knowledge' && <ExecutionKnowledgePage />}
          {routeAllowed && activeNav === 'audit-log' && <AuditLogPage />}
          {routeAllowed && activeNav === 'admin' && <AdminPage />}
          </Suspense>
        </main>
      </div>

      <CaptureChooser
        open={captureChooserOpen}
        onClose={() => setCaptureChooserOpen(false)}
        onLogWithSentinel={() => setLogDrawerOpen(true)}
        onUploadReport={() => setUploadReportOpen(true)}
      />
      <LogWithSentinelDrawer open={logDrawerOpen} onClose={() => setLogDrawerOpen(false)} />
      <UploadReportDrawer open={uploadReportOpen} onClose={() => setUploadReportOpen(false)}
        onReviewReport={(reportId) => handleReviewReport(reportId ?? 'RPT-2026-0001')} />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={handleSearchNavigate} />
      <NotificationsPopover
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigate={(nav, id) => { setNotificationsOpen(false); handleNavigateToRecord(nav, id) }}
        onCountChange={setNotifCount}
      />
      <ProfileDropdown
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onNavigate={(nav) => { void handleProfileNavigate(nav) }}
        dark={dark}
        onToggleDark={() => setDark((current) => !current)}
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <ScheduleDataProvider>
            <AppShell />
          </ScheduleDataProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
