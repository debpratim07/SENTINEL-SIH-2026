import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useConnectedProject } from '../../context/ConnectedProjectContext'
import { useConnectedWorkspace } from '../../hooks/useConnectedWorkspace'
import { displayDate, scheduleStatus } from '../../lib/real-schedule'

interface Props { actualId: string; onBack: () => void; onViewException?: (exceptionId: string) => void; onViewScheduleActivity: (id: string) => void; onViewSourceEvidence?: () => void }
function Field({ label, value, verified }: { label: string; value: string | null | undefined; verified?: boolean }) { return <div><p className="text-[10px] font-bold uppercase tracking-[.07em]" style={{ color: 'var(--c-subtle)' }}>{label}</p><p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: value ? 'var(--c-text)' : 'var(--c-subtle)', fontStyle: value ? 'normal' : 'italic' }}>{value || 'Not reported'}{value && verified && <CheckCircle2 size={13} color="#16A34A" />}</p></div> }
function Card({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[14px] p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}><h2 className="mb-4 text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: 'var(--c-subtle)' }}>{title}</h2><div className="grid gap-5 sm:grid-cols-2">{children}</div></section> }

export default function ActualDetail({ actualId, onBack, onViewScheduleActivity }: Props) {
  const access = useConnectedProject()
  const { workspace, loading, error, refresh } = useConnectedWorkspace(access.project!.id)
  if (loading) return <div className="p-12 text-center text-[13px]" style={{ color: 'var(--c-muted)' }}>Loading verified actual…</div>
  if (error) return <div className="p-12 text-center text-[13px]" role="alert" style={{ color: '#B91C1C' }}>{error} <button onClick={() => void refresh()} className="underline">Retry</button></div>
  const actual = workspace?.actuals.find(item => item.activity_id === actualId && (item.actual_start || item.actual_finish))
  const activity = actual ? workspace?.activities.find(item => item.id === actual.activity_id) : null
  if (!actual || !activity) return <div className="p-12 text-center"><p style={{ color: 'var(--c-muted)' }}>This verified actual is not available in the selected project.</p><button onClick={onBack} className="mt-3 text-[13px] font-bold" style={{ color: '#F46F29' }}>Return to actuals</button></div>
  const status = scheduleStatus(actual)
  return <div className="detail-page mx-auto flex w-full max-w-[900px] flex-col gap-5 p-7 pb-16">
    <button onClick={onBack} className="flex items-center gap-1.5 self-start text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}><ArrowLeft size={14} />Verified actuals</button>
    <header className="flex items-start justify-between gap-4"><div><p className="text-[12px] font-bold" style={{ color: '#F46F29', fontFamily: 'var(--font-data)' }}>{activity.external_id} · {activity.level}</p><h1 className="mt-1 text-[24px] font-bold" style={{ color: 'var(--c-text)' }}>{activity.name}</h1><p className="mt-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>{access.project?.name}</p></div><span className="rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ color: status === 'Completed' ? '#15803D' : '#C2410C', background: status === 'Completed' ? 'rgba(22,163,74,.10)' : 'rgba(244,111,41,.11)' }}>{status} · Human verified</span></header>
    <Card title="Activity"><Field label="External activity ID" value={activity.external_id} /><Field label="Level" value={activity.level} /><Field label="Discipline" value={activity.discipline} /><Field label="Area" value={activity.area} /><Field label="Equipment reference" value={activity.equipment_ref} /></Card>
    <div className="grid gap-5 md:grid-cols-2"><Card title="Plan"><Field label="Planned start" value={activity.planned_start ? displayDate(activity.planned_start) : null} /><Field label="Planned finish" value={activity.planned_finish ? displayDate(activity.planned_finish) : null} /></Card><Card title="Verified execution"><Field label="Actual start" value={actual.actual_start ? displayDate(actual.actual_start) : null} verified /><Field label="Actual finish" value={actual.actual_finish ? displayDate(actual.actual_finish) : null} verified /></Card></div>
    <div className="flex items-center justify-between rounded-[12px] p-4" style={{ background: 'var(--c-brand-tint)', border: '1px solid var(--c-border)' }}><p className="text-[12px]" style={{ color: 'var(--c-muted)' }}>These dates were persisted through the authorized human review workflow.</p><button onClick={() => onViewScheduleActivity(activity.id)} className="text-[12px] font-bold" style={{ color: '#F46F29' }}>View schedule activity →</button></div>
  </div>
}
