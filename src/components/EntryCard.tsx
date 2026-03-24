import type { PortfolioEntry } from '../data/portfolio'
import { formatDateRange } from '../lib/dates'
import { normalizeHttpUrl } from '../lib/url'

type Props = {
  entry: PortfolioEntry
}

export function EntryCard({ entry }: Props) {
  const range = formatDateRange(entry.startDate, entry.endDate)
  const github = entry.githubLink.trim()
  const hasGithub = github.length > 0

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
        {hasGithub ? (
          <p className="entry-card__actions">
            <a href={normalizeHttpUrl(github)} target="_blank" rel="noreferrer">
              GitHub
              <span className="visually-hidden"> for {entry.name}</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
        ) : null}
      </div>
    </article>
  )
}
