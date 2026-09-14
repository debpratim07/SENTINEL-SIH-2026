import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getConnectedIdentity } from '../lib/connected-api'
import { resolveProjectAccess } from '../lib/connected-projects'
import type { IdentityResponse } from '../lib/connected-types'
import { useConnectedAuth } from './ConnectedAuthContext'

interface ConnectedProjectValue extends ReturnType<typeof resolveProjectAccess> {
  identity: IdentityResponse | null
  loading: boolean
  error: string
  selectProject: (projectId: string) => void
  refresh: () => Promise<void>
}

const ConnectedProjectContext = createContext<ConnectedProjectValue | null>(null)

export function ConnectedProjectProvider({ children }: { children: React.ReactNode }) {
  const { session } = useConnectedAuth()
  const userId = session?.user.id ?? null
  const [identity, setIdentity] = useState<IdentityResponse | null>(null)
  const [requestedId, setRequestedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const generation = useRef(0)

  const refresh = useCallback(async () => {
    const current = ++generation.current
    if (!userId) {
      setIdentity(null)
      setRequestedId('')
      setError('')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const next = await getConnectedIdentity()
      if (current === generation.current) setIdentity(next)
    } catch (cause) {
      if (current === generation.current) {
        setIdentity(null)
        setError(cause instanceof Error ? cause.message : 'Unable to load project access.')
      }
    } finally {
      if (current === generation.current) setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    setIdentity(null)
    setRequestedId('')
    void refresh()
    return () => { generation.current++ }
  }, [refresh])

  // A changed session must never briefly expose the previous account's project.
  const currentIdentity = userId && identity?.user.id === userId ? identity : null
  const access = useMemo(() => resolveProjectAccess(currentIdentity, requestedId), [currentIdentity, requestedId])
  const selectProject = useCallback((projectId: string) => {
    if (access.projects.some(project => project.id === projectId)) setRequestedId(projectId)
  }, [access.projects])

  return <ConnectedProjectContext.Provider value={{
    ...access, identity: currentIdentity, loading, error, selectProject, refresh,
  }}>{children}</ConnectedProjectContext.Provider>
}

export function useConnectedProject() {
  const context = useContext(ConnectedProjectContext)
  if (!context) throw new Error('useConnectedProject requires ConnectedProjectProvider')
  return context
}
