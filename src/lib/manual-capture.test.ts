import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildManualCaptureInput,
  canCaptureProgress,
  resolveCaptureRequest,
  validateManualCapture,
  type ManualCaptureDraft,
} from './manual-capture.ts'

const valid: ManualCaptureDraft = {
  report_date: '2026-09-14',
  text: 'Synthetic test: insulation work started on line L-101 on 13 September.',
  event_type: 'start',
  actual_date: '2026-09-13',
  source_quote: 'insulation work started on line L-101',
}

test('requires an exact source quote and preserves original evidence byte-for-byte', () => {
  assert.equal(validateManualCapture(valid), null)
  assert.match(validateManualCapture({ ...valid, source_quote: 'Insulation work started' }) ?? '', /exact part/)
  const payload = buildManualCaptureInput(valid, '00000000-0000-4000-8000-000000000001')
  assert.equal(payload.text, valid.text)
  assert.equal(payload.source_quote, valid.source_quote)
})

test('preserves nullable dates and rejects fabricated or impossible date mappings', () => {
  const observation = { ...valid, event_type: 'progress_observation' as const, actual_date: null }
  assert.equal(validateManualCapture(observation), null)
  assert.equal(buildManualCaptureInput(observation, 'key').actual_date, null)
  assert.match(validateManualCapture({ ...valid, actual_date: '2026-09-15' }) ?? '', /later than/)
})

test('capture availability follows only the real backend membership roles', () => {
  assert.equal(canCaptureProgress('administrator'), true)
  assert.equal(canCaptureProgress('site-supervisor'), true)
  assert.equal(canCaptureProgress('project-manager'), false)
  assert.equal(canCaptureProgress(null), false)
})

test('unchanged retries reuse a request key while changed submissions receive a new key', () => {
  let issued = 0
  const createKey = () => `key-${++issued}`
  const first = resolveCaptureRequest(null, valid, createKey)
  const retry = resolveCaptureRequest(first, valid, createKey)
  const changed = resolveCaptureRequest(retry, { ...valid, actual_date: null }, createKey)
  assert.equal(retry.key, first.key)
  assert.equal(issued, 2)
  assert.notEqual(changed.key, first.key)
})
