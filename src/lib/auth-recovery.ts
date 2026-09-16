export const RECOVERY_PATH = '/reset-password'

export function recoverySessionState(event: string, previous: boolean, hasSession: boolean) {
  if (!hasSession || event === 'SIGNED_OUT') return false
  return event === 'PASSWORD_RECOVERY' || previous
}

export async function acceptedRecoveryRequest(request: () => Promise<{ error: unknown }>) {
  const result = await request()
  if (result.error) throw result.error
}

export function recoveryRedirectUrl(origin: string) {
  return new URL(RECOVERY_PATH, origin).toString()
}

export function validateRecoveryEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateNewPassword(password: string, confirmation: string): string {
  if (password.length < 6) return 'Use at least 6 characters.'
  if (password !== confirmation) return 'The passwords do not match.'
  return ''
}

export function hasRecoveryCallback(url: URL) {
  const hash = new URLSearchParams(url.hash.slice(1))
  return url.pathname === RECOVERY_PATH && (
    hash.get('type') === 'recovery' ||
    hash.has('access_token') ||
    url.searchParams.get('type') === 'recovery' ||
    url.searchParams.has('code')
  )
}
