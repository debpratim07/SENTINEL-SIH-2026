import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface ConnectedAuthValue {
  session: Session | null
  user: User | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ confirmationRequired: boolean }>
  signOut: () => Promise<void>
}

const ConnectedAuthContext = createContext<ConnectedAuthValue | null>(null)

export function ConnectedAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    // One listener owns the real session for both the workspace and future connected screens.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<ConnectedAuthValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    configured: Boolean(supabase),
    async signIn(email, password) {
      if (!supabase) throw new Error('The project connection has not been configured.')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp(email, password) {
      if (!supabase) throw new Error('The project connection has not been configured.')
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { emailRedirectTo: `${window.location.origin}/` },
      })
      if (error) throw error
      return { confirmationRequired: !data.session }
    },
    async signOut() {
      if (!supabase) return
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
    },
  }), [session, loading])

  return <ConnectedAuthContext.Provider value={value}>{children}</ConnectedAuthContext.Provider>
}

export function useConnectedAuth() {
  const context = useContext(ConnectedAuthContext)
  if (!context) throw new Error('useConnectedAuth requires ConnectedAuthProvider')
  return context
}
