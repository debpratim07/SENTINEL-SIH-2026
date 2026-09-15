import { test } from 'node:test'
import assert from 'node:assert/strict'
import { allowedOrigins } from './deployment-config.ts'

test('deployment origins default to local development only', () => {
  assert.deepEqual(allowedOrigins({}), ['http://127.0.0.1:5173', 'http://localhost:5173'])
})

test('deployment origins include configured and current Vercel hosts without wildcards', () => {
  assert.deepEqual(allowedOrigins({
    ALLOWED_ORIGINS: 'https://sentinel.example, https://sentinel.example/',
    VERCEL_URL: 'sentinel-preview.vercel.app',
    VERCEL_PROJECT_PRODUCTION_URL: 'sentinel.vercel.app',
  }), [
    'https://sentinel.example',
    'https://sentinel-preview.vercel.app',
    'https://sentinel.vercel.app',
  ])
})

test('deployment origins ignore malformed and non-http values', () => {
  assert.deepEqual(allowedOrigins({ ALLOWED_ORIGINS: 'javascript:alert(1),not a host' }), [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ])
})
