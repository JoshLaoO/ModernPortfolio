import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return
      setSession(s)
      setUser(s?.user ?? null)
      setInitializing(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, user, initializing }
}
