import { useState, type FormEvent } from 'react'
import type { PortfolioEntry } from '../data/portfolio'
import { formatDateRange } from '../lib/dates'
import { validateEntryDates } from '../lib/entryForm'
import { resolveMediaUrlForSave } from '../lib/portfolioMedia'
import { normalizeHttpUrl } from '../lib/url'
import { EntryFieldSet } from './EntryFieldSet'

type Props = {
  entry: PortfolioEntry
  canManage?: boolean
  onUpdate?: (id: string, entry: Omit<PortfolioEntry, 'id'>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

function initialMediaUrlInput(entry: PortfolioEntry): string {
  const url = entry.mediaUrl?.trim() ?? ''
  if (!url || url.startsWith('blob:')) return ''
  return url
}

export function EntryCard({
  entry,
  canManage = false,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [name, setName] = useState(entry.name)
  const [startDate, setStartDate] = useState(entry.startDate)
  const [endDate, setEndDate] = useState(entry.endDate ?? '')
  const [ongoing, setOngoing] = useState(entry.endDate === null)
  const [description, setDescription] = useState(entry.description)
  const [githubLink, setGithubLink] = useState(entry.githubLink)
  const [mediaUrlInput, setMediaUrlInput] = useState(() => initialMediaUrlInput(entry))
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [removeMedia, setRemoveMedia] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)

  const range = formatDateRange(entry.startDate, entry.endDate)
  const github = entry.githubLink.trim()
  const hasGithub = github.length > 0
  const displayImageUrl =
    entry.mediaUrl && !entry.mediaUrl.startsWith('blob:') ? entry.mediaUrl : null

  function resetEditForm() {
    setName(entry.name)
    setStartDate(entry.startDate)
    setEndDate(entry.endDate ?? '')
    setOngoing(entry.endDate === null)
    setDescription(entry.description)
    setGithubLink(entry.githubLink)
    setMediaUrlInput(initialMediaUrlInput(entry))
    setMediaFile(null)
    setRemoveMedia(false)
    setDateError(null)
    setSaveError(null)
  }

  function openEdit() {
    resetEditForm()
    setEditing(true)
  }

  function cancelEdit() {
    resetEditForm()
    setEditing(false)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!onUpdate) return

    setDateError(null)
    setSaveError(null)

    if (!name.trim()) return

    const dateErr = validateEntryDates(startDate, endDate, ongoing)
    if (dateErr) {
      setDateError(dateErr)
      return
    }

    setSaving(true)
    try {
      const mediaUrl = await resolveMediaUrlForSave({
        file: mediaFile,
        urlInput: mediaUrlInput,
        storageFolder: entry.id,
        existingUrl: entry.mediaUrl,
        removeMedia,
      })

      await onUpdate(entry.id, {
        name: name.trim(),
        startDate,
        endDate: ongoing || !endDate ? null : endDate,
        description: description.trim(),
        githubLink: githubLink.trim(),
        mediaUrl,
        mediaAlt: mediaUrl ? `${name.trim()} — project image` : undefined,
      })
      setEditing(false)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Could not save changes.',
      )
    } finally {
      setSaving(false)
    }
  }

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
    <article
      className={`entry-card${editing ? ' entry-card--editing' : ''}`}
      aria-labelledby={`entry-${entry.id}-title`}
    >
      {displayImageUrl && !editing ? (
        <div className="entry-card__media">
          <img
            src={displayImageUrl}
            alt={entry.mediaAlt ?? `${entry.name} — project image`}
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="entry-card__body">
        {editing ? (
          <form className="entry-card__edit-form" onSubmit={handleSave} noValidate>
            <p className="entry-card__edit-label">Edit entry</p>
            <EntryFieldSet
              idPrefix={`edit-${entry.id}`}
              name={name}
              onNameChange={setName}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              ongoing={ongoing}
              onOngoingChange={setOngoing}
              description={description}
              onDescriptionChange={setDescription}
              githubLink={githubLink}
              onGithubLinkChange={setGithubLink}
              mediaUrlInput={mediaUrlInput}
              onMediaUrlInputChange={setMediaUrlInput}
              mediaFile={mediaFile}
              onMediaFileChange={setMediaFile}
              existingImageUrl={displayImageUrl}
              removeMedia={removeMedia}
              onRemoveMediaChange={setRemoveMedia}
            />
            {dateError ? <p className="add-entry-form__error">{dateError}</p> : null}
            {saveError ? <p className="add-entry-form__error">{saveError}</p> : null}
            <div className="entry-card__edit-actions">
              <button
                type="submit"
                className="entry-card__save"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="entry-card__cancel"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
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
              {canManage && (onUpdate || onDelete) ? (
                <div className="entry-card__owner-actions">
                  {onUpdate ? (
                    <button
                      type="button"
                      className="entry-card__edit"
                      onClick={openEdit}
                      disabled={deleting}
                    >
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      className="entry-card__delete"
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                  ) : null}
                  {deleteError ? (
                    <p className="entry-card__delete-error" role="alert">
                      {deleteError}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
