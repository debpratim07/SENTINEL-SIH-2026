import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveProjectAccess } from './connected-projects.ts'
import type { IdentityResponse } from './connected-types'

const identity: IdentityResponse = {
  user: { id: 'user-1', email: 'user@example.invalid' },
  memberships: [
    { project_id: 'project-a', role: 'site-supervisor' },
    { project_id: 'project-b', role: 'administrator' },
  ],
  projects: [
    { id: 'project-a', name: 'A', timezone: 'Asia/Kolkata', active_schedule_id: null },
    { id: 'project-b', name: 'B', timezone: 'Asia/Kolkata', active_schedule_id: null },
    { id: 'unassigned', name: 'Unassigned', timezone: 'Asia/Kolkata', active_schedule_id: null },
  ],
}

test('selects only server-returned membership projects and uses the real role', () => {
  const access = resolveProjectAccess(identity, 'project-b')
  assert.equal(access.project?.id, 'project-b')
  assert.equal(access.role, 'administrator')
  assert.deepEqual(access.projects.map(project => project.id), ['project-a', 'project-b'])
})

test('rejects an unassigned selection and falls back to an authorized project', () => {
  const access = resolveProjectAccess(identity, 'unassigned')
  assert.equal(access.project?.id, 'project-a')
  assert.equal(access.role, 'site-supervisor')
})

test('has no project or role without a connected identity or membership', () => {
  assert.deepEqual(resolveProjectAccess(null, 'project-a'), {
    project: null, membership: null, role: null, projects: [],
  })
  const access = resolveProjectAccess({ ...identity, memberships: [] }, 'project-a')
  assert.equal(access.project, null)
  assert.equal(access.role, null)
})
