import { useEffect, useState } from 'react'
import {
  initialProjects,
  initialVolunteer,
  type PortfolioEntry,
} from '../data/portfolio'
import { fetchPortfolioEntries } from '../lib/portfolioSupabase'

export function usePortfolioFromSupabase() {
  const [projects, setProjects] = useState<PortfolioEntry[]>([])
  const [volunteer, setVolunteer] = useState<PortfolioEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const next = await fetchPortfolioEntries()
        if (cancelled) return
        setProjects(next.projects)
        setVolunteer(next.volunteer)
      } catch (e) {
        if (cancelled) return
        const message =
          e instanceof Error ? e.message : 'Failed to load portfolio entries'
        setLoadError(message)
        setProjects(initialProjects)
        setVolunteer(initialVolunteer)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    projects,
    setProjects,
    volunteer,
    setVolunteer,
    loading,
    loadError,
  }
}
