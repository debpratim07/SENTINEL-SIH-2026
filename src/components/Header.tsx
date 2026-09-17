import { Bell, Menu, Moon, Search, Sun, Pause, Play } from 'lucide-react'
import { useConnectedAuth } from '../context/ConnectedAuthContext'
import { useConnectedProject } from '../context/ConnectedProjectContext'
import { emailInitials, roleLabel } from '../lib/connected-shell'

interface HeaderProps { reducedMotion:boolean; onToggleMotion:()=>void; osReduced:boolean; pageTitle:string; dark:boolean; onToggleDark:()=>void; onOpenProfile:()=>void; onOpenNavigation:()=>void; onOpenSearch:()=>void; onOpenNotifications:()=>void }
export default function Header({dark,onToggleDark,onOpenProfile,onOpenNavigation,onOpenSearch,onOpenNotifications,reducedMotion,onToggleMotion,osReduced,pageTitle}:HeaderProps){
  const auth=useConnectedAuth();const access=useConnectedProject();const email=access.identity?.user.email??auth.user?.email??''
  return <header aria-label="Application header" className="app-header flex h-16 shrink-0 items-center gap-4 px-7" style={{background:'var(--c-glass)',borderBottom:'1px solid var(--c-border)',boxShadow:'var(--c-shadow-glass)',zIndex:40}}>
    <button onClick={onOpenNavigation} className="mobile-nav-trigger" aria-label="Open navigation" aria-controls="primary-sidebar"><Menu size={20}/></button>
    <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold" style={{color:'var(--c-text)'}}>{access.project?.name}</div><div className="text-[11px]" style={{color:'var(--c-muted)'}}><span className="capitalize">{pageTitle}</span> · Project execution</div></div>
    <button onClick={onOpenSearch} className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{color:'var(--c-muted)'}} aria-label="Search current project"><Search size={16}/></button>
    <button onClick={onOpenNotifications} className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{color:'var(--c-muted)'}} aria-label="Open project notifications"><Bell size={16}/></button>
    <button onClick={onToggleMotion} disabled={osReduced} aria-pressed={reducedMotion} title={osReduced?'Reduced motion follows your device setting':'Motion preference'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{color:'var(--c-muted)'}} aria-label={reducedMotion?'Enable motion':'Reduce motion'}>{reducedMotion?<Play size={16}/>:<Pause size={16}/>}</button>
    <button onClick={onToggleDark} className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{color:'var(--c-muted)'}} aria-label={dark?'Switch to light mode':'Switch to dark mode'}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
    <button onClick={onOpenProfile} className="flex h-9 items-center gap-2.5 rounded-[10px] pl-1 pr-3" aria-label={`User profile: ${email}, ${roleLabel(access.role)}`}>
      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{background:'linear-gradient(135deg,#F46F29,#F59B4C)'}}>{emailInitials(email)}</div>
      <div className="hidden flex-col items-start sm:flex"><span className="text-[13px] font-medium" style={{color:'var(--c-text)'}}>{email}</span><span className="text-[11px]" style={{color:'var(--c-muted)'}}>{roleLabel(access.role)}</span></div>
    </button>
  </header>
}
