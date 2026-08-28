import { describe, expect, it } from 'vitest'
import { toScheduleActivitySummary } from './schedule'

const baseRow = {
  id: '60000000-0000-4000-8000-000000000001',
  externalId: 'ERECT-LINE-24-XX',
  name: 'ERECT LINE 24-XX',
  description: null,
  level: 'L5' as const,
  discipline: 'Piping',
  area: 'Area B',
  plannedStart: '2026-08-20',
  plannedFinish: '2026-08-30',
  plannedProgress: 65,
  databaseStatus: 'in-progress' as const,
  actualStart: '2026-08-22',
  lastActualDate: '2026-08-28',
  actualCount: 2,
  actualProgress: 45,
}

describe('schedule activity projection', () => {
  it('derives late starts and verified trust from execution truth', () => {
    const activity = toScheduleActivitySummary(baseRow, '2026-08-29')
    expect(activity.status).toBe('started-late')
    expect(activity.startVarianceDays).toBe(2)
    expect(activity.trust).toBe('verified')
    expect(activity.actualProgress).toBe(45)
  })

  it('marks past planned work with no actual as missing', () => {
    const activity = toScheduleActivitySummary({
      ...baseRow,
      databaseStatus: 'not-started',
      actualStart: null,
      lastActualDate: null,
      actualCount: 0,
      actualProgress: null,
    }, '2026-08-29')
    expect(activity.status).toBe('missing-actual')
    expect(activity.trust).toBe('missing')
  })
})
