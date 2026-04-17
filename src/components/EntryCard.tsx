import { useState } from 'react'
import type { PortfolioEntry } from '../data/portfolio'
import { formatDateRange } from '../lib/dates'
import { normalizeHttpUrl } from '../lib/url'

type Props = {
  entry: PortfolioEntry
  canDelete?: boolean
  onDelete?: (id: string) => Promise<void>
}

export function EntryCard({ entry, canDelete = false, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const range = formatDateRange(entry.startDate, entry.endDate)
  const github = entry.githubLink.trim()
  const hasGithub = github.length > 0

  async function handleDelete() {
    if (!onDelete) return
    if (
      !confirm(
        `Delete “${entry.name}”? This removes it from the database and cannot be undone.`,
      )
    ) {
      return
    }
    setDeleteError(null)
    setDeleting(true)
    try {
      await onDelete(entry.id)
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : 'Could not delete this entry.',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="entry-card" aria-labelledby={`entry-${entry.id}-title`}>
      {entry.mediaUrl ? (
        <div className="entry-card__media">
          <img
            src={entry.mediaUrl}
            alt={entry.mediaAlt ?? `${entry.name} — project media`}
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="entry-card__body">
        <div className="entry-card__meta">
          <time dateTime={entry.startDate}>{range}</time>
        </div>
        <h2 id={`entry-${entry.id}-title`} className="entry-card__title">
          {entry.name}
        </h2>
        <p className="entry-card__description">{entry.description}</p>
        <div className="entry-card__footer">
          {hasGithub ? (
            <p className="entry-card__actions">
              <a href={normalizeHttpUrl(github)} target="_blank" rel="noreferrer">
                GitHub
                <span className="visually-hidden"> for {entry.name}</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </p>
          ) : null}
          {canDelete && onDelete ? (
            <div className="entry-card__owner-actions">
              <button
                type="button"
                className="entry-card__delete"
                onClick={() => void handleDelete()}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
              {deleteError ? (
                <p className="entry-card__delete-error" role="alert">
                  {deleteError}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
