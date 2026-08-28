import { describe, expect, it } from 'vitest'
import { flattenAll } from './scheduleData'
import { scheduleResponseToTree, scheduleTreeToCsv } from './scheduleAdapter'

describe('schedule API adapter', () => {
  it('preserves record ids and groups activities for the approved hierarchy UI', () => {
    const tree = scheduleResponseToTree([
      {
        id: '60000000-0000-4000-8000-000000000001',
        externalId: 'ERECT-LINE-24-XX',
        name: 'ERECT LINE 24-XX',
        description: null,
        level: 'L5',
        discipline: 'Piping',
        area: 'Area B',
        plannedStart: '2026-08-20',
        plannedFinish: '2026-08-30',
        actualStart: '2026-08-22',
        actualFinish: null,
        plannedProgress: 65,
        actualProgress: 45,
        startVarianceDays: 2,
        finishVarianceDays: null,
        status: 'started-late',
        trust: 'verified',
      },
    ])

    expect(tree).toHaveLength(1)
    expect(tree[0]?.children?.[0]?.label).toBe('AREA B')
    expect(flattenAll(tree).find((activity) => activity.id.startsWith('60000000'))).toMatchObject({
      label: 'ERECT LINE 24-XX',
      status: 'started-late',
      trust: 'verified',
    })
    expect(scheduleTreeToCsv(tree)).toContain('ERECT LINE 24-XX,L5,Piping,Area B,2026-08-20')
  })
})
