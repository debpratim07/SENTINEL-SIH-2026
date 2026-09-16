import { useEffect, useState } from 'react'
import { useConnectedAuth } from './context/ConnectedAuthContext'
import { useConnectedProject } from './context/ConnectedProjectContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/dashboard/Dashboard'
import ReviewQueue from './pages/ReviewQueue'
import SchedulePage from './pages/schedule/SchedulePage'
import ScheduleActivityDetail from './pages/schedule/ScheduleActivityDetail'
import CaptureChooser from './components/capture/CaptureChooser'
import LogWithSentinelDrawer from './components/capture/LogWithSentinelDrawer'
import ActualsPage from './pages/actuals/ActualsPage'
import ActualDetail from './pages/actuals/ActualDetail'
import AuditLogPage from './pages/audit/AuditLogPage'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/auth/LoginPage'
import { ProfileDropdown, ProfilePage } from './components/ProfileMenu'
import { shellNavVisible } from './lib/connected-shell'
import { shouldReduceMotion } from './lib/industrial-motion'
import { WorkflowLoading } from './components/industrial-flow/WorkflowFeedback'
import { PRIMARY_CONNECTED_ROUTES } from './lib/real-admin'

function AppShell(){
  const auth=useConnectedAuth();const access=useConnectedProject();const [dark,setDark]=useState(false);const [shellError,setShellError]=useState('')
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false);const [activeNav,setActiveNav]=useState('dashboard');const [profileOpen,setProfileOpen]=useState(false)
  const [mobileNavigationOpen,setMobileNavigationOpen]=useState(false)
  const [userReduced,setUserReduced]=useState(false);const [osReduced,setOsReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setOsReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
  useEffect(()=>{document.documentElement.dataset.motion=shouldReduceMotion(osReduced,userReduced)?'reduced':'full';return()=>{delete document.documentElement.dataset.motion}},[osReduced,userReduced])
  const [captureChooserOpen,setCaptureChooserOpen]=useState(false);const [logDrawerOpen,setLogDrawerOpen]=useState(false)
  const [selectedActivityId,setSelectedActivityId]=useState<string|null>(null);const [activeActualId,setActiveActualId]=useState<string|null>(null)
  useEffect(()=>{ document.documentElement.classList.toggle('dark',dark) },[dark])
  useEffect(()=>{document.body.classList.toggle('nav-open',mobileNavigationOpen);return()=>document.body.classList.remove('nav-open')},[mobileNavigationOpen])
  function navigate(nav:string){const allowed=(PRIMARY_CONNECTED_ROUTES as readonly string[]).includes(nav)||nav==='profile';setActiveNav(allowed&&shellNavVisible(access.role,nav)?nav:'dashboard');if(nav!=='schedule')setSelectedActivityId(null);if(nav!=='actuals')setActiveActualId(null)}
  function profileNavigate(nav:string){setProfileOpen(false);if(nav==='__logout'){void auth.signOut().catch(cause=>setShellError(cause instanceof Error?cause.message:'Unable to sign out.'));return}navigate(nav)}
  const header=<Header reducedMotion={shouldReduceMotion(osReduced,userReduced)} onToggleMotion={()=>setUserReduced(value=>!value)} osReduced={osReduced} pageTitle={activeNav.replace(/-/g,' ')} dark={dark} onToggleDark={()=>setDark(value=>!value)} onOpenProfile={()=>setProfileOpen(value=>!value)} onOpenNavigation={()=>setMobileNavigationOpen(true)}/>
  const sidebar=<Sidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(value=>!value)} activeNav={activeNav} onNavChange={navigate} onCaptureProgress={()=>setCaptureChooserOpen(true)} mobileOpen={mobileNavigationOpen} onMobileClose={()=>setMobileNavigationOpen(false)}/>
  if(activeNav==='profile')return <div className="app-shell flex h-screen overflow-hidden" style={{background:'var(--c-page)'}}>{sidebar}<div className="flex min-w-0 flex-1 flex-col overflow-hidden">{header}<ProfilePage onBack={()=>navigate('dashboard')} dark={dark} onToggleDark={()=>setDark(value=>!value)}/></div><ProfileDropdown open={profileOpen} onClose={()=>setProfileOpen(false)} onNavigate={profileNavigate} dark={dark} onToggleDark={()=>setDark(value=>!value)}/></div>
  return <div className="app-shell flex h-screen overflow-hidden" style={{background:'var(--c-page)'}}>{sidebar}<div className="flex min-w-0 flex-1 flex-col overflow-hidden">{shellError&&<p role="alert" className="px-6 py-2 text-[13px] text-red-600">{shellError}</p>}{header}<main className="flex min-h-0 flex-1 flex-col overflow-hidden" id="main-content">
    {activeNav==='dashboard'&&<div className="h-full overflow-auto"><Dashboard onCaptureProgress={()=>setCaptureChooserOpen(true)} onNavigate={navigate}/></div>}
    {activeNav==='review-queue'&&<ReviewQueue/>}
    {activeNav==='schedule'&&!selectedActivityId&&<SchedulePage onSelectActivity={setSelectedActivityId}/>}
    {activeNav==='schedule'&&selectedActivityId&&<ScheduleActivityDetail activityId={selectedActivityId} onBack={()=>setSelectedActivityId(null)} onViewActual={id=>{setActiveActualId(id);navigate('actuals')}} onViewAuditLog={()=>navigate('audit-log')} onViewSourceEvidence={()=>{}}/>}
    {activeNav==='actuals'&&!activeActualId&&<ActualsPage onSelectActual={setActiveActualId} onCaptureProgress={()=>setCaptureChooserOpen(true)}/>}
    {activeNav==='actuals'&&activeActualId&&<ActualDetail actualId={activeActualId} onBack={()=>setActiveActualId(null)} onViewException={()=>{}} onViewScheduleActivity={id=>{setSelectedActivityId(id);navigate('schedule')}} onViewSourceEvidence={()=>{}}/>}
    {activeNav==='audit-log'&&<AuditLogPage/>}{activeNav==='admin'&&<AdminPage/>}
  </main></div>
  <CaptureChooser open={captureChooserOpen} onClose={()=>setCaptureChooserOpen(false)} onManualCapture={()=>setLogDrawerOpen(true)}/><LogWithSentinelDrawer open={logDrawerOpen} onClose={()=>setLogDrawerOpen(false)}/>
  <ProfileDropdown open={profileOpen} onClose={()=>setProfileOpen(false)} onNavigate={profileNavigate} dark={dark} onToggleDark={()=>setDark(value=>!value)}/>
  </div>
}

export default function App({authError=''}:{authError?:string}){const auth=useConnectedAuth();const access=useConnectedProject();if(auth.loading)return <main className="flex min-h-screen items-center justify-center" style={{background:'var(--c-page)',color:'var(--c-text)'}}><WorkflowLoading>Restoring your session…</WorkflowLoading></main>;if(!auth.session)return <LoginPage initialError={authError}/>;if(access.loading&&!access.identity)return <main className="flex min-h-screen items-center justify-center" style={{background:'var(--c-page)',color:'var(--c-text)'}}><WorkflowLoading>Loading project access…</WorkflowLoading></main>;if(access.error||!access.project)return <main className="flex min-h-screen items-center justify-center px-6" style={{background:'var(--c-page)',color:'var(--c-text)'}}><section className="w-full max-w-md rounded-[18px] p-8" style={{background:'var(--c-card)',border:'1px solid var(--c-border)'}}><p className="mb-2 text-[12px] font-semibold uppercase" style={{color:'#F46F29'}}>SENTINEL · PROJECT ACCESS</p><h1 className="mb-2 text-[22px] font-bold">{access.error?'Unable to load project access':'Your account is ready'}</h1><p className="mb-2 text-[13px]" style={{color:'var(--c-muted)'}}>{access.error||'A project Administrator must assign your account to a project before you can use SENTINEL.'}</p><p className="mb-5 text-[12px]" style={{color:'var(--c-subtle)'}}>{access.identity?.user.email??auth.user?.email}</p><div className="flex gap-4 text-[13px] font-semibold"><button onClick={()=>void access.refresh()} style={{color:'#F46F29'}}>Check access again</button><button onClick={()=>void auth.signOut()} style={{color:'var(--c-muted)'}}>Sign out</button></div></section></main>;return <AppShell key={`${auth.user?.id}:${access.project.id}:${access.role}`}/>}
