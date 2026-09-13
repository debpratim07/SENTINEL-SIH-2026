import React, { useState } from 'react'
import { Search, Plus, X, ChevronDown, Check } from 'lucide-react'
import { ROLE_LABELS, type UserRole } from '../../context/RoleContext'

// ── Types ─────────────────────────────────────────────────────────────────────

type AdminTab = 'users' | 'projects' | 'disciplines' | 'matching-rules' | 'integrations' | 'settings'

interface User {
  id: string; name: string; email: string; role: UserRole
  project: string; discipline: string; status: 'Active' | 'Inactive'; lastActive: string
}

// ── Demo users ────────────────────────────────────────────────────────────────

const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Arjun Mehta',   email: 'arjun.mehta@sentinel.demo',   role: 'planner',           project: 'Infrastructure Expansion', discipline: 'All',        status: 'Active', lastActive: '28 Aug 2026' },
  { id: 'u2', name: 'Priya Nair',    email: 'priya.nair@sentinel.demo',    role: 'discipline-engineer',project: 'Infrastructure Expansion', discipline: 'Electrical', status: 'Active', lastActive: '28 Aug 2026' },
  { id: 'u3', name: 'Rohan Das',     email: 'rohan.das@sentinel.demo',     role: 'site-supervisor',   project: 'Infrastructure Expansion', discipline: 'Piping',     status: 'Active', lastActive: '27 Aug 2026' },
  { id: 'u4', name: 'Anita Verma',   email: 'anita.verma@sentinel.demo',   role: 'project-controls',  project: 'Infrastructure Expansion', discipline: 'All',        status: 'Active', lastActive: '28 Aug 2026' },
  { id: 'u5', name: 'Demo PM',       email: 'pm@sentinel.demo',            role: 'project-manager',   project: 'Infrastructure Expansion', discipline: 'All',        status: 'Active', lastActive: '26 Aug 2026' },
  { id: 'u6', name: 'Admin User',    email: 'admin@sentinel.demo',         role: 'administrator',     project: 'System',                   discipline: '—',          status: 'Active', lastActive: '28 Aug 2026' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow-card)' }}>
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>{title}</h3>
        {sub && <p className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Connected' | 'Not Connected' | 'Active Prototype' }) {
  const colors: Record<string, { color: string; bg: string }> = {
    Active:            { color: '#16A34A', bg: 'rgba(22,163,74,0.09)' },
    Inactive:          { color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
    Connected:         { color: '#16A34A', bg: 'rgba(22,163,74,0.09)' },
    'Not Connected':   { color: '#94A3B8', bg: 'rgba(100,116,139,0.08)' },
    'Active Prototype':{ color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  }
  const c = colors[status] ?? colors.Inactive
  return (
    <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-semibold" style={{ color: c.color, background: c.bg }}>{status}</span>
  )
}

// ── USERS & ROLES TAB ─────────────────────────────────────────────────────────

function UsersTab() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [users] = useState(DEMO_USERS)

  const filtered = users.filter((u) =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRole || ROLE_LABELS[u.role] === filterRole)
  )

  const PERMISSION_GROUPS = [
    {
      group: 'Capture', items: [
        { label: 'Log with SENTINEL', roles: ['site-supervisor','discipline-engineer','planner','project-controls','administrator'] },
        { label: 'Upload Report', roles: ['site-supervisor','discipline-engineer','planner','project-controls','administrator'] },
        { label: 'Respond to Clarification', roles: ['site-supervisor','discipline-engineer','planner','project-controls','administrator'] },
      ],
    },
    {
      group: 'Review', items: [
        { label: 'Verify Schedule Match', roles: ['planner','project-controls','administrator'] },
        { label: 'Resolve Exception', roles: ['planner','project-controls','administrator'] },
        { label: 'Bulk Verification', roles: ['planner','project-controls'] },
      ],
    },
    {
      group: 'Schedule', items: [
        { label: 'Schedule Integrity Access', roles: ['project-controls','administrator'] },
        { label: 'View Audit Log', roles: ['planner','project-controls','administrator'] },
      ],
    },
    {
      group: 'Insights', items: [
        { label: 'View Performance', roles: ['discipline-engineer','planner','project-controls','project-manager','administrator'] },
        { label: 'View Data Quality', roles: ['discipline-engineer','planner','project-controls','project-manager','administrator'] },
        { label: 'View Execution Knowledge', roles: ['discipline-engineer','planner','project-controls','project-manager','administrator'] },
      ],
    },
    {
      group: 'Administration', items: [
        { label: 'Configuration Authority', roles: ['administrator'] },
        { label: 'User Management', roles: ['administrator'] },
        { label: 'Matching Rule Config', roles: ['administrator'] },
      ],
    },
  ]

  const ROLE_ORDER: UserRole[] = ['site-supervisor','discipline-engineer','planner','project-controls','project-manager','administrator']

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Users & Roles</h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Manage access to SENTINEL project workspaces.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={13} strokeWidth={2} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }} />
          <input type="search" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-[8px] pl-8 pr-3 text-[12px]"
            style={{ width: 200, background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} />
        </div>
        <div className="relative">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="h-8 cursor-pointer appearance-none rounded-[8px] pl-3 pr-7 text-[12px]"
            style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', outline: 'none' }}>
            <option value="">Role</option>
            {Object.values(ROLE_LABELS).map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown size={11} strokeWidth={2.5} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-subtle)', pointerEvents: 'none' }} />
        </div>
        <div className="flex-1" />
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)', boxShadow: '0 2px 8px rgba(244,111,41,0.2)' }}>
          <Plus size={13} strokeWidth={2.5} />
          Add User
        </button>
      </div>

      {/* Users table */}
      <SectionCard title="" sub="">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                {['USER','ROLE','PROJECT','DISCIPLINE','STATUS','LAST ACTIVE','ACTIONS'].map((c) => (
                  <th key={c} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--c-border)' }}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)' }}>
                        {u.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{u.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-text)' }}>{ROLE_LABELS[u.role]}</td>
                  <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{u.project}</td>
                  <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{u.discipline}</td>
                  <td className="px-3 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-3 py-3 text-[11px]" style={{ color: 'var(--c-muted)' }}>{u.lastActive}</td>
                  <td className="px-3 py-3">
                    <button className="text-[12px] font-medium hover:underline" style={{ color: '#F46F29' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Role permissions matrix */}
      <SectionCard title="Role Permissions" sub="Permission summary by role and function group.">
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em', width: 200 }}>PERMISSION</th>
                {ROLE_ORDER.map((r) => (
                  <th key={r} className="px-2 py-2.5 text-center text-[9px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.07em' }}>
                    {ROLE_LABELS[r].split(' ').map((w) => <div key={w}>{w}</div>)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map((pg) => (
                <React.Fragment key={pg.group}>
                  <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                    <td colSpan={7} className="px-3 py-1.5 text-[10px] font-bold uppercase" style={{ color: '#F46F29', background: 'rgba(244,111,41,0.05)', letterSpacing: '0.08em' }}>
                      {pg.group}
                    </td>
                  </tr>
                  {pg.items.map((item) => (
                    <tr key={item.label} style={{ borderBottom: '1px solid var(--c-border)' }}>
                      <td className="px-3 py-2.5 text-[12px]" style={{ color: 'var(--c-text)' }}>{item.label}</td>
                      {ROLE_ORDER.map((r) => (
                        <td key={r} className="px-2 py-2.5 text-center">
                          {item.roles.includes(r) ? (
                            <Check size={13} strokeWidth={2.5} style={{ color: '#16A34A', margin: '0 auto' }} />
                          ) : (
                            <span style={{ color: 'var(--c-border-strong)', fontSize: 16, lineHeight: 1 }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>
            Administrator configuration rights do not automatically imply planner verification authority.
          </p>
        </div>
      </SectionCard>

      {/* Add user modal */}
      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAddOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
          <div
            style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 16, padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.22)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[16px] font-bold" style={{ color: 'var(--c-text)' }}>Add User</h3>
              <button onClick={() => setAddOpen(false)} style={{ color: 'var(--c-muted)' }}><X size={16} strokeWidth={2} /></button>
            </div>
            <div className="flex flex-col gap-3.5">
              {['Name','Email','Role','Project','Discipline'].map((f) => (
                <div key={f}>
                  <label className="mb-1 block text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{f}</label>
                  {f === 'Role' ? (
                    <select className="w-full h-10 rounded-[8px] px-3 text-[13px]" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }}>
                      {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  ) : (
                    <input type={f === 'Email' ? 'email' : 'text'} className="w-full h-10 rounded-[8px] px-3 text-[13px]"
                      style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px]" style={{ color: 'var(--c-subtle)' }}>Prototype only. No real invitation email is sent.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-[8px] py-2.5 text-[13px] font-medium" style={{ border: '1px solid var(--c-border)', color: 'var(--c-muted)', background: 'transparent' }}>Cancel</button>
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-[8px] py-2.5 text-[13px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)', boxShadow: '0 2px 8px rgba(244,111,41,0.2)' }}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PROJECTS TAB ──────────────────────────────────────────────────────────────

function ProjectsTab() {
  const [configOpen, setConfigOpen] = useState(false)
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Projects</h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Manage project configuration and schedule settings.</p>
      </div>
      <SectionCard title="">
        <div className="flex items-start justify-between gap-4 py-2">
          <div>
            <div className="text-[15px] font-semibold" style={{ color: 'var(--c-text)' }}>Infrastructure Expansion</div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[12px]" style={{ color: 'var(--c-muted)' }}>
              <span>Status: <strong style={{ color: '#16A34A' }}>Active</strong></span>
              <span>Schedule Level: L5/L6</span>
              <span>Type: Infrastructure</span>
              <span>Schedule Mirror: <strong style={{ color: '#16A34A' }}>Active</strong></span>
              <span>Last Import: 28 Aug 2026</span>
              <span>Disciplines: 7</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium" style={{ border: '1px solid var(--c-border)', color: 'var(--c-muted)', background: 'transparent' }}>View</button>
            <button onClick={() => setConfigOpen(true)} className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium" style={{ border: '1px solid var(--c-border)', color: '#F46F29', background: 'var(--c-brand-tint)' }}>Configure</button>
          </div>
        </div>
      </SectionCard>

      {configOpen && (
        <SectionCard title="Project Configuration" sub="Infrastructure Expansion">
          <div className="flex flex-col gap-4">
            {[
              { label: 'Project Name', value: 'Infrastructure Expansion' },
              { label: 'Project Code', value: 'LNG-IE-2026' },
              { label: 'Default Time Zone', value: 'UTC+5:30 (IST)' },
              { label: 'Schedule Level', value: 'L5/L6' },
              { label: 'Review Policy', value: 'Individual review for ambiguous; bulk eligible for strong complete' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <label className="w-44 flex-shrink-0 text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>{f.label}</label>
                <input className="flex-1 h-9 rounded-[8px] px-3 text-[13px]"
                  defaultValue={f.value}
                  style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }} />
              </div>
            ))}

            <div className="flex items-start gap-3">
              <label className="w-44 flex-shrink-0 pt-2 text-[12px] font-semibold" style={{ color: 'var(--c-muted)' }}>Schedule Source</label>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3 rounded-[10px] px-3 py-2.5" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <div className="h-2 w-2 rounded-full" style={{ background: '#16A34A' }} />
                  <span className="text-[13px] font-semibold" style={{ color: '#16A34A' }}>SENTINEL Schedule Mirror</span>
                  <span className="ml-auto text-[11px]" style={{ color: '#16A34A' }}>Active</span>
                </div>
                {['Primavera P6','Microsoft Project','Enterprise PMIS'].map((src) => (
                  <div key={src} className="mb-1 flex items-center gap-3 rounded-[10px] px-3 py-2" style={{ border: '1px solid var(--c-border)', opacity: 0.6 }}>
                    <div className="h-2 w-2 rounded-full" style={{ background: 'var(--c-subtle)' }} />
                    <span className="text-[13px]" style={{ color: 'var(--c-muted)' }}>{src}</span>
                    <span className="ml-auto text-[10px] font-semibold" style={{ color: 'var(--c-subtle)' }}>Future Integration / Not Connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setConfigOpen(false)} className="rounded-[8px] px-4 py-2 text-[13px] font-medium" style={{ border: '1px solid var(--c-border)', color: 'var(--c-muted)', background: 'transparent' }}>Cancel</button>
            <button onClick={() => setConfigOpen(false)} className="rounded-[8px] px-4 py-2 text-[13px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)' }}>Save</button>
          </div>
        </SectionCard>
      )}
    </div>
  )
}

// ── DISCIPLINES TAB ───────────────────────────────────────────────────────────

const DISCIPLINES = [
  { name: 'Civil',              code: 'CIV', users: 2,  events: 124, status: 'Active' as const },
  { name: 'Piping',             code: 'PIP', users: 3,  events: 286, status: 'Active' as const },
  { name: 'Static Equipment',   code: 'STE', users: 1,  events: 68,  status: 'Active' as const },
  { name: 'Rotating Equipment', code: 'ROT', users: 2,  events: 94,  status: 'Active' as const },
  { name: 'Electrical',         code: 'ELC', users: 1,  events: 112, status: 'Active' as const },
  { name: 'Instrumentation',    code: 'INS', users: 1,  events: 78,  status: 'Active' as const },
  { name: 'HSE',                code: 'HSE', users: 1,  events: 32,  status: 'Active' as const },
]

function DisciplinesTab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Disciplines</h2>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Active disciplines for the project workspace.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#F46F29,#F59B4C)', boxShadow: '0 2px 8px rgba(244,111,41,0.2)' }}>
          <Plus size={13} strokeWidth={2.5} />
          Add Discipline
        </button>
      </div>
      <SectionCard title="">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
              {['DISCIPLINE','CODE','ACTIVE USERS','ACTUAL EVENTS','STATUS','ACTIONS'].map((c) => (
                <th key={c} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase" style={{ color: 'var(--c-subtle)', letterSpacing: '0.08em' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISCIPLINES.map((d) => (
              <tr key={d.code} style={{ borderBottom: '1px solid var(--c-border)' }}>
                <td className="px-3 py-3 text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>{d.name}</td>
                <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }}>{d.code}</td>
                <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{d.users}</td>
                <td className="px-3 py-3 text-[12px]" style={{ color: 'var(--c-muted)' }}>{d.events}</td>
                <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex gap-3">
                    <button className="text-[12px] font-medium hover:underline" style={{ color: '#F46F29' }}>Edit</button>
                    <button className="text-[12px] font-medium hover:underline" style={{ color: 'var(--c-muted)' }}>Disable</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>Disabling a discipline hides it from new captures but does not delete historical data.</p>
      </SectionCard>
    </div>
  )
}

// ── MATCHING RULES TAB ────────────────────────────────────────────────────────

function MatchingRulesTab() {
  const SIGNALS = [
    { label: 'Activity terminology', importance: 'High' as const },
    { label: 'Equipment / Line reference', importance: 'High' as const },
    { label: 'Discipline', importance: 'Medium' as const },
    { label: 'Area', importance: 'Medium' as const },
    { label: 'Hierarchy compatibility', importance: 'Medium' as const },
    { label: 'Schedule date context', importance: 'Low' as const },
  ]
  const IMP_COLORS = { High: '#DC2626', Medium: '#D97706', Low: '#64748B' }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Matching Rules</h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Configure how SENTINEL evaluates schedule candidates and routes uncertain matches for review.</p>
      </div>

      <SectionCard title="Matching Signals" sub="Relative importance of each matching dimension.">
        <div className="flex flex-col gap-3">
          {SIGNALS.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-[13px]" style={{ color: 'var(--c-text)' }}>{s.label}</span>
              <div className="flex gap-1.5">
                {(['High','Medium','Low'] as const).map((opt) => (
                  <button
                    key={opt}
                    className="rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors"
                    style={{
                      background: opt === s.importance ? (opt === 'High' ? 'rgba(220,38,38,0.09)' : opt === 'Medium' ? 'rgba(217,119,6,0.10)' : 'rgba(100,116,139,0.10)') : 'var(--c-page)',
                      color: opt === s.importance ? IMP_COLORS[opt] : 'var(--c-muted)',
                      border: `1px solid ${opt === s.importance ? 'transparent' : 'var(--c-border)'}`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Review Policy" sub="How SENTINEL routes matches for human decision.">
        <div className="flex flex-col gap-3">
          {[
            { label: 'Strong complete matches', rule: 'Eligible for planner review / policy-based bulk review', color: '#16A34A' },
            { label: 'Ambiguous matches', rule: 'Individual review required', color: '#D97706' },
            { label: 'Incomplete records', rule: 'Clarification / manual context required', color: '#64748B' },
            { label: 'Conflicts', rule: 'Schedule update blocked until resolved', color: '#DC2626' },
            { label: 'Unmatched records', rule: 'Stored without forced schedule link', color: '#94A3B8' },
          ].map((r) => (
            <div key={r.label} className="flex items-start gap-3 rounded-[10px] p-3" style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)' }}>
              <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: r.color }} />
              <div>
                <div className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>{r.label}</div>
                <div className="text-[12px]" style={{ color: 'var(--c-muted)' }}>{r.rule}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px]" style={{ color: 'var(--c-subtle)' }}>No unsafe auto-verification is permitted. Planner authority is required for all verifications.</p>
      </SectionCard>
    </div>
  )
}

// ── INTEGRATIONS TAB ──────────────────────────────────────────────────────────

function IntegrationsTab() {
  const integrations = [
    {
      name: 'SENTINEL Schedule Mirror',
      status: 'Active Prototype' as const,
      description: 'Internal prototype representation of project schedule and verified actual updates.',
      isFuture: false,
    },
    {
      name: 'Primavera P6',
      status: 'Not Connected' as const,
      description: 'Enterprise project scheduling and controls platform.',
      isFuture: true,
    },
    {
      name: 'Microsoft Project',
      status: 'Not Connected' as const,
      description: 'Project scheduling and portfolio management tool.',
      isFuture: true,
    },
    {
      name: 'Enterprise PMIS',
      status: 'Not Connected' as const,
      description: 'Project management information system integration.',
      isFuture: true,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Integrations</h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>
          Connected and future-planned integrations. SENTINEL is not a replacement for Primavera P6 or Microsoft Project.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {integrations.map((intg) => (
          <div key={intg.name} className="flex items-start justify-between gap-4 rounded-[14px] p-5"
            style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', opacity: intg.isFuture ? 0.8 : 1 }}>
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
                style={{ background: intg.status === 'Active Prototype' ? '#D97706' : '#94A3B8' }}
              />
              <div>
                <div className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>{intg.name}</div>
                <div className="mt-0.5 text-[12px]" style={{ color: 'var(--c-muted)' }}>{intg.description}</div>
                {intg.isFuture && (
                  <div className="mt-1.5 inline-flex rounded-[5px] px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(100,116,139,0.10)', color: '#64748B' }}>
                    Future Integration / Not Connected
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={intg.status} />
              <button
                className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium"
                style={{
                  border: '1px solid var(--c-border)',
                  color: intg.isFuture ? 'var(--c-subtle)' : 'var(--c-muted)',
                  background: 'transparent',
                  cursor: intg.isFuture ? 'default' : 'pointer',
                }}
                disabled={intg.isFuture}
                title={intg.isFuture ? 'Not available in prototype' : 'Configure'}
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────

function SettingsTab() {
  function ToggleSetting({ label, sub, defaultOn }: { label: string; sub?: string; defaultOn?: boolean }) {
    const [on, setOn] = useState(defaultOn ?? true)
    return (
      <div className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div>
          <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>{label}</div>
          {sub && <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c-muted)' }}>{sub}</div>}
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          role="switch"
          aria-checked={on}
          className="flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
          style={{ background: on ? '#F46F29' : 'var(--c-border)', padding: '0 2px' }}
        >
          <div className="h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }} />
        </button>
      </div>
    )
  }

  function SelectSetting({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
    return (
      <div className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>{label}</div>
        <select defaultValue={defaultValue} className="h-8 rounded-[8px] px-2 text-[12px]"
          style={{ background: 'var(--c-page)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Settings</h2>
        <p className="mt-0.5 text-[13px]" style={{ color: 'var(--c-muted)' }}>Project and review preferences for your workspace.</p>
      </div>

      {[
        {
          title: 'Project Preferences',
          children: (
            <>
              <SelectSetting label="Default Date Format" options={['DD MMM YYYY','YYYY-MM-DD','MM/DD/YYYY']} defaultValue="DD MMM YYYY" />
              <SelectSetting label="Default Theme" options={['System','Light','Dark']} defaultValue="System" />
              <ToggleSetting label="Show evidence timestamps" sub="Display captured timestamps in Actual Event records" defaultOn={true} />
              <ToggleSetting label="Compact table density" sub="Use reduced row height in list views" defaultOn={false} />
            </>
          ),
        },
        {
          title: 'Review Preferences',
          children: (
            <>
              <ToggleSetting label="Review reminder" sub="Remind planner when backlog exceeds 5 records" defaultOn={true} />
              <ToggleSetting label="Require confirmation for verification" sub="Show confirmation dialog before verifying a schedule match" defaultOn={true} />
            </>
          ),
        },
        {
          title: 'Notifications',
          children: (
            <>
              {['Review required','Conflict detected','Report completed','Clarification received','Verification confirmed'].map((pref) => (
                <ToggleSetting key={pref} label={pref} defaultOn={true} />
              ))}
            </>
          ),
        },
        {
          title: 'Security',
          children: (
            <>
              <ToggleSetting label="Session timeout" sub="Automatically sign out after 60 minutes of inactivity" defaultOn={true} />
            </>
          ),
        },
        {
          title: 'Data Retention',
          children: (
            <div className="py-3">
              <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>Audit history is immutable and cannot be manually purged. Contact your SENTINEL administrator for data retention policies.</p>
            </div>
          ),
        },
      ].map((section) => (
        <SectionCard key={section.title} title={section.title}>
          {section.children}
        </SectionCard>
      ))}
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'users', label: 'Users & Roles' },
  { id: 'projects', label: 'Projects' },
  { id: 'disciplines', label: 'Disciplines' },
  { id: 'matching-rules', label: 'Matching Rules' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'settings', label: 'Settings' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')

  return (
    <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '24px 28px 48px' }}>
        {/* Page header */}
        <div className="mb-6">
          <h1 className="mb-4 text-[22px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>Administration</h1>
          <div className="flex gap-1 overflow-x-auto" style={{ borderBottom: '1px solid var(--c-border)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold transition-colors"
                style={{
                  color: activeTab === tab.id ? '#F46F29' : 'var(--c-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid #F46F29' : '2px solid transparent',
                  marginBottom: -1,
                  background: 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'users'          && <UsersTab />}
        {activeTab === 'projects'       && <ProjectsTab />}
        {activeTab === 'disciplines'    && <DisciplinesTab />}
        {activeTab === 'matching-rules' && <MatchingRulesTab />}
        {activeTab === 'integrations'   && <IntegrationsTab />}
        {activeTab === 'settings'       && <SettingsTab />}
      </div>
    </div>
  )
}
