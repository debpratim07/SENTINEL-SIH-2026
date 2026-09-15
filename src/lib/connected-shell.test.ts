import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emailInitials, roleLabel, shellNavVisible } from './connected-shell.ts'

test('connected shell labels the backend role and does not invent an unassigned role', () => {
  assert.equal(roleLabel('administrator'), 'Administrator')
  assert.equal(roleLabel('site-supervisor'), 'Site Supervisor')
  assert.equal(roleLabel(null), 'No project role')
})

test('connected shell initials come only from the authenticated email', () => {
  assert.equal(emailInitials('debpratim100@gmail.com'), 'DE')
  assert.equal(emailInitials('a.b@example.com'), 'AB')
})

test('shell-level navigation follows the real project role', () => {
  assert.equal(shellNavVisible('administrator', 'review-queue'), true)
  assert.equal(shellNavVisible('project-manager', 'audit-log'), false)
  assert.equal(shellNavVisible('planner', 'admin'), false)
  assert.equal(shellNavVisible(null, 'dashboard'), false)
})
