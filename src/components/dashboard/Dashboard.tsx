import { PlusCircle } from 'lucide-react'
import { projectKPIs, PROJECT } from '../../data/mockData'
import KPICard from './KPICard'
import PlanVsActualChart from './PlanVsActualChart'
import NeedsAttention from './NeedsAttention'
import RecentExecution from './RecentExecution'
import DisciplinePerformance from './DisciplinePerformance'
import ReviewHealth from './ReviewHealth'
import DataQualityPanel from './DataQualityPanel'
import RecentChanges from './RecentChanges'

interface DashboardProps {
  onCaptureProgress?: () => void
  onNavigate?: (page: string, id?: string) => void
}

export default function Dashboard({ onCaptureProgress, onNavigate }: DashboardProps) {
  return (
    <div
      className="min-h-full"
      style={{
        padding: '28px 32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-[26px] font-bold leading-[32px] tracking-[-0.02em]"
            style={{ color: 'var(--c-text)' }}
          >
            Project Overview
          </h1>
          <p className="mt-1 text-[14px] leading-[21px]" style={{ color: 'var(--c-muted)' }}>
            Execution status, schedule variance and items requiring attention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[13px] font-medium"
            style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}
          >
            {PROJECT.reportDate}
          </span>
          <button
            onClick={onCaptureProgress}
            className="flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white transition-all duration-[180ms] hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
              boxShadow: '0 2px 10px rgba(244,111,41,0.26)',
              letterSpacing: '-0.01em',
            }}
          >
            <PlusCircle size={14} strokeWidth={2.2} aria-hidden="true" />
            Capture Progress
          </button>
        </div>
      </div>

      {/* ── KPI strip — 5 equal columns ───────────────────────── */}
      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
        aria-label="Project key metrics"
      >
        {projectKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      {/* ── Row 1: Plan vs Actual (62%) + Needs Attention (38%) ─ */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: '1.63fr 1fr', alignItems: 'stretch' }}
      >
        <PlanVsActualChart onNavigate={onNavigate} />
        <NeedsAttention onNavigate={onNavigate} />
      </div>

      {/* ── Row 2: Recent Execution + Discipline Performance ─────── */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}
      >
        <RecentExecution onNavigate={onNavigate} />
        <DisciplinePerformance />
      </div>

      {/* ── Row 3: Review Health + Data Quality ──────────────────── */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}
      >
        <ReviewHealth onNavigate={onNavigate} />
        <DataQualityPanel onNavigate={onNavigate} />
      </div>

      {/* ── Row 4: Recent Changes (full width) ───────────────────── */}
      <RecentChanges onNavigate={onNavigate} />
    </div>
  )
}
