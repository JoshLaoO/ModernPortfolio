import type { PortfolioEntry } from '../data/portfolio'
import { EntryCard } from './EntryCard'

type Props = {
  id: string
  title: string
  subtitle: string
  entries: PortfolioEntry[]
  emptyLabel: string
  canManageEntries?: boolean
  onUpdateEntry?: (id: string, entry: Omit<PortfolioEntry, 'id'>) => Promise<void>
  onDeleteEntry?: (id: string) => Promise<void>
}

export function EntryListSection({
  id,
  title,
  subtitle,
  entries,
  emptyLabel,
  canManageEntries = false,
  onUpdateEntry,
  onDeleteEntry,
}: Props) {
  return (
    <section className="entry-list-section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="section-heading">
        <h2 id={`${id}-heading`}>{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      {entries.length === 0 ? (
        <p className="entry-list-empty">{emptyLabel}</p>
      ) : (
        <div className="entry-grid">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              canManage={canManageEntries}
              onUpdate={onUpdateEntry}
              onDelete={onDeleteEntry}
            />
          ))}
        </div>
      )}
    </section>
  )
}
