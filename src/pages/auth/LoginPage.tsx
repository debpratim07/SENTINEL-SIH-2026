import { useEffect, useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useConnectedAuth } from '../../context/ConnectedAuthContext'
import { validateRecoveryEmail } from '../../lib/auth-recovery'

interface Props {
  initialError?: string
}

function SentinelFullLogo() {
  return (
    <svg
      width="140"
      height="40"
      viewBox="0 0 317 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SENTINEL"
      role="img"
    >
      <path
        d="M107.549 43.8676C107.151 41.8302 106.083 40.2152 104.343 39.0225C102.654 37.7802 100.741 37.159 98.6039 37.159C96.5168 37.159 94.7775 37.6808 93.3861 38.7244C91.9947 39.7182 91.3239 41.0599 91.3736 42.7495C91.3736 44.3397 92.1935 45.582 93.8334 46.4765C95.4732 47.371 97.5604 48.0667 100.095 48.5636C103.673 49.2096 106.604 49.9798 108.89 50.8743C111.176 51.7688 112.965 53.0111 114.257 54.6013C115.549 56.1915 116.195 58.2289 116.195 60.7135C116.195 63.1982 115.425 65.2853 113.885 66.9749C112.394 68.6147 110.431 69.8571 107.996 70.7018C105.611 71.4969 103.002 71.8945 100.169 71.8945C96.8398 71.8945 93.8582 71.3479 91.2245 70.2546C88.5908 69.1614 86.5037 67.6209 84.9632 65.6331C83.4227 63.5957 82.5531 61.2353 82.3543 58.5519L90.33 58.0301C90.6282 59.5706 91.1748 60.8875 91.9699 61.9807C92.8147 63.0243 93.9079 63.8442 95.2496 64.4405C96.641 64.9871 98.2561 65.2605 100.095 65.2605C102.182 65.2605 104.045 64.8878 105.685 64.1424C107.325 63.3473 108.145 62.1049 108.145 60.4154C108.095 59.2227 107.723 58.2786 107.027 57.5829C106.381 56.8872 105.561 56.3654 104.567 56.0175C103.573 55.6697 102.207 55.3218 100.467 54.974C100.07 54.9243 99.4984 54.8001 98.753 54.6013C95.4236 53.9056 92.6904 53.1602 90.5536 52.3651C88.4168 51.5203 86.6776 50.3525 85.3359 48.8617C83.9942 47.3213 83.3233 45.3832 83.3233 43.0477C83.3233 40.5133 83.9693 38.3268 85.2613 36.4882C86.5533 34.5998 88.392 33.1587 90.7773 32.1649C93.2122 31.1213 96.0447 30.5995 99.2748 30.5995C103.499 30.5995 107.101 31.7673 110.083 34.1029C113.065 36.3888 114.878 39.4946 115.524 43.4204L107.549 43.8676ZM116.191 51.247C116.191 47.0728 116.961 43.4452 118.502 40.3642C120.042 37.2336 122.229 34.8235 125.061 33.1339C127.894 31.4443 131.174 30.5995 134.901 30.5995C138.131 30.5995 141.038 31.3201 143.622 32.7612C146.255 34.2023 148.367 36.4385 149.958 39.4698C151.597 42.501 152.492 46.2777 152.641 50.7998L152.716 53.4832H124.316C124.614 57.2102 125.683 60.0924 127.521 62.1298C129.36 64.1672 131.82 65.1859 134.901 65.1859C136.888 65.1859 138.702 64.6641 140.342 63.6206C141.982 62.5273 143.199 61.0365 143.994 59.1482L152.119 59.7445C150.976 63.4218 148.815 66.3785 145.634 68.6147C142.504 70.8012 138.926 71.8945 134.901 71.8945C131.174 71.8945 127.894 71.0497 125.061 69.3601C122.229 67.6706 120.042 65.2853 118.502 62.2043C116.961 59.0737 116.191 55.4212 116.191 51.247ZM144.516 47.52C144.019 43.9918 142.901 41.4078 141.162 39.7679C139.423 38.128 137.336 37.3081 134.901 37.3081C132.018 37.3081 129.683 38.2026 127.894 39.9915C126.105 41.7805 124.962 44.29 124.465 47.52H144.516ZM161.9 31.494L162.273 42.0041L161.304 41.1842C161.95 37.6063 163.416 34.9477 165.702 33.2084C168.037 31.4692 170.87 30.5995 174.199 30.5995C178.473 30.5995 181.753 31.9909 184.039 34.7738C186.374 37.5069 187.542 41.1096 187.542 45.582V71H179.79V47.8927C179.79 45.5075 179.541 43.5446 179.044 42.0041C178.547 40.4139 177.727 39.2213 176.585 38.4262C175.491 37.5814 174.025 37.159 172.187 37.159C169.205 37.159 166.87 38.0783 165.18 39.917C163.49 41.7556 162.646 44.4142 162.646 47.8927V71H154.894V31.494H161.9ZM202.548 22.5493V59.7445C202.548 61.3347 202.92 62.5522 203.666 63.397C204.461 64.1921 205.629 64.5896 207.169 64.5896H212.983V71H206.498C202.672 71 199.765 70.031 197.777 68.093C195.789 66.1549 194.795 63.3721 194.795 59.7445V22.5493H202.548ZM213.058 31.494V37.9044H188.832V31.494H213.058ZM222.676 31.494V71H214.924V31.494H222.676ZM222.9 18.0769V25.6054H214.85V18.0769H222.9ZM233.857 31.494L234.23 42.0041L233.261 41.1842C233.907 37.6063 235.373 34.9477 237.659 33.2084C239.994 31.4692 242.827 30.5995 246.156 30.5995C250.43 30.5995 253.71 31.9909 255.995 34.7738C258.331 37.5069 259.499 41.1096 259.499 45.582V71H251.747V47.8927C251.747 45.5075 251.498 43.5446 251.001 42.0041C250.504 40.4139 249.684 39.2213 248.541 38.4262C247.448 37.5814 245.982 37.159 244.144 37.159C241.162 37.159 238.826 38.0783 237.137 39.917C235.447 41.7556 234.603 44.4142 234.603 47.8927V71H226.85V31.494H233.857ZM260.699 51.247C260.699 47.0728 261.469 43.4452 263.01 40.3642C264.55 37.2336 266.737 34.8235 269.569 33.1339C272.402 31.4443 275.681 30.5995 279.408 30.5995C282.638 30.5995 285.545 31.3201 288.13 32.7612C290.763 34.2023 292.875 36.4385 294.465 39.4698C296.105 42.501 297 46.2777 297.149 50.7998L297.223 53.4832H268.824C269.122 57.2102 270.19 60.0924 272.029 62.1298C273.868 64.1672 276.327 65.1859 279.408 65.1859C281.396 65.1859 283.21 64.6641 284.85 63.6206C286.49 62.5273 287.707 61.0365 288.502 59.1482L296.627 59.7445C295.484 63.4218 293.322 66.3785 290.142 68.6147C287.011 70.8012 283.434 71.8945 279.408 71.8945C275.681 71.8945 272.402 71.0497 269.569 69.3601C266.737 67.6706 264.55 65.2853 263.01 62.2043C261.469 59.0737 260.699 55.4212 260.699 51.247ZM289.024 47.52C288.527 43.9918 287.409 41.4078 285.67 39.7679C283.93 38.128 281.843 37.3081 279.408 37.3081C276.526 37.3081 274.191 38.2026 272.402 39.9915C270.613 41.7805 269.47 44.29 268.973 47.52H289.024ZM307.963 18.0769V61.9807C307.963 62.8255 308.162 63.4715 308.559 63.9187C309.006 64.366 309.652 64.5896 310.497 64.5896H313.777V71H308.857C306.273 71 304.186 70.2049 302.596 68.6147C301.006 67.0246 300.211 64.9374 300.211 62.3534V18.0769H307.963Z"
        fill="currentColor"
      />
      <path
        d="M40.5437 14.2436C40.9913 14.2428 41.4347 14.3302 41.8485 14.5009C42.2623 14.6716 42.6384 14.9221 42.9553 15.2382V15.2518C47.3367 19.5819 51.3177 24.2992 54.8494 29.3463C59.6589 36.3425 64.3866 45.5594 64.3866 55.117C64.3866 64.225 61.9341 71.1394 57.4449 75.7921C52.9488 80.4449 47.1951 83.2449 40.8734 83.2449C34.5516 83.2449 28.1319 80.4449 23.6426 75.7921C19.1533 71.1394 16.7009 64.225 16.7009 55.117C16.7009 45.5594 21.4286 36.3425 26.2381 29.3463C29.7673 24.2972 33.746 19.5775 38.1254 15.245C38.4417 14.9277 38.8244 14.6759 39.2382 14.504C39.652 14.3322 40.0957 14.2437 40.5437 14.2436Z"
        fill="url(#loginLogoGrad)"
      />
      <defs>
        <linearGradient id="loginLogoGrad" x1="29.5563" y1="79.9487" x2="40.9832" y2="14.4634" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F46F29" />
          <stop offset="1" stopColor="#F59B4C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

type LoginView = 'login' | 'forgot'

export default function LoginPage({ initialError = '' }: Props) {
  const auth = useConnectedAuth()
  const [view, setView] = useState<LoginView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)
  const [recoverySent, setRecoverySent] = useState(false)

  useEffect(() => {
    if (new URL(window.location.href).searchParams.get('recover') === '1') setView('forgot')
  }, [])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      if (!auth.configured) throw new Error('The project connection is not configured. Contact your project administrator.')
      await auth.signIn(email.trim(), password)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (!validateRecoveryEmail(email)) { setError('Enter a valid email address.'); return }
    setLoading(true)
    try {
      await auth.requestPasswordReset(email.trim().toLowerCase())
      setRecoverySent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to request password recovery. Please try again.')
    } finally { setLoading(false) }
  }

  const fieldStyle = {
    width: '100%',
    height: 44,
    borderRadius: 10,
    border: '1px solid var(--c-border)',
    background: 'var(--c-page)',
    color: 'var(--c-text)',
    fontSize: 14,
    padding: '0 14px',
    outline: 'none',
    fontFamily: 'var(--font-ui)',
    boxSizing: 'border-box' as const,
  }

  return (
    <div
      className="auth-login-page flex min-h-screen items-center justify-center"
      style={{ background: 'var(--c-page)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient warm glow — extremely restrained */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 760,
          height: 520,
          background: 'radial-gradient(ellipse at center, rgba(244,111,41,0.055) 0%, rgba(244,111,41,0.018) 42%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="auth-login-wrap" style={{ width: '100%', maxWidth: 460, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Logo + tagline */}
        <div className="mb-7 flex flex-col items-center gap-3" style={{ color: 'var(--c-text)' }}>
          <SentinelFullLogo />
          <p className="text-[12.5px] tracking-[-0.005em]" style={{ color: 'var(--c-subtle)' }}>
            Turn field execution into trusted schedule intelligence.
          </p>
        </div>

        {view === 'login' ? (
          <div
            className="auth-login-card rounded-[18px] p-9"
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <h1 className="mb-1.5 text-[22px] font-bold tracking-[-0.025em]" style={{ color: 'var(--c-text)' }}>
              Welcome back
            </h1>
            <p className="mb-7 text-[13px]" style={{ color: 'var(--c-muted)' }}>
              Sign in to continue to your project workspace.
            </p>

            <form onSubmit={handleSignIn} noValidate>
              <div className="mb-4">
                <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="your@email.com"
                  style={fieldStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(244,111,41,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,111,41,0.08)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--c-border)'; e.target.style.boxShadow = 'none' }}
                  aria-label="Email address"
                />
              </div>

              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[12px] hover:underline"
                    style={{ color: '#F46F29' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    style={{ ...fieldStyle, paddingRight: 44 }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(244,111,41,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,111,41,0.08)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--c-border)'; e.target.style.boxShadow = 'none' }}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--c-muted)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="mb-4 rounded-[8px] px-3 py-2.5 text-[12px]"
                  style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)', color: '#DC2626' }}
                  role="alert"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !auth.configured}
                className="w-full rounded-[10px] py-3 text-[14px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                style={{
                  background: loading ? '#F46F29' : 'linear-gradient(135deg, #F46F29 0%, #F59B4C 100%)',
                  boxShadow: '0 2px 10px rgba(244,111,41,0.26)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px]" style={{ color: 'var(--c-subtle)' }}>
              Sign in with your SENTINEL project account to capture field progress, review events, and inspect verified schedule records.
            </p>
          </div>
        ) : (
          <div
            className="auth-login-card rounded-[18px] p-8"
            style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}
          >
            <button
              onClick={() => { setView('login'); setRecoverySent(false); setError(''); window.history.replaceState(null,'','/') }}
              className="mb-5 flex items-center gap-1.5 text-[13px] hover:opacity-70"
              style={{ color: 'var(--c-muted)' }}
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Back to Sign In
            </button>
            <h1 className="mb-1.5 text-[20px] font-bold tracking-[-0.02em]" style={{ color: 'var(--c-text)' }}>
              {recoverySent ? 'Check your email' : 'Reset your password'}
            </h1>
            {recoverySent ? <p className="mb-2 text-[13px] leading-5" role="status" style={{ color: 'var(--c-muted)' }}>
              If an account exists for this email, a password recovery link has been sent. Open it on this device to continue securely.
            </p> : <form onSubmit={handleRecovery} noValidate>
              <p className="mb-5 text-[13px] leading-5" style={{ color: 'var(--c-muted)' }}>Enter your account email. SENTINEL will send a secure recovery link through Supabase Auth.</p>
              <label className="mb-1.5 block text-[12px] font-semibold" style={{color:'var(--c-text)'}}>Email</label>
              <input type="email" autoComplete="email" value={email} onChange={e=>{setEmail(e.target.value);setError('')}} placeholder="your@email.com" style={fieldStyle}/>
              {error&&<div className="my-4 rounded-[8px] px-3 py-2.5 text-[12px]" role="alert" style={{background:'rgba(220,38,38,.08)',color:'#DC2626'}}>{error}</div>}
              <button type="submit" disabled={loading||!auth.configured} className="mt-5 w-full rounded-[10px] py-3 text-[14px] font-semibold text-white disabled:opacity-60" style={{background:'linear-gradient(135deg,#F46F29,#F59B4C)'}}>{loading?'Sending secure link…':'Send recovery link'}</button>
            </form>}
          </div>
        )}
      </div>
    </div>
  )
}
