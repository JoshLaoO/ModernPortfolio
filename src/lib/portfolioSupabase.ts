import type { PortfolioEntry } from '../data/portfolio'
import { supabase } from './supabaseClient'

/** Row shape for `public.portfolio_entries` (snake_case). */
export type PortfolioRow = {
  id: string
  kind: 'project' | 'volunteer'
  name: string
  start_date: string
  end_date: string | null
  description: string
  github_link: string | null
  media_url: string | null
}

export function mapRowToEntry(row: PortfolioRow): PortfolioEntry {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    githubLink: row.github_link ?? '',
    mediaUrl: row.media_url,
  }
}

export async function fetchPortfolioEntries(): Promise<{
  projects: PortfolioEntry[]
  volunteer: PortfolioEntry[]
}> {
  const { data, error } = await supabase
    .from('portfolio_entries')
    .select(
      'id, kind, name, start_date, end_date, description, github_link, media_url',
    )
    .order('start_date', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as PortfolioRow[]
  const projects = rows
    .filter((r) => r.kind === 'project')
    .map(mapRowToEntry)
  const volunteer = rows
    .filter((r) => r.kind === 'volunteer')
    .map(mapRowToEntry)

  return { projects, volunteer }
}

type InsertPayload = {
  kind: 'project' | 'volunteer'
  name: string
  start_date: string
  end_date: string | null
  description: string
  github_link: string
  media_url: string | null
}

/**
 * Persists a new row. Requires an RLS policy that allows INSERT for the owner.
 * Blob/object URLs from file uploads are not stored; `media_url` is null until you use Storage or a public URL.
 */
export async function insertPortfolioEntry(
  kind: 'project' | 'volunteer',
  entry: Omit<PortfolioEntry, 'id'>,
): Promise<PortfolioEntry> {
  const mediaUrlPersistable =
    entry.mediaUrl && !entry.mediaUrl.startsWith('blob:')
      ? entry.mediaUrl
      : null

  const payload: InsertPayload = {
    kind,
    name: entry.name,
    start_date: entry.startDate,
    end_date: entry.endDate,
    description: entry.description,
    github_link: entry.githubLink.trim() || '',
    media_url: mediaUrlPersistable,
  }

  const { data, error } = await supabase
    .from('portfolio_entries')
    .insert(payload)
    .select(
      'id, kind, name, start_date, end_date, description, github_link, media_url',
    )
    .single()

  if (error) throw error
  return mapRowToEntry(data as PortfolioRow)
}

/** Requires an RLS policy that allows DELETE for the portfolio owner. */
export async function deletePortfolioEntry(id: string): Promise<void> {
  const { error } = await supabase.from('portfolio_entries').delete().eq('id', id)

  if (error) throw error
}
