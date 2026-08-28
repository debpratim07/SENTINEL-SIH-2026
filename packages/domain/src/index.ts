import { z } from 'zod'

export const userRoles = [
  'site-supervisor',
  'discipline-engineer',
  'planner',
  'project-controls',
  'project-manager',
  'administrator',
] as const

export type UserRole = (typeof userRoles)[number]

export const permissions = [
  'capture',
  'upload-report',
  'clarification-response',
  'review-match',
  'verify-actual',
  'resolve-exception',
  'schedule-integrity',
  'admin-config',
  'view-schedule',
  'view-actuals',
  'view-exceptions',
  'view-performance',
  'view-insights',
  'view-audit',
] as const

export type Permission = (typeof permissions)[number]

export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  'site-supervisor': ['capture', 'upload-report', 'clarification-response', 'view-schedule', 'view-actuals'],
  'discipline-engineer': [
    'capture', 'upload-report', 'view-schedule', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights',
  ],
  planner: [
    'capture', 'upload-report', 'review-match', 'verify-actual', 'resolve-exception',
    'view-audit', 'view-schedule', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights',
  ],
  'project-controls': [
    'capture', 'upload-report', 'review-match', 'verify-actual', 'resolve-exception',
    'view-audit', 'schedule-integrity', 'view-schedule', 'view-actuals', 'view-exceptions',
    'view-performance', 'view-insights',
  ],
  'project-manager': ['view-schedule', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights'],
  administrator: [
    'admin-config', 'view-schedule', 'view-actuals', 'view-exceptions', 'view-performance', 'view-insights', 'view-audit',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

export const reportStatuses = [
  'uploading', 'uploaded', 'queued', 'processing', 'extracted', 'needs-review', 'verified', 'failed',
] as const
export type ReportStatus = (typeof reportStatuses)[number]

export const reviewStatuses = ['pending', 'in-review', 'accepted', 'rejected', 'clarification-requested'] as const
export type ReviewStatus = (typeof reviewStatuses)[number]

export const decisionTypes = ['accept', 'reject', 'correct', 'request-clarification'] as const
export type DecisionType = (typeof decisionTypes)[number]

export const initiateUploadSchema = z.object({
  projectId: z.uuid(),
  fileName: z.string().trim().min(1).max(240),
  contentType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(50 * 1024 * 1024),
  reportDate: z.iso.date(),
  title: z.string().trim().min(1).max(240),
})

export type InitiateUploadInput = z.infer<typeof initiateUploadSchema>

export const completeUploadSchema = z.object({
  checksumSha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
})

export type CompleteUploadInput = z.infer<typeof completeUploadSchema>

export const reviewDecisionSchema = z.object({
  decision: z.enum(decisionTypes),
  scheduleActivityId: z.uuid().optional(),
  reason: z.string().trim().max(2000).optional(),
  correctedEvent: z.record(z.string(), z.unknown()).optional(),
}).superRefine((value, context) => {
  if ((value.decision === 'accept' || value.decision === 'correct') && !value.scheduleActivityId) {
    context.addIssue({
      code: 'custom',
      path: ['scheduleActivityId'],
      message: 'A schedule activity is required for an accepted or corrected match.',
    })
  }
})

export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>

export interface ProjectMembership {
  projectId: string
  projectName: string
  role: UserRole
  disciplines: string[]
}

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  memberships: ProjectMembership[]
}

export type ScheduleActivityStatus =
  | 'not-started'
  | 'in-progress'
  | 'started-late'
  | 'finished-late'
  | 'missing-actual'
  | 'complete'

export type ScheduleTrustLevel = 'verified' | 'unverified' | 'missing'

export interface ScheduleActivitySummary {
  id: string
  externalId: string
  name: string
  description: string | null
  level: 'L3' | 'L4' | 'L5' | 'L6'
  discipline: string
  area: string
  plannedStart: string | null
  plannedFinish: string | null
  actualStart: string | null
  actualFinish: string | null
  plannedProgress: number
  actualProgress: number
  startVarianceDays: number | null
  finishVarianceDays: number | null
  status: ScheduleActivityStatus
  trust: ScheduleTrustLevel
}

export interface ScheduleMetrics {
  actualProgress: number
  plannedProgress: number
  variance: number
  startedLate: number
  finishedLate: number
}

export interface ProjectScheduleResponse {
  projectId: string
  today: string
  importVersion: number | null
  importedAt: string | null
  activities: ScheduleActivitySummary[]
  metrics: ScheduleMetrics
}
