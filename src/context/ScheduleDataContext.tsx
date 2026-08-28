import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ScheduleMetrics } from '@sentinel/domain'
import { flattenAll, scheduleTree, type ScheduleActivity } from '../data/scheduleData'
import { scheduleResponseToTree, scheduleTreeToCsv } from '../data/scheduleAdapter'
import { getProjectSchedule } from '../lib/api'
import { useAuth } from './AuthContext'
import { useRole } from './RoleContext'

const demoMetrics: ScheduleMetrics = {
  actualProgress: 68.4,
  plannedProgress: 71.2,
  variance: -2.8,
  startedLate: 23,
  finishedLate: 11,
}

const emptyMetrics: ScheduleMetrics = {
  actualProgress: 0,
  plannedProgress: 0,
  variance: 0,
  startedLate: 0,
  finishedLate: 0,
}

interface ScheduleDataContextValue {
  tree: ScheduleActivity[]
  metrics: ScheduleMetrics
  loading: boolean
  error: string | null
  importVersion: number | null
  today: string
  getActivity: (id: string) => ScheduleActivity | undefined
  reload: () => void
  exportCsv: () => void
}

const ScheduleDataContext = createContext<ScheduleDataContextValue | null>(null)

function localToday(): string {
  const date = new Date()
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export function ScheduleDataProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const { user, membershipLoading } = useRole()
  const [tree, setTree] = useState<ScheduleActivity[]>(auth.isDemoMode ? scheduleTree : [])
  const [metrics, setMetrics] = useState<ScheduleMetrics>(auth.isDemoMode ? demoMetrics : emptyMetrics)
  const [loading, setLoading] = useState(!auth.isDemoMode)
  const [error, setError] = useState<string | null>(null)
  const [importVersion, setImportVersion] = useState<number | null>(auth.isDemoMode ? 1 : null)
  const [today, setToday] = useState(localToday)
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    if (auth.isDemoMode) {
      setTree(scheduleTree)
      setMetrics(demoMetrics)
      setImportVersion(1)
      setToday(localToday())
      setError(null)
      setLoading(false)
      return
    }
    if (!auth.user) {
      setTree([])
      setMetrics(emptyMetrics)
      setImportVersion(null)
      setError(null)
      setLoading(false)
      return
    }
    if (membershipLoading) {
      setLoading(true)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const token = await auth.getAccessToken()
        if (!token) throw new Error('Your session is unavailable. Please sign in again.')
        const response = await getProjectSchedule(user.projectId, token)
        if (!active) return
        setTree(scheduleResponseToTree(response.activities))
        setMetrics(response.metrics)
        setImportVersion(response.importVersion)
        setToday(response.today)
      } catch (requestError) {
        if (!active) return
        setTree([])
        setMetrics(emptyMetrics)
        setImportVersion(null)
        setError(requestError instanceof Error ? requestError.message : 'The project schedule could not be loaded.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [auth.isDemoMode, auth.user, auth.getAccessToken, membershipLoading, reloadVersion, user.projectId])

  const activityMap = useMemo(
    () => new Map(flattenAll(tree).map((activity) => [activity.id, activity])),
    [tree],
  )
  const getActivity = useCallback((id: string) => activityMap.get(id), [activityMap])
  const reload = useCallback(() => setReloadVersion((version) => version + 1), [])

  const exportCsv = useCallback(() => {
    const url = URL.createObjectURL(new Blob([scheduleTreeToCsv(tree)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${user.project.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-schedule.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [tree, user.project])

  const value = useMemo<ScheduleDataContextValue>(() => ({
    tree,
    metrics,
    loading,
    error,
    importVersion,
    today,
    getActivity,
    reload,
    exportCsv,
  }), [tree, metrics, loading, error, importVersion, today, getActivity, reload, exportCsv])

  return <ScheduleDataContext.Provider value={value}>{children}</ScheduleDataContext.Provider>
}

export function useScheduleData() {
  const context = useContext(ScheduleDataContext)
  if (!context) throw new Error('useScheduleData must be used within ScheduleDataProvider')
  return context
}
