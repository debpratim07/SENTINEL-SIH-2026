export const knownRoutes = new Set([
  'dashboard',
  'review-queue',
  'schedule',
  'reports',
  'actuals',
  'exceptions',
  'performance',
  'data-quality',
  'exec-knowledge',
  'audit-log',
  'admin',
  'profile',
])

const detailRoutes = new Set(['schedule', 'reports', 'actuals', 'exceptions'])

export function routeFor(nav: string, recordId?: string): string {
  const safeNav = knownRoutes.has(nav) ? nav : 'dashboard'
  if (recordId && detailRoutes.has(safeNav)) {
    return `/${safeNav}/${encodeURIComponent(recordId)}`
  }
  return `/${safeNav}`
}

export function parseRoute(pathname: string): { nav: string; recordId: string | null } {
  const [nav = 'dashboard', encodedRecordId] = pathname.split('/').filter(Boolean)
  return {
    nav,
    recordId: encodedRecordId ? decodeURIComponent(encodedRecordId) : null,
  }
}
