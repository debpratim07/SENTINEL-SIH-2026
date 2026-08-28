import type { CompleteUploadInput, InitiateUploadInput } from '@sentinel/domain'
import { environment } from './environment'

interface ApiErrorBody {
  error?: string
  message?: string
  requestId?: string
}

export interface InitiatedUpload {
  reportId: string
  fileId: string
  reportNumber: string
  storagePath: string
  signedUploadUrl: string
  uploadToken: string
}

export interface CompletedUpload {
  reportId: string
  fileId: string
  jobId: string
  status: 'queued'
}

async function apiRequest<T>(path: string, token: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${environment.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as ApiErrorBody
    const trace = body.requestId ? ` Reference: ${body.requestId}` : ''
    throw new Error(`${body.message ?? 'The SENTINEL service rejected the request.'}${trace}`)
  }
  return response.json() as Promise<T>
}

export function initiateReportUpload(input: InitiateUploadInput, token: string) {
  return apiRequest<InitiatedUpload>('/v1/uploads/initiate', token, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function completeReportUpload(fileId: string, input: CompleteUploadInput, token: string) {
  return apiRequest<CompletedUpload>(`/v1/uploads/${encodeURIComponent(fileId)}/complete`, token, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
