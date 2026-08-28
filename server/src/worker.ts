import 'dotenv/config'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { loadConfig } from './config'
import { createDatabase, type Database } from './database'

interface ClaimedJob {
  id: string
  projectId: string
  reportId: string
  attempts: number
  maxAttempts: number
}

interface ReportFile {
  id: string
  storageBucket: string
  storagePath: string
  contentType: string
}

interface Candidate {
  id: string
  score: number
}

const workerId = `ingestion-${process.pid}`
let stopping = false

async function claimJob(database: Database): Promise<ClaimedJob | null> {
  return database.begin(async (transaction) => {
    const jobs = await transaction<ClaimedJob[]>`
      select id, project_id, report_id, attempts, max_attempts
      from public.ingestion_jobs
      where status = 'queued'
      order by created_at
      for update skip locked
      limit 1
    `
    const job = jobs[0]
    if (!job) return null

    await transaction`
      update public.ingestion_jobs
      set status = 'processing',
          attempts = attempts + 1,
          locked_by = ${workerId},
          locked_at = now(),
          started_at = coalesce(started_at, now()),
          last_error = null
      where id = ${job.id}
    `
    await transaction`
      update public.reports set status = 'processing', processing_error = null
      where id = ${job.reportId}
    `
    return { ...job, attempts: job.attempts + 1 }
  })
}

function extractPlainText(contentType: string, bytes: ArrayBuffer): string[] {
  if (contentType !== 'text/plain' && contentType !== 'text/csv') {
    throw new Error(
      `No extractor is configured for ${contentType}. Configure the PDF/OCR extraction adapter before processing this format.`,
    )
  }

  const text = new TextDecoder().decode(bytes)
  const statements = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 8)
    .slice(0, 500)

  if (!statements.length) throw new Error('The uploaded document contains no extractable statements.')
  return statements
}

async function processJob(database: Database, supabase: SupabaseClient, job: ClaimedJob) {
  const files = await database<ReportFile[]>`
    select id, storage_bucket, storage_path, content_type
    from public.report_files
    where report_id = ${job.reportId}
    order by version_number desc
    limit 1
  `
  const file = files[0]
  if (!file) throw new Error('The report has no uploaded file record.')

  const { data, error } = await supabase.storage.from(file.storageBucket).download(file.storagePath)
  if (error || !data) throw new Error(`Unable to download the source document: ${error?.message ?? 'unknown error'}`)
  const statements = extractPlainText(file.contentType, await data.arrayBuffer())

  await database.begin(async (transaction) => {
    for (const summary of statements) {
      const evidenceRows = await transaction<{ id: string }[]>`
        insert into public.evidence_references (report_file_id, quoted_text)
        values (${file.id}, ${summary})
        returning id
      `

      const candidates = await transaction<Candidate[]>`
        select
          activity.id,
          greatest(
            similarity(lower(activity.name), lower(${summary})),
            word_similarity(lower(${summary}), lower(activity.name))
          )::float as score
        from public.schedule_activities activity
        join public.schedule_imports import on import.id = activity.schedule_import_id
        where activity.project_id = ${job.projectId}
          and import.status = 'published'
        order by score desc
        limit 5
      `
      const bestScore = candidates[0]?.score ?? 0
      const eventRows = await transaction<{ id: string }[]>`
        insert into public.extracted_events (
          project_id, report_id, evidence_reference_id, summary, confidence, status, raw_payload
        ) values (
          ${job.projectId}, ${job.reportId}, ${evidenceRows[0]!.id}, ${summary},
          ${Math.max(0, Math.min(1, bestScore))}, 'needs-review',
          ${transaction.json({ extractor: 'plain-text-v1' })}
        )
        returning id
      `
      const eventId = eventRows[0]!.id

      for (const [index, candidate] of candidates.entries()) {
        await transaction`
          insert into public.match_candidates (
            extracted_event_id, schedule_activity_id, score, rank, reasons, model_version
          ) values (
            ${eventId}, ${candidate.id}, ${Math.max(0, Math.min(1, candidate.score))}, ${index + 1},
            ${transaction.json(['description-similarity'])}, 'rules-pg-trgm-v1'
          )
        `
      }

      await transaction`
        insert into public.review_items (project_id, extracted_event_id, priority)
        values (${job.projectId}, ${eventId}, ${bestScore < 0.35 ? 10 : 0})
      `
    }

    await transaction`
      update public.ingestion_jobs
      set status = 'completed', completed_at = now(), locked_by = null, locked_at = null
      where id = ${job.id}
    `
    await transaction`
      update public.reports set status = 'needs-review'
      where id = ${job.reportId}
    `
    await transaction`
      insert into public.audit_events (
        project_id, action, entity_type, entity_id, new_value
      ) values (
        ${job.projectId}, 'report.extraction_completed', 'report', ${job.reportId},
        ${transaction.json({ extractedEventCount: statements.length, workerId })}
      )
    `
  })
}

async function failJob(database: Database, job: ClaimedJob, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown ingestion error'
  const terminal = job.attempts >= job.maxAttempts
  await database.begin(async (transaction) => {
    await transaction`
      update public.ingestion_jobs
      set status = ${terminal ? 'failed' : 'queued'},
          last_error = ${message},
          locked_by = null,
          locked_at = null,
          completed_at = ${terminal ? transaction`now()` : null}
      where id = ${job.id}
    `
    if (terminal) {
      await transaction`
        update public.reports set status = 'failed', processing_error = ${message}
        where id = ${job.reportId}
      `
    }
  })
}

export async function runWorkerOnce(database: Database, supabase: SupabaseClient): Promise<boolean> {
  const job = await claimJob(database)
  if (!job) return false
  try {
    await processJob(database, supabase, job)
  } catch (error) {
    await failJob(database, job, error)
  }
  return true
}

async function main() {
  const config = loadConfig()
  const database = createDatabase(config.SUPABASE_DB_URL)
  const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const stop = () => { stopping = true }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)

  while (!stopping) {
    const processed = await runWorkerOnce(database, supabase)
    if (!processed) await new Promise((resolve) => setTimeout(resolve, 3000))
  }
  await database.end({ timeout: 5 })
}

if (process.env.NODE_ENV !== 'test') {
  await main()
}
