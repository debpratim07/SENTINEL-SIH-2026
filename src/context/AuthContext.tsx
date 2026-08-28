import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { environment } from '../lib/environment'
import { supabase } from '../lib/supabase'

const DEMO_EMAIL = 'arjun.mehta@sentinel.demo'
const DEMO_PASSWORD = 'sentinel123'
const DEMO_SESSION_KEY = 'sentinel.demo.session'

interface AuthIdentity {
  id: string
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthIdentity | null
  loading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  getAccessToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function identityFromSession(session: Session | null): AuthIdentity | null {
  if (!session?.user.email) return null
  const metadataName = session.user.user_metadata?.full_name
  return {
    id: session.user.id,
    email: session.user.email,
    name: typeof metadataName === 'string' && metadataName.trim() ? metadataName : session.user.email.split('@')[0],
  }
}

const demoIdentity: AuthIdentity = {
  id: '00000000-0000-4000-8000-000000000001',
  email: DEMO_EMAIL,
  name: 'Arjun Mehta',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDemoMode = !environment.supabaseConfigured && environment.demoAuthEnabled
  const [user, setUser] = useState<AuthIdentity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setUser(isDemoMode && localStorage.getItem(DEMO_SESSION_KEY) === 'active' ? demoIdentity : null)
      setLoading(false)
      return
    }

    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(identityFromSession(data.session))
        setLoading(false)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(identityFromSession(session))
      setLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [isDemoMode])

  async function signIn(email: string, password: string) {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return
    }

    if (!isDemoMode || email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password.')
    }

    localStorage.setItem(DEMO_SESSION_KEY, 'active')
    setUser(demoIdentity)
  }

  async function signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
    localStorage.removeItem(DEMO_SESSION_KEY)
    setUser(null)
  }

  async function requestPasswordReset(email: string) {
    if (!supabase) return
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async function getAccessToken() {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isDemoMode,
    signIn,
    signOut,
    requestPasswordReset,
    getAccessToken,
  }), [user, loading, isDemoMode])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
