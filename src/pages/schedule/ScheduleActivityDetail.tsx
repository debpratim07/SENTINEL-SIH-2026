import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useConnectedProject } from '../../context/ConnectedProjectContext'
import { useConnectedWorkspace } from '../../hooks/useConnectedWorkspace'
import { displayDate, scheduleStatus } from '../../lib/real-schedule'

interface Props { activityId: string; onBack: () => void; onViewActual?: (actualId: string) => void; onViewAuditLog?: () => void; onViewSourceEvidence?: () => void }

function Card({ title, children }: { title: string; children: React.ReactNode }) { return <section className="overflow-hidden rounded-[14px]" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}><h2 className="border-b px-5 py-3 text-[10px] font-bold uppercase tracking-[.08em]" style={{ borderColor: 'var(--c-border)', color: 'var(--c-subtle)', background: 'var(--c-page)' }}>{title}</h2><div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div></section> }
function Field({ label, value, verified }: { label: string; value: string | null | undefined; verified?: boolean }) { return <div><p className="text-[10px] font-bold uppercase tracking-[.07em]" style={{ color: 'var(--c-subtle)' }}>{label}</p><p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: value ? 'var(--c-text)' : 'var(--c-subtle)', fontStyle: value ? 'normal' : 'italic' }}>{value || 'Not reported'}{value && verified && <CheckCircle2 size={13} color="#16A34A" />}</p></div> }

export default function ScheduleActivityDetail({ activityId, onBack, onViewActual }: Props) {
  const access = useConnectedProject()
  const { workspace, loading, error, refresh } = useConnectedWorkspace(access.project!.id)
  if (loading) return <div className="p-12 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>Loading real activity…</div>
  if (error) return <div className="p-12 text-center text-[13px]" role="alert" style={{ color: '#B91C1C' }}>{error} <button onClick={() => void refresh()} className="underline">Retry</button></div>
  const activity = workspace?.activities.find(item => item.id === activityId)
  if (!activity) return <div className="p-12 text-center"><p style={{ color: 'var(--c-muted)' }}>This activity is not available in the selected project.</p><button onClick={onBack} className="mt-3 text-[13px] font-bold" style={{ color: '#F46F29' }}>Return to schedule</button></div>
  const actual = workspace?.actuals.find(item => item.activity_id === activity.id) ?? null
  const parent = activity.parent_id ? workspace?.activities.find(item => item.id === activity.parent_id) : null
  const status = scheduleStatus(actual)
  return <div className="detail-page mx-auto flex w-full max-w-[980px] flex-col gap-5 p-7 pb-16">
    <button onClick={onBack} className="flex items-center gap-1.5 self-start text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}><ArrowLeft size={14} />Schedule activities</button>
    <header className="flex items-start justify-between gap-4"><div><p className="text-[12px] font-bold" style={{ color: '#F46F29', fontFamily: 'var(--font-data)' }}>{activity.external_id} · {activity.level}</p><h1 className="mt-1 text-[24px] font-bold" style={{ color: 'var(--c-text)' }}>{activity.name}</h1><p className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>{access.project?.name}</p></div><span className="rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ color: status === 'Completed' ? '#15803D' : status === 'Started' ? '#C2410C' : 'var(--c-muted)', background: status === 'Completed' ? 'rgba(22,163,74,.10)' : status === 'Started' ? 'rgba(244,111,41,.11)' : 'var(--c-card)', border: '1px solid var(--c-border)' }}>{status}</span></header>
    <div className="grid gap-5 md:grid-cols-2"><Card title="Identity & classification"><Field label="External activity ID" value={activity.external_id} /><Field label="Level" value={activity.level} /><Field label="Discipline" value={activity.discipline} /><Field label="Area" value={activity.area} /><Field label="Equipment reference" value={activity.equipment_ref} /></Card><Card title="Real hierarchy"><Field label="Parent activity" value={parent ? `${parent.external_id} · ${parent.name}` : null} /><Field label="Parent relationship" value={activity.parent_id ? activity.parent_id : null} /></Card></div>
    <div className="grid gap-5 md:grid-cols-2"><Card title="Plan"><Field label="Planned start" value={activity.planned_start ? displayDate(activity.planned_start) : null} /><Field label="Planned finish" value={activity.planned_finish ? displayDate(activity.planned_finish) : null} /></Card><Card title="Verified execution"><Field label="Actual start" value={actual?.actual_start ? displayDate(actual.actual_start) : null} verified /><Field label="Actual finish" value={actual?.actual_finish ? displayDate(actual.actual_finish) : null} verified />{actual && (actual.actual_start || actual.actual_finish) && <button onClick={() => onViewActual?.(activity.id)} className="self-end text-left text-[12px] font-bold" style={{ color: '#F46F29' }}>Open verified actual detail →</button>}</Card></div>
    <p className="text-[11px]" style={{ color: 'var(--c-subtle)' }}>This read-only view shows persisted project schedule and verified actual values. Missing fields remain unreported.</p>
  </div>
}
