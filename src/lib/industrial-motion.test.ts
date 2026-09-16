import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldReduceMotion, visibleFocusable } from './industrial-motion.ts'

test('OS motion reduction cannot be overridden by the UI preference', () => {
  assert.equal(shouldReduceMotion(true, false), true)
  assert.equal(shouldReduceMotion(false, true), true)
  assert.equal(shouldReduceMotion(false, false), false)
})

test('focus navigation excludes hidden, disabled and negative-tab-index controls', () => {
  const usable = { disabled: false, visible: true, tabIndex: 0 }
  assert.deepEqual(visibleFocusable([usable, {...usable, disabled: true}, {...usable, visible: false}, {...usable, tabIndex: -1}]), [usable])
})
