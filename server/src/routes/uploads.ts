import { randomUUID } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FastifyInstance } from 'fastify'
import { completeUploadSchema, initiateUploadSchema } from '@sentinel/domain'
import { authenticateRequest, requireProjectPermission } from '../auth'
import type { Database } from '../database'
import { HttpError } from '../errors'

interface UploadRouteDependencies {
  database: Database
  supabase: SupabaseClient
}

interface UploadedFileRecord {
  fileId: string
  reportId: string
  projectId: string
  storageBucket: string
  storagePath: string
  originalFilename: string
}

function safeFileName(fileName: string): string {
  return fileName
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160) || 'report'
}

export async function registerUploadRoutes(app: FastifyInstance, dependencies: UploadRouteDependencies) {
  const { database, supabase } = dependencies

  app.post('/v1/uploads/initiate', async (request, reply) => {
    const user = await authenticateRequest(request, supabase)
    const input = initiateUploadSchema.parse(request.body)
    await requireProjectPermission(database, user.id, input.projectId, 'upload-report')

    const reportId = randomUUID()
    const fileId = randomUUID()
    const reportNumber = `RPT-${input.reportDate.slice(0, 4)}-${reportId.slice(0, 8).toUpperCase()}`
    const storagePath = `${input.projectId}/${reportId}/${fileId}-${safeFileName(input.fileName)}`

    const signedUpload = await database.begin(async (transaction) => {
      await transaction`
        insert into public.reports (
          id, project_id, report_number, title, report_date, status, uploaded_by
        ) values (
          ${reportId}, ${input.projectId}, ${reportNumber}, ${input.title},
          ${input.reportDate}, 'uploading', ${user.id}
        )
      `

      await transaction`
        insert into public.report_files (
          id, report_id, storage_bucket, storage_path, original_filename, content_type, size_bytes
        ) values (
          ${fileId}, ${reportId}, 'project-documents', ${storagePath},
          ${input.fileName}, ${input.contentType}, ${input.sizeBytes}
        )
      `

      const { data, error } = await supabase.storage
        .from('project-documents')
        .createSignedUploadUrl(storagePath)

      if (error || !data) {
        throw new HttpError(502, 'Unable to prepare secure file upload.', 'STORAGE_UNAVAILABLE')
      }

      await transaction`
        insert into public.audit_events (
          project_id, actor_id, action, entity_type, entity_id, new_value, request_id
        ) values (
          ${input.projectId}, ${user.id}, 'report.upload_initiated', 'report', ${reportId},
          ${transaction.json({ reportNumber, fileName: input.fileName, sizeBytes: input.sizeBytes })},
          ${request.id}
        )
      `

      return data
    })

    return reply.code(201).send({
      reportId,
      fileId,
      reportNumber,
      storagePath,
      signedUploadUrl: signedUpload.signedUrl,
      uploadToken: signedUpload.token,
    })
  })

  app.post<{ Params: { fileId: string } }>('/v1/uploads/:fileId/complete', async (request, reply) => {
    const user = await authenticateRequest(request, supabase)
    const input = completeUploadSchema.parse(request.body ?? {})

    const files = await database<UploadedFileRecord[]>`
      select
        report_file.id as file_id,
        report_file.report_id,
        report.project_id,
        report_file.storage_bucket,
        report_file.storage_path,
        report_file.original_filename
      from public.report_files report_file
      join public.reports report on report.id = report_file.report_id
      where report_file.id = ${request.params.fileId}
      limit 1
    `
    const file = files[0]
    if (!file) throw new HttpError(404, 'Upload record not found.', 'UPLOAD_NOT_FOUND')
    await requireProjectPermission(database, user.id, file.projectId, 'upload-report')

    const pathParts = file.storagePath.split('/')
    const storedName = pathParts.pop()
    const folder = pathParts.join('/')
    const { data: storedFiles, error: storageError } = await supabase.storage
      .from(file.storageBucket)
      .list(folder, { search: storedName, limit: 1 })

    if (storageError || !storedFiles?.some((item) => item.name === storedName)) {
      throw new HttpError(409, 'The uploaded file could not be verified in secure storage.', 'UPLOAD_INCOMPLETE')
    }

    const jobId = await database.begin(async (transaction) => {
      await transaction`
        update public.report_files
        set uploaded_at = coalesce(uploaded_at, now()),
            checksum_sha256 = coalesce(${input.checksumSha256 ?? null}, checksum_sha256)
        where id = ${file.fileId}
      `
      await transaction`
        update public.reports
        set status = 'queued', processing_error = null
        where id = ${file.reportId}
      `

      const existingJobs = await transaction<{ id: string }[]>`
        select id from public.ingestion_jobs
        where report_id = ${file.reportId}
          and status in ('queued', 'processing', 'completed')
        order by created_at desc
        limit 1
      `
      const existingJob = existingJobs[0]
      if (existingJob) return existingJob.id

      const createdJobs = await transaction<{ id: string }[]>`
        insert into public.ingestion_jobs (project_id, report_id)
        values (${file.projectId}, ${file.reportId})
        returning id
      `

      await transaction`
        insert into public.audit_events (
          project_id, actor_id, action, entity_type, entity_id, new_value, request_id
        ) values (
          ${file.projectId}, ${user.id}, 'report.upload_completed', 'report', ${file.reportId},
          ${transaction.json({ fileId: file.fileId, checksumSha256: input.checksumSha256 ?? null })},
          ${request.id}
        )
      `
      return createdJobs[0]!.id
    })

    return reply.send({ reportId: file.reportId, fileId: file.fileId, jobId, status: 'queued' })
  })
}
