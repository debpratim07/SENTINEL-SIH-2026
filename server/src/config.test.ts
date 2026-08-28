import { describe, expect, it } from 'vitest'
import { loadConfig } from './config'

const validEnvironment = {
  NODE_ENV: 'test',
  SUPABASE_URL: 'https://sentinel-test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-that-is-long-enough',
  SUPABASE_DB_URL: 'postgresql://postgres:password@localhost:5432/postgres',
}

describe('API environment', () => {
  it('applies safe development defaults', () => {
    const config = loadConfig(validEnvironment)
    expect(config.API_PORT).toBe(3001)
    expect(config.WEB_ORIGIN).toBe('http://localhost:5173')
  })

  it('rejects an incomplete server configuration', () => {
    expect(() => loadConfig({})).toThrow('Invalid SENTINEL API environment')
  })
})
