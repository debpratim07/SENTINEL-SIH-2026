import type { AuditItem, ProjectRole } from './connected-types'

export const AUDIT_ACTION_LABELS: Record<AuditItem['action'], string> = {
  event_captured: 'Field Event Captured',
  actual_verified: 'Actual Verified',
  membership_changed: 'Membership Changed',
  report_ingested: 'Report Ingested',
}

const DETAIL_LABELS: Record<string, string> = {
  report_id: 'Report ID',
  method: 'Capture method',
  decision_id: 'Decision ID',
  activity_id: 'Activity ID',
  event_type: 'Event type',
  actual_date: 'Actual date',
  previous_actual_start: 'Previous actual start',
  previous_actual_finish: 'Previous actual finish',
  reason: 'Human review reason',
  target_user_id: 'Target user ID',
  previous_role: 'Previous role',
  new_role: 'New role',
  previous_active: 'Previous access state',
  new_active: 'New access state',
  operation: 'Membership operation',
  filename: 'Source filename',
  candidate_count: 'Candidate events',
  extraction_method: 'Extraction method',
  ai_status: 'AI provider status',
  source_sha256: 'Source SHA-256',
}

const DETAIL_ORDER = Object.keys(DETAIL_LABELS)

export interface AuditDetailField { key: string; label: string; value: string }

export function canViewAudit(role: ProjectRole | null | undefined) {
  return role === 'planner' || role === 'project-controls' || role === 'administrator'
}

export function auditActionLabel(action: AuditItem['action']) {
  return AUDIT_ACTION_LABELS[action]
}

function presentDetailValue(value: unknown): string | null {
  if (value === null) return 'Not previously reported'
  if (typeof value === 'string') return value || 'Empty value'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value) && value.every(item => ['string', 'number', 'boolean'].includes(typeof item))) return value.join(', ')
  return null
}

export function auditDetailFields(detail: Record<string, unknown>): AuditDetailField[] {
  return Object.entries(detail)
    .map(([key, raw]) => ({ key, raw, order: DETAIL_ORDER.indexOf(key) }))
    .sort((a, b) => (a.order < 0 ? DETAIL_ORDER.length : a.order) - (b.order < 0 ? DETAIL_ORDER.length : b.order) || a.key.localeCompare(b.key))
    .flatMap(({ key, raw }) => {
      const value = presentDetailValue(raw)
      if (value === null) return []
      const label = DETAIL_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())
      return [{ key, label, value }]
    })
}

export function projectAudit(projectId: string, audit: AuditItem[]) {
  return audit.filter(item => item.project_id === projectId)
}

export function filterAudit(items: AuditItem[], query: string, action: AuditItem['action'] | '', date: string) {
  const needle = query.trim().toLowerCase()
  return items.filter(item => {
    const searchable = [item.id, item.record_id, item.actor_id, item.action, auditActionLabel(item.action), ...auditDetailFields(item.detail).map(field => field.value)].join(' ').toLowerCase()
    return (!needle || searchable.includes(needle)) && (!action || item.action === action) && (!date || item.created_at.slice(0, 10) === date)
  })
}

export function formatAuditTimestamp(value: string, timeZone?: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  try {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: timeZone || undefined }).format(date)
  } catch {
    return date.toISOString()
  }
}
