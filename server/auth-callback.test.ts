import { test } from 'node:test'
import assert from 'node:assert/strict'
import { authCallbackRoute } from '../src/lib/auth-callback.ts'

test('routes successful root callbacks to the workspace without consuming session parameters', () => {
  const url = new URL('http://127.0.0.1:5173/#access_token=synthetic-token&refresh_token=synthetic-refresh&type=signup')
  const original = url.href
  assert.deepEqual(authCallbackRoute(url), { pathname: '/workspace', error: '' })
  assert.equal(url.href, original)
})

test('expired callback shows a safe explanation instead of the prototype', () => {
  const result = authCallbackRoute(new URL('http://127.0.0.1:5173/#error=access_denied&error_code=otp_expired&error_description=untrusted-content'))
  assert.equal(result.pathname, '/workspace')
  assert.match(result.error, /already used/)
  assert.ok(!result.error.includes('untrusted-content'))
})

test('routes code callbacks and preserves ordinary prototype links', () => {
  assert.equal(authCallbackRoute(new URL('http://127.0.0.1:5173/?code=synthetic-code')).pathname, '/workspace')
  assert.deepEqual(authCallbackRoute(new URL('http://127.0.0.1:5173/#schedule')), { pathname: '/', error: '' })
  assert.deepEqual(authCallbackRoute(new URL('http://127.0.0.1:5173/workspace')), { pathname: '/workspace', error: '' })
})
