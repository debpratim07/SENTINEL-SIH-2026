import { CompletionFlow } from '../../components/industrial-flow/CompletionFlow'
import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useConnectedAuth } from '../../context/ConnectedAuthContext'
import { validateNewPassword } from '../../lib/auth-recovery'

export default function ResetPasswordPage({ callbackError = '' }: { callbackError?: string }) {
  const auth = useConnectedAuth()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(callbackError)
  const [complete, setComplete] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const validation = validateNewPassword(password, confirmation)
    if (validation) { setError(validation); return }
    setBusy(true); setError('')
    try {
      await auth.updatePassword(password)
      auth.clearRecovery()
      await auth.signOut()
      setComplete(true)
      window.history.replaceState(null, '', '/')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update your password. Request a new recovery link.')
    } finally { setBusy(false) }
  }

  const invalid = !auth.loading && (!auth.recoveryReady || !auth.session)
  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="reset-title">
      {complete ? <CompletionFlow className="auth-completion" title="Password update confirmed"/> : <div className="auth-mark"><KeyRound size={22}/></div>}
      <p className="auth-eyebrow">SENTINEL ACCOUNT RECOVERY</p>
      <h1 id="reset-title">{complete ? 'Password updated' : invalid ? 'Recovery link unavailable' : 'Set a new password'}</h1>
      {complete ? <>
        <p>Your password has been changed. Sign in again with the new password.</p>
        <a className="auth-primary" href="/">Return to sign in</a>
      </> : invalid ? <>
        <p role={error ? 'alert' : undefined}>{error || 'This password-reset link is invalid, expired, or has already been used.'}</p>
        <div className="auth-actions"><a className="auth-primary" href="/?recover=1">Request another reset</a><a className="auth-secondary" href="/">Return to sign in</a></div>
      </> : <form onSubmit={submit} className="auth-form">
        <p>Choose a new password for your SENTINEL account.</p>
        <label>New password<div className="auth-password"><input autoComplete="new-password" type={visible?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/><button type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible?'Hide password':'Show password'}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
        <label>Confirm new password<input autoComplete="new-password" type={visible?'text':'password'} value={confirmation} onChange={e=>setConfirmation(e.target.value)} required minLength={6}/></label>
        {error&&<p className="auth-error" role="alert">{error}</p>}
        <button className="auth-primary" disabled={busy}>{busy?'Updating password…':'Update password'}</button>
      </form>}
    </section>
  </main>
}
