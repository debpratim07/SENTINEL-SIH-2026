import { useState, useMemo } from 'react'
import { Search, ChevronDown, X, Shield } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuditRecord {
  id: string
  timestamp: string
  action: string
  actionType: 'match-verified' | 'actual-updated' | 'candidate-suggested' | 'actual-captured' | 'conflict-flagged' | 'report-processed' | 'user-action'
  entity: string
  entityType: 'actual' | 'schedule-activity' | 'report' | 'exception' | 'system'
  actor: string
  actorType: 'human' | 'system'
  source: string
  change: string
  result: string
  // detail fields
  oldValue?: string
  newValue?: string
  decisionContext?: string
  relatedEvidence?: string
  relatedActual?: string
  relatedScheduleActivity?: string
  matchConfidence?: string
  matchingSignals?: string[]
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'AUD-001',
    timestamp: '28 Aug 2026 · 10:44',
    action: 'Match verified',
    actionType: 'match-verified',
    entity: 'ACT-2026-0842',
    entityType: 'actual',
    actor: 'Arjun Mehta',
    actorType: 'human',
    source: 'Supervisor Update',
    change: 'ERECT LINE 24-XX',
    result: 'Verified',
    oldValue: 'AI Suggested (91%)',
    newValue: 'Verified — ERECT LINE 24-XX',
    decisionContext: 'Planner reviewed candidate and confirmed schedule relationship.',
    relatedEvidence: 'Piping_DPR_28Aug.pdf',
    relatedActual: 'ACT-2026-0842',
    relatedScheduleActivity: 'ERECT LINE 24-XX',
    matchConfidence: '91%',
    matchingSignals: ['Activity terminology match', 'Piping discipline', 'Area B location', 'Date within tolerance'],
  },
  {
    id: 'AUD-002',
    timestamp: '28 Aug 2026 · 10:44',
    action: 'Actual Start updated',
    actionType: 'actual-updated',
    entity: 'ERECT LINE 24-XX',
    entityType: 'schedule-activity',
    actor: 'SENTINEL Schedule Mirror',
    actorType: 'system',
    source: 'SENTINEL Schedule Mirror',
    change: '— → 26 Aug 2026',
    result: 'Applied',
    oldValue: 'Not reported',
    newValue: '26 Aug 2026',
    decisionContext: 'Schedule mirror applied after planner verification of Actual Start.',
    relatedActual: 'ACT-2026-0842',
    relatedScheduleActivity: 'ERECT LINE 24-XX',
  },
  {
    id: 'AUD-003',
    timestamp: '28 Aug 2026 · 08:43',
    action: 'Schedule candidate suggested',
    actionType: 'candidate-suggested',
    entity: 'ACT-2026-0842',
    entityType: 'actual',
    actor: 'SENTINEL',
    actorType: 'system',
    source: 'Supervisor Update',
    change: 'ERECT LINE 24-XX · 91%',
    result: 'AI Suggested',
    decisionContext: 'Candidate routed for planner review. Confidence above threshold.',
    relatedEvidence: 'Piping_DPR_28Aug.pdf',
    relatedActual: 'ACT-2026-0842',
    relatedScheduleActivity: 'ERECT LINE 24-XX',
    matchConfidence: '91%',
    matchingSignals: ['Activity terminology', 'Discipline match', 'Location match', 'Date proximity'],
  },
  {
    id: 'AUD-004',
    timestamp: '28 Aug 2026 · 08:42',
    action: 'Actual captured',
    actionType: 'actual-captured',
    entity: 'ACT-2026-0842',
    entityType: 'actual',
    actor: 'Supervisor Update',
    actorType: 'human',
    source: 'Supervisor Update',
    change: 'Spool erection',
    result: 'Recorded',
    newValue: 'ACT-2026-0842 — Piping, Area B',
    decisionContext: 'Actual Event extracted from daily progress report.',
    relatedEvidence: 'Piping_DPR_28Aug.pdf',
    relatedActual: 'ACT-2026-0842',
  },
  {
    id: 'AUD-005',
    timestamp: '28 Aug 2026 · 07:55',
    action: 'Report processed',
    actionType: 'report-processed',
    entity: 'Piping_DPR_28Aug.pdf',
    entityType: 'report',
    actor: 'SENTINEL',
    actorType: 'system',
    source: 'Daily Progress Report',
    change: '6 Actual Events',
    result: 'Processed',
    newValue: '6 events extracted, 5 candidates suggested',
    decisionContext: 'Automated extraction from uploaded report.',
  },
  {
    id: 'AUD-006',
    timestamp: '28 Aug 2026 · 07:12',
    action: 'Conflict flagged',
    actionType: 'conflict-flagged',
    entity: 'EXC-001',
    entityType: 'exception',
    actor: 'SENTINEL',
    actorType: 'system',
    source: 'Multiple sources',
    change: 'EQUIPMENT ALIGNMENT — P-204',
    result: 'Blocked',
    oldValue: 'Source A: 26 Aug 2026',
    newValue: 'Source B: 27 Aug 2026',
    decisionContext: 'Conflicting Actual Start dates from two sources. Schedule update blocked.',
    relatedScheduleActivity: 'EQUIPMENT ALIGNMENT — P-204',
  },
  {
    id: 'AUD-007',
    timestamp: '27 Aug 2026 · 16:30',
    action: 'Match verified',
    actionType: 'match-verified',
    entity: 'ACT-2026-0838',
    entityType: 'actual',
    actor: 'Arjun Mehta',
    actorType: 'human',
    source: 'Daily Progress Report',
    change: 'PIPE SUPPORT INSTALLATION — AREA B',
    result: 'Verified',
    matchConfidence: '84%',
    matchingSignals: ['Activity label', 'Area match', 'Piping discipline'],
    relatedActual: 'ACT-2026-0838',
    relatedScheduleActivity: 'PIPE SUPPORT INSTALLATION — AREA B',
  },
  {
    id: 'AUD-008',
    timestamp: '27 Aug 2026 · 14:20',
    action: 'User logged in',
    actionType: 'user-action',
    entity: 'Arjun Mehta',
    entityType: 'system',
    actor: 'Arjun Mehta',
    actorType: 'human',
    source: 'Authentication',
    change: 'Session started',
    result: 'Authenticated',
  },
]

// ── Config ────────────────────────────────────────────────────────────────────

const ACTION_TYPE_LABELS: Record<string, string> = {
  'match-verified': 'Match Verified',
  'actual-updated': 'Actual Updated',
  'candidate-suggested': 'Candidate Suggested',
  'actual-captured': 'Actual Captured',
  'conflict-flagged': 'Conflict Flagged',
  'report-processed': 'Report Processed',
  'user-action': 'User Action',
}

const RESULT_COLORS: Record<string, { color: string; bg: string }> = {
  Verified:      { color: '#16A34A', bg: 'rgba(22,163,74,0.09)' },
  Applied:       { color: '#2563EB', bg: 'rgba(37,99,235,0.09)' },
  'AI Suggested':{ color: '#7C3AED', bg: 'rgba(124,58,237,0.09)' },
  Recorded:      { color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  Processed:     { color: '#0891B2', bg: 'rgba(8,145,178,0.09)' },
  Blocked:       { color: '#DC2626', bg: 'rgba(220,38,38,0.09)' },
  Authenticated: { color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ResultBadge({ result }: { result: string }) {
  const cfg = RESULT_COLORS[result] ?? { color: '#64748B', bg: 'rgba(100,116,139,0.10)' }
  return (
    <span
      className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {result}
    </span>
  )
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const active = !!value
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 cursor-pointer appearance-none rounded-[8px] pl-3 pr-7 text-[12px] font-medium"
        style={{
          background: active ? 'var(--c-brand-tint)' : 'var(--c-card)',
          border: `1px solid ${active ? 'rgba(244,111,41,0.35)' : 'var(--c-border)'}`,
          color: active ? '#F46F29' : 'var(--c-muted)',
          outline: 'none', fontFamily: 'var(--font-ui)',
        }}
      >
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} strokeWidth={2.5} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: active ? '#F46F29' : 'var(--c-subtle)', pointerEvents: 'none' }} />
    </div>
  )
}

// ── Detail drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ record, onClose }: { record: AuditRecord; onClose: () => void }) {
  function Row({ label, value }: { label: string; value?: string }) {
    if (!value) return null
    return (
      <div className="py-2.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{label}</div>
        <div className="mt-0.5 text-[13px]" style={{ color: 'var(--c-text)' }}>{value}</div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, zIndex: 100,
        background: 'var(--c-card)', borderLeft: '1px solid var(--c-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
      }}
    >
      <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>{record.action}</div>
          <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>{record.timestamp}</div>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ color: 'var(--c-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-border)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {/* Immutability notice */}
        <div className="mb-4 flex items-start gap-2 rounded-[10px] px-3 py-2.5" style={{ background: 'rgba(100,116,139,0.08)', border: '1px solid var(--c-border)' }}>
          <Shield size={13} strokeWidth={2} style={{ color: '#64748B', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
            Audit records are read-only. No edit, delete, or silent history rewriting is permitted.
          </p>
        </div>

        <Row label="Action" value={record.action} />
        <Row label="Actor" value={record.actor} />
        <Row label="Timestamp" value={record.timestamp} />
        <Row label="Entity" value={record.entity} />
        <Row label="Source" value={record.source} />
        <Row label="Old Value" value={record.oldValue} />
        <Row label="New Value" value={record.newValue} />
        <Row label="Result" value={record.result} />
        <Row label="Decision Context" value={record.decisionContext} />
        <Row label="Related Evidence" value={record.relatedEvidence} />
        <Row label="Related Actual" value={record.relatedActual} />
        <Row label="Related Schedule Activity" value={record.relatedScheduleActivity} />

        {record.matchConfidence && (
          <div className="py-2.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
            <div className="text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Match Confidence</div>
            <div className="mt-0.5 text-[13px]" style={{ color: '#7C3AED' }}>{record.matchConfidence}</div>
            <p className="mt-0.5 text-[10px]" style={{ color: 'var(--c-subtle)' }}>Confidence is not approval. Human verification is required.</p>
          </div>
        )}

        {record.matchingSignals && record.matchingSignals.length > 0 && (
          <div className="py-2.5" style={{ borderBottom: '1px solid var(--c-border)' }}>
            <div className="mb-1 text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>Matching Signals</div>
            <div className="flex flex-wrap gap-1.5">
              {record.matchingSignals.map((s) => (
                <span key={s} className="rounded-[5px] px-2 py-0.5 text-[11px]" style={{ background: 'var(--c-brand-tint)', color: '#F46F29' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [search, setSearch] = useState('')
  const [filterActor, setFilterActor] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterEntity, setFilterEntity] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null)

  const hasFilters = !!(search || filterActor || filterAction || filterEntity || filterDate || filterSource)

  const actors = [...new Set(AUDIT_RECORDS.map((r) => r.actor))]
  const actions = [...new Set(AUDIT_RECORDS.map((r) => ACTION_TYPE_LABELS[r.actionType]))]
  const entityTypes = [...new Set(AUDIT_RECORDS.map((r) => r.entityType))]
  const dates = [...new Set(AUDIT_RECORDS.map((r) => r.timestamp.split(' · ')[0]))]
  const sources = [...new Set(AUDIT_RECORDS.map((r) => r.source))]

  const filtered = useMemo(() => {
    let rows = [...AUDIT_RECORDS]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter((r) =>
        r.action.toLowerCase().includes(q) ||
        r.entity.toLowerCase().includes(q) ||
        r.actor.toLowerCase().includes(q) ||
        r.change.toLowerCase().includes(q)
      )
    }
    if (filterActor) rows = rows.filter((r) => r.actor === filterActor)
    if (filterAction) rows = rows.filter((r) => ACTION_TYPE_LABELS[r.actionType] === filterAction)
    if (filterEntity) rows = rows.filter((r) => r.entityType === filterEntity)
    if (filterDate) rows = rows.filter((r) => r.timestamp.startsWith(filterDate))
    if (filterSource) rows = rows.filter((r) => r.source === filterSource)
    return rows
  }, [search, filterActor, filterAction, filterEntity, filterDate, filterSource])

  const todayCount = 24
  const humanDecisions = 8
  const scheduleUpdates = 6
  const systemActions = 10

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '22px 28px 0', background: 'var(--c-page)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Audit Log</h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Trace how field evidence became trusted schedule information.
            </p>
          </div>
        </div>

        {/* Data lineage trail */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>
          {['SOURCE', 'ACTUAL EVENT', 'AI SUGGESTION', 'HUMAN DECISION', 'SCHEDULE UPDATE'].map((step, i) => (
            <span key={step} className="flex items-center gap-1.5">
              {i > 0 && <span style={{ color: 'var(--c-subtle)' }}>→</span>}
              <span
                className="rounded-[5px] px-2 py-0.5 font-semibold uppercase"
                style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', letterSpacing: '0.06em', fontSize: 10 }}
              >
                {step}
              </span>
            </span>
          ))}
        </div>

        {/* Compact metrics */}
        <div className="mb-0 flex flex-wrap items-center gap-x-5 gap-y-1 pb-4">
          {[
            { label: 'Events Today', value: todayCount },
            { label: 'Human Decisions', value: humanDecisions },
            { label: 'Schedule Updates', value: scheduleUpdates },
            { label: 'System Actions', value: systemActions },
          ].map((m, i) => (
            <div key={m.label} className="flex items-center gap-2">
              {i > 0 && <div className="h-3.5 w-px" style={{ background: 'var(--c-border)' }} />}
              <span className="text-[15px] font-bold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-ui)' }}>{m.value}</span>
              <span className="text-[12px]" style={{ color: 'var(--c-muted)' }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          <div className="relative">
            <Search size={13} strokeWidth={2} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
            <input
              type="search"
              placeholder="Search audit events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-[8px] pl-8 pr-3 text-[12px]"
              style={{ width: 220, background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none', fontFamily: 'var(--font-ui)' }}
            />
          </div>
          <FilterSelect label="Actor" value={filterActor} options={actors} onChange={setFilterActor} />
          <FilterSelect label="Action Type" value={filterAction} options={actions} onChange={setFilterAction} />
          <FilterSelect label="Entity Type" value={filterEntity} options={entityTypes} onChange={setFilterEntity} />
          <FilterSelect label="Date" value={filterDate} options={dates} onChange={setFilterDate} />
          <FilterSelect label="Source" value={filterSource} options={sources} onChange={setFilterSource} />
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterActor(''); setFilterAction(''); setFilterEntity(''); setFilterDate(''); setFilterSource('') }}
              className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[12px] font-medium"
              style={{ color: 'var(--c-muted)', border: '1px solid var(--c-border)', background: 'var(--c-card)' }}
            >
              <X size={11} strokeWidth={2.5} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <p className="text-[14px] font-medium" style={{ color: 'var(--c-muted)' }}>No audit events match these filters.</p>
            <button onClick={() => { setSearch(''); setFilterActor(''); setFilterAction(''); setFilterEntity(''); setFilterDate(''); setFilterSource('') }}
              className="text-[13px] hover:underline" style={{ color: '#F46F29' }}>Clear Filters</button>
          </div>
        ) : (
          <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--c-page)', borderBottom: '1px solid var(--c-border)' }}>
                {['TIME', 'ACTION', 'ENTITY', 'ACTOR', 'SOURCE', 'CHANGE', 'RESULT'].map((col) => (
                  <th key={col} className="px-4 py-3 text-[10px] font-bold uppercase text-left" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedRecord(r === selectedRecord ? null : r)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedRecord(r === selectedRecord ? null : r)}
                  className="cursor-pointer"
                  style={{
                    borderBottom: '1px solid var(--c-border)',
                    background: selectedRecord?.id === r.id ? 'var(--c-brand-tint)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (selectedRecord?.id !== r.id) (e.currentTarget as HTMLElement).style.background = 'var(--c-brand-tint)' }}
                  onMouseLeave={(e) => { if (selectedRecord?.id !== r.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--c-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--font-data)' }}>{r.timestamp}</td>
                  <td className="px-4 py-3 text-[12px] font-medium" style={{ color: 'var(--c-text)', whiteSpace: 'nowrap' }}>{r.action}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }}>{r.entity}</td>
                  <td className="px-4 py-3">
                    <div className="text-[12px]" style={{ color: r.actorType === 'system' ? 'var(--c-muted)' : 'var(--c-text)', whiteSpace: 'nowrap' }}>{r.actor}</div>
                    {r.actorType === 'system' && <div className="text-[10px]" style={{ color: 'var(--c-subtle)' }}>System</div>}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>{r.source}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--c-text)', maxWidth: 180 }}>{r.change}</td>
                  <td className="px-4 py-3"><ResultBadge result={r.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-4 py-3 text-[11px]" style={{ color: 'var(--c-subtle)', borderTop: '1px solid var(--c-border)' }}>
          {filtered.length} of {AUDIT_RECORDS.length} audit records shown{hasFilters && ' · filters active'} · Click a record to view detail
        </div>
      </div>

      {selectedRecord && (
        <DetailDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  )
}
