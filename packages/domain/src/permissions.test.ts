import { describe, expect, it } from 'vitest'
import { hasPermission } from './index'

describe('role permissions', () => {
  it('allows planners to review and verify matches', () => {
    expect(hasPermission('planner', 'review-match')).toBe(true)
    expect(hasPermission('planner', 'verify-actual')).toBe(true)
  })

  it('does not give administrators planner verification authority', () => {
    expect(hasPermission('administrator', 'admin-config')).toBe(true)
    expect(hasPermission('administrator', 'review-match')).toBe(false)
    expect(hasPermission('administrator', 'verify-actual')).toBe(false)
  })

  it('does not allow project managers to mutate execution records', () => {
    expect(hasPermission('project-manager', 'view-performance')).toBe(true)
    expect(hasPermission('project-manager', 'capture')).toBe(false)
    expect(hasPermission('project-manager', 'resolve-exception')).toBe(false)
  })

  it('allows every project role to read the approved schedule view', () => {
    for (const role of [
      'site-supervisor',
      'discipline-engineer',
      'planner',
      'project-controls',
      'project-manager',
      'administrator',
    ] as const) {
      expect(hasPermission(role, 'view-schedule')).toBe(true)
    }
  })
})
