import { useCallback, useEffect, useRef, useState } from 'react'
import { getProjectWorkspace } from '../lib/connected-api'
import type { ProjectWorkspaceResponse } from '../lib/connected-types'

interface ScopedWorkspace {
  projectId: string
  data: ProjectWorkspaceResponse
}

export function useConnectedWorkspace(projectId: string) {
  const [scoped, setScoped] = useState<ScopedWorkspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const generation = useRef(0)

  const refresh = useCallback(async () => {
    const current = ++generation.current
    setScoped(null)
    setLoading(true)
    setError('')
    try {
      const data = await getProjectWorkspace(projectId)
      if (current === generation.current) setScoped({ projectId, data })
    } catch (cause) {
      if (current === generation.current) setError(cause instanceof Error ? cause.message : 'Unable to load project data.')
    } finally {
      if (current === generation.current) setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void refresh()
    return () => { generation.current++ }
  }, [refresh])

  return {
    workspace: scoped?.projectId === projectId ? scoped.data : null,
    loading,
    error,
    refresh,
  }
}
