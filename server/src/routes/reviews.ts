import type { SupabaseClient } from '@supabase/supabase-js'
import type { FastifyInstance } from 'fastify'
import { reviewDecisionSchema } from '@sentinel/domain'
import { authenticateRequest, requireProjectPermission } from '../auth'
import type { Database } from '../database'
import { HttpError } from '../errors'

interface ReviewRouteDependencies {
  database: Database
  supabase: SupabaseClient
}

interface ReviewRecord {
  reviewId: string
  projectId: string
  reportId: string
  extractedEventId: string
  status: string
  eventDate: string | null
  summary: string
  quantity: number | null
  unit: string | null
}

export async function registerReviewRoutes(app: FastifyInstance, dependencies: ReviewRouteDependencies) {
  const { database, supabase } = dependencies

  app.post<{ Params: { reviewId: string } }>('/v1/reviews/:reviewId/decision', async (request, reply) => {
    const user = await authenticateRequest(request, supabase)
    const input = reviewDecisionSchema.parse(request.body)

    const reviewRows = await database<ReviewRecord[]>`
      select
        review.id as review_id,
        review.project_id,
        review.status,
        event.report_id,
        event.id as extracted_event_id,
        event.event_date,
        event.summary,
        event.quantity,
        event.unit
      from public.review_items review
      join public.extracted_events event on event.id = review.extracted_event_id
      where review.id = ${request.params.reviewId}
      limit 1
    `
    const review = reviewRows[0]
    if (!review) throw new HttpError(404, 'Review item not found.', 'REVIEW_NOT_FOUND')
    await requireProjectPermission(database, user.id, review.projectId, 'review-match')

    const result = await database.begin(async (transaction) => {
      const lockedRows = await transaction<ReviewRecord[]>`
        select
          review.id as review_id,
          review.project_id,
          review.status,
          event.report_id,
          event.id as extracted_event_id,
          event.event_date,
          event.summary,
          event.quantity,
          event.unit
        from public.review_items review
        join public.extracted_events event on event.id = review.extracted_event_id
        where review.id = ${review.reviewId}
        for update of review
      `
      const lockedReview = lockedRows[0]
      if (!lockedReview || !['pending', 'in-review', 'clarification-requested'].includes(lockedReview.status)) {
        throw new HttpError(409, 'This review item has already received a final decision.', 'REVIEW_ALREADY_DECIDED')
      }

      if (input.scheduleActivityId) {
        const activities = await transaction<{ id: string }[]>`
          select id from public.schedule_activities
          where id = ${input.scheduleActivityId}
            and project_id = ${lockedReview.projectId}
          limit 1
        `
        if (!activities[0]) {
          throw new HttpError(400, 'The selected activity does not belong to this project.', 'INVALID_ACTIVITY')
        }
      }

      const decisionRows = await transaction<{ id: string }[]>`
        insert into public.verification_decisions (
          review_item_id, decided_by, decision, selected_schedule_activity_id, corrected_event, reason
        ) values (
          ${lockedReview.reviewId}, ${user.id}, ${input.decision},
          ${input.scheduleActivityId ?? null},
          ${input.correctedEvent
            ? transaction.json(input.correctedEvent as Parameters<typeof transaction.json>[0])
            : null},
          ${input.reason ?? null}
        )
        returning id
      `

      let actualId: string | null = null
      let nextReviewStatus: 'accepted' | 'rejected' | 'clarification-requested'

      if (input.decision === 'accept' || input.decision === 'correct') {
        const corrected = input.correctedEvent ?? {}
        const eventDate = typeof corrected.eventDate === 'string' ? corrected.eventDate : lockedReview.eventDate
        const summary = typeof corrected.summary === 'string' ? corrected.summary : lockedReview.summary
        const quantity = typeof corrected.quantity === 'number' ? corrected.quantity : lockedReview.quantity
        const unit = typeof corrected.unit === 'string' ? corrected.unit : lockedReview.unit
        if (!eventDate) {
          throw new HttpError(400, 'A verified actual requires an event date.', 'MISSING_EVENT_DATE')
        }

        const actualRows = await transaction<{ id: string }[]>`
          insert into public.actual_events (
            project_id, extracted_event_id, schedule_activity_id, event_date,
            summary, quantity, unit, verified_by
          ) values (
            ${lockedReview.projectId}, ${lockedReview.extractedEventId}, ${input.scheduleActivityId!},
            ${eventDate}, ${summary}, ${quantity}, ${unit}, ${user.id}
          )
          returning id
        `
        actualId = actualRows[0]!.id
        nextReviewStatus = 'accepted'

        await transaction`
          update public.extracted_events set status = 'verified'
          where id = ${lockedReview.extractedEventId}
        `
      } else if (input.decision === 'reject') {
        nextReviewStatus = 'rejected'
        await transaction`
          update public.extracted_events set status = 'rejected'
          where id = ${lockedReview.extractedEventId}
        `
      } else {
        nextReviewStatus = 'clarification-requested'
        if (!input.reason) {
          throw new HttpError(400, 'A clarification request requires a question.', 'MISSING_CLARIFICATION')
        }
        await transaction`
          insert into public.clarifications (
            project_id, review_item_id, requested_by, question
          ) values (
            ${lockedReview.projectId}, ${lockedReview.reviewId}, ${user.id}, ${input.reason}
          )
        `
      }

      await transaction`
        update public.review_items
        set status = ${nextReviewStatus}
        where id = ${lockedReview.reviewId}
      `

      await transaction`
        insert into public.audit_events (
          project_id, actor_id, action, entity_type, entity_id, previous_value, new_value, request_id
        ) values (
          ${lockedReview.projectId}, ${user.id}, 'review.decision_recorded', 'review_item', ${lockedReview.reviewId},
          ${transaction.json({ status: lockedReview.status })},
          ${transaction.json({ status: nextReviewStatus, decision: input.decision, actualId })},
          ${request.id}
        )
      `

      const pendingReviews = await transaction<{ count: number }[]>`
        select count(*)::int as count
        from public.review_items pending
        join public.extracted_events event on event.id = pending.extracted_event_id
        where event.report_id = ${lockedReview.reportId}
          and pending.status in ('pending', 'in-review', 'clarification-requested')
      `
      if (pendingReviews[0]?.count === 0) {
        await transaction`
          update public.reports set status = 'verified'
          where id = ${lockedReview.reportId}
        `
      }

      return { decisionId: decisionRows[0]!.id, actualId, status: nextReviewStatus }
    })

    return reply.send(result)
  })
}
