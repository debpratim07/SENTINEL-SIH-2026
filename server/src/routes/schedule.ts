import type { ProjectScheduleResponse, ScheduleActivityStatus, ScheduleActivitySummary } from '@sentinel/domain'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateRequest, requireProjectPermission } from '../auth'
import type { Database } from '../database'

interface ScheduleRouteDependencies {
  database: Database
  supabase: SupabaseClient
}

interface ScheduleImportRow {
  id: string | null
  versionNumber: number | null
  importedAt: string | null
  projectToday: string
}

interface ScheduleRow {
  id: string
  externalId: string
  name: string
  description: string | null
  level: 'L3' | 'L4' | 'L5' | 'L6'
  discipline: string
  area: string
  plannedStart: string | null
  plannedFinish: string | null
  plannedProgress: number
  databaseStatus: 'not-started' | 'in-progress' | 'complete' | 'on-hold'
  actualStart: string | null
  lastActualDate: string | null
  actualCount: number
  actualProgress: number | null
}

function dateDifferenceInDays(actual: string | null, planned: string | null): number | null {
  if (!actual || !planned) return null
  const [actualYear, actualMonth, actualDay] = actual.split('-').map(Number)
  const [plannedYear, plannedMonth, plannedDay] = planned.split('-').map(Number)
  return Math.round(
    (Date.UTC(actualYear!, actualMonth! - 1, actualDay!) - Date.UTC(plannedYear!, plannedMonth! - 1, plannedDay!)) /
      86_400_000,
  )
}

export function toScheduleActivitySummary(row: ScheduleRow, today: string): ScheduleActivitySummary {
  const actualFinish = row.databaseStatus === 'complete' ? row.lastActualDate : null
  const startVarianceDays = dateDifferenceInDays(row.actualStart, row.plannedStart)
  const finishVarianceDays = dateDifferenceInDays(actualFinish, row.plannedFinish)

  let status: ScheduleActivityStatus = 'not-started'
  if (row.databaseStatus === 'complete') {
    status = finishVarianceDays !== null && finishVarianceDays > 0 ? 'finished-late' : 'complete'
  } else if (row.actualStart) {
    status = startVarianceDays !== null && startVarianceDays > 0 ? 'started-late' : 'in-progress'
  } else if (row.plannedStart && row.plannedStart < today) {
    status = 'missing-actual'
  }

  return {
    id: row.id,
    externalId: row.externalId,
    name: row.name,
    description: row.description,
    level: row.level,
    discipline: row.discipline,
    area: row.area,
    plannedStart: row.plannedStart,
    plannedFinish: row.plannedFinish,
    actualStart: row.actualStart,
    actualFinish,
    plannedProgress: Number(row.plannedProgress),
    actualProgress: row.actualProgress === null
      ? row.databaseStatus === 'complete' ? 100 : 0
      : Number(row.actualProgress),
    startVarianceDays,
    finishVarianceDays,
    status,
    trust: row.actualCount > 0
      ? 'verified'
      : row.plannedStart && row.plannedStart < today ? 'missing' : 'unverified',
  }
}

function roundMetric(value: number): number {
  return Math.round(value * 10) / 10
}

export async function registerScheduleRoutes(app: FastifyInstance, dependencies: ScheduleRouteDependencies) {
  const { database, supabase } = dependencies

  app.get<{ Params: { projectId: string } }>('/v1/projects/:projectId/schedule', async (request) => {
    const user = await authenticateRequest(request, supabase)
    const projectId = z.uuid().parse(request.params.projectId)
    await requireProjectPermission(database, user.id, projectId, 'view-schedule')

    const imports = await database<ScheduleImportRow[]>`
      select
        schedule_import.id,
        schedule_import.version_number,
        coalesce(schedule_import.published_at, schedule_import.created_at)::text as imported_at,
        ((now() at time zone project.timezone)::date)::text as project_today
      from public.projects project
      left join lateral (
        select *
        from public.schedule_imports candidate
        where candidate.project_id = project.id
          and candidate.status = 'published'
        order by candidate.version_number desc
        limit 1
      ) schedule_import on true
      where project.id = ${projectId}
    `
    const scheduleImport = imports[0]!

    if (!scheduleImport.id) {
      return {
        projectId,
        today: scheduleImport.projectToday,
        importVersion: null,
        importedAt: null,
        activities: [],
        metrics: { actualProgress: 0, plannedProgress: 0, variance: 0, startedLate: 0, finishedLate: 0 },
      } satisfies ProjectScheduleResponse
    }

    const rows = await database<ScheduleRow[]>`
      with latest_progress as (
        select distinct on (snapshot.schedule_activity_id)
          snapshot.schedule_activity_id,
          snapshot.actual_progress
        from public.progress_snapshots snapshot
        where snapshot.project_id = ${projectId}
        order by snapshot.schedule_activity_id, snapshot.as_of_date desc, snapshot.created_at desc
      ),
      actual_summary as (
        select
          actual.schedule_activity_id,
          min(actual.event_date)::text as actual_start,
          max(actual.event_date)::text as last_actual_date,
          count(*)::int as actual_count
        from public.actual_events actual
        where actual.project_id = ${projectId}
          and actual.status = 'verified'
        group by actual.schedule_activity_id
      )
      select
        activity.id::text,
        activity.external_id::text,
        activity.name,
        activity.description,
        case
          when activity.metadata ->> 'level' in ('L3', 'L4', 'L5', 'L6') then activity.metadata ->> 'level'
          else 'L5'
        end as level,
        coalesce(discipline.name, 'Unassigned') as discipline,
        coalesce(area.name, 'Unassigned') as area,
        activity.planned_start::text,
        activity.planned_finish::text,
        activity.planned_progress::float8,
        activity.status as database_status,
        summary.actual_start,
        summary.last_actual_date,
        coalesce(summary.actual_count, 0)::int as actual_count,
        progress.actual_progress::float8
      from public.schedule_activities activity
      left join public.disciplines discipline on discipline.id = activity.discipline_id
      left join public.areas area on area.id = activity.area_id
      left join latest_progress progress on progress.schedule_activity_id = activity.id
      left join actual_summary summary on summary.schedule_activity_id = activity.id
      where activity.project_id = ${projectId}
        and activity.schedule_import_id = ${scheduleImport.id}
      order by discipline.name nulls last, area.name nulls last, activity.external_id
    `

    const today = scheduleImport.projectToday
    const activities = rows.map((row) => toScheduleActivitySummary(row, today))
    const activityCount = activities.length
    const plannedProgress = activityCount
      ? roundMetric(activities.reduce((sum, activity) => sum + activity.plannedProgress, 0) / activityCount)
      : 0
    const actualProgress = activityCount
      ? roundMetric(activities.reduce((sum, activity) => sum + activity.actualProgress, 0) / activityCount)
      : 0

    return {
      projectId,
      today,
      importVersion: scheduleImport.versionNumber,
      importedAt: scheduleImport.importedAt,
      activities,
      metrics: {
        actualProgress,
        plannedProgress,
        variance: roundMetric(actualProgress - plannedProgress),
        startedLate: activities.filter((activity) => activity.status === 'started-late').length,
        finishedLate: activities.filter((activity) => activity.status === 'finished-late').length,
      },
    } satisfies ProjectScheduleResponse
  })
}
