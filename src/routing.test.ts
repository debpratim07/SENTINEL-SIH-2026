import { describe, expect, it } from 'vitest'
import { parseRoute, routeFor } from './routing'

describe('SENTINEL routes', () => {
  it('creates durable detail URLs', () => {
    expect(routeFor('actuals', 'ACT-2026-0842')).toBe('/actuals/ACT-2026-0842')
    expect(parseRoute('/actuals/ACT-2026-0842')).toEqual({ nav: 'actuals', recordId: 'ACT-2026-0842' })
  })

  it('does not attach record IDs to non-detail pages', () => {
    expect(routeFor('admin', 'anything')).toBe('/admin')
  })

  it('falls back safely when asked to construct an unknown route', () => {
    expect(routeFor('unknown')).toBe('/dashboard')
  })
})
