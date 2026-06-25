import type { PortfolioEntry } from '../data/portfolio'
import { isPersistableMediaUrl } from './entryForm'
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
    .select(entrySelect)
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

type RowWritePayload = {
  name: string
  start_date: string
  end_date: string | null
  description: string
  github_link: string
  media_url: string | null
}

const entrySelect =
  'id, kind, name, start_date, end_date, description, github_link, media_url'

function toRowPayload(entry: Omit<PortfolioEntry, 'id'>): RowWritePayload {
  return {
    name: entry.name,
    start_date: entry.startDate,
    end_date: entry.endDate,
    description: entry.description,
    github_link: entry.githubLink.trim() || '',
    media_url: isPersistableMediaUrl(entry.mediaUrl) ? entry.mediaUrl : null,
  }
}

export async function insertPortfolioEntry(
  kind: 'project' | 'volunteer',
  entry: Omit<PortfolioEntry, 'id'>,
): Promise<PortfolioEntry> {
  const payload = { kind, ...toRowPayload(entry) }

  const { data, error } = await supabase
    .from('portfolio_entries')
    .insert(payload)
    .select(entrySelect)
    .single()

  if (error) throw error
  return mapRowToEntry(data as PortfolioRow)
}

/** Requires an RLS policy that allows UPDATE for the portfolio owner. */
export async function updatePortfolioEntry(
  id: string,
  entry: Omit<PortfolioEntry, 'id'>,
): Promise<PortfolioEntry> {
  const { data, error } = await supabase
    .from('portfolio_entries')
    .update(toRowPayload(entry))
    .eq('id', id)
    .select(entrySelect)
    .single()

  if (error) throw error
  return mapRowToEntry(data as PortfolioRow)
}

/** Requires an RLS policy that allows DELETE for the portfolio owner. */
export async function deletePortfolioEntry(id: string): Promise<void> {
  const { error } = await supabase.from('portfolio_entries').delete().eq('id', id)

  if (error) throw error
}
