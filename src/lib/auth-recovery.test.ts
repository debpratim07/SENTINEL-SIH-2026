import assert from 'node:assert/strict'
import test from 'node:test'
import { acceptedRecoveryRequest, hasRecoveryCallback, recoveryRedirectUrl, recoverySessionState, validateNewPassword, validateRecoveryEmail } from './auth-recovery.ts'

test('builds one origin-relative recovery callback', () => {
  assert.equal(recoveryRedirectUrl('http://127.0.0.1:5173'), 'http://127.0.0.1:5173/reset-password')
  assert.equal(recoveryRedirectUrl('https://sentinel-sih-2026-staging.vercel.app/'), 'https://sentinel-sih-2026-staging.vercel.app/reset-password')
})

test('validates recovery email without revealing account existence', () => {
  assert.equal(validateRecoveryEmail(' person@example.com '), true)
  assert.equal(validateRecoveryEmail('not-an-email'), false)
})

test('validates new password length and confirmation', () => {
  assert.equal(validateNewPassword('short', 'short'), 'Use at least 6 characters.')
  assert.equal(validateNewPassword('long-enough', 'different'), 'The passwords do not match.')
  assert.equal(validateNewPassword('long-enough', 'long-enough'), '')
})

test('detects recovery callbacks without exposing their values', () => {
  assert.equal(hasRecoveryCallback(new URL('https://example.test/reset-password#type=recovery&access_token=secret')), true)
  assert.equal(hasRecoveryCallback(new URL('https://example.test/reset-password?code=secret')), true)
  assert.equal(hasRecoveryCallback(new URL('https://example.test/')), false)
})

test('only recovery auth events establish recovery state and sign-out clears it', () => {
  assert.equal(recoverySessionState('SIGNED_IN', false, true), false)
  assert.equal(recoverySessionState('PASSWORD_RECOVERY', false, true), true)
  assert.equal(recoverySessionState('TOKEN_REFRESHED', true, true), true)
  assert.equal(recoverySessionState('SIGNED_OUT', true, false), false)
  assert.equal(recoverySessionState('PASSWORD_RECOVERY', false, false), false)
})

test('recovery request succeeds only when the real auth abstraction accepts it', async () => {
  await acceptedRecoveryRequest(async () => ({ error: null }))
  await assert.rejects(acceptedRecoveryRequest(async () => ({ error: new Error('Request rejected') })), /Request rejected/)
})
