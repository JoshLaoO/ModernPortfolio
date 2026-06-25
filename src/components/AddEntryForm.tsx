import { useId, useState, type FormEvent } from 'react'
import type { PortfolioEntry } from '../data/portfolio'
import { EntryFieldSet } from './EntryFieldSet'
import { validateEntryDates } from '../lib/entryForm'
import { resolveMediaUrlForSave } from '../lib/portfolioMedia'

export type PortfolioKind = 'project' | 'volunteer'

type Props = {
  onAdd: (kind: PortfolioKind, entry: Omit<PortfolioEntry, 'id'>) => Promise<void>
}

export function AddEntryForm({ onAdd }: Props) {
  const formId = useId()
  const [kind, setKind] = useState<PortfolioKind>('project')
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [ongoing, setOngoing] = useState(false)
  const [description, setDescription] = useState('')
  const [githubLink, setGithubLink] = useState('')
  const [mediaUrlInput, setMediaUrlInput] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function reset() {
    setName('')
    setStartDate('')
    setEndDate('')
    setOngoing(false)
    setDescription('')
    setGithubLink('')
    setMediaUrlInput('')
    setMediaFile(null)
    setDateError(null)
    setSubmitError(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDateError(null)
    setSubmitError(null)

    if (!name.trim()) return

    const dateErr = validateEntryDates(startDate, endDate, ongoing)
    if (dateErr) {
      setDateError(dateErr)
      return
    }

    setSubmitting(true)
    try {
      const storageFolder =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `upload-${Date.now()}`

      const mediaUrl = await resolveMediaUrlForSave({
        file: mediaFile,
        urlInput: mediaUrlInput,
        storageFolder,
        existingUrl: null,
      })

      await onAdd(kind, {
        name: name.trim(),
        startDate,
        endDate: ongoing || !endDate ? null : endDate,
        description: description.trim(),
        githubLink: githubLink.trim(),
        mediaUrl,
        mediaAlt: mediaUrl ? `${name.trim()} — project image` : undefined,
      })
      reset()
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not save to Supabase. Check your connection and RLS insert policy.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="add-entry-section" id="add-entry" aria-labelledby="add-entry-heading">
      <div className="section-heading">
        <h2 id="add-entry-heading">Add an entry</h2>
        <p className="section-subtitle">
          Saves to the <code>portfolio_entries</code> table. Images use a public URL or
          Supabase Storage (<code>portfolio-media</code>).
        </p>
      </div>
      <form className="add-entry-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="add-entry-form__fieldset">
          <legend className="add-entry-form__legend">Section</legend>
          <div className="add-entry-form__radios">
            <label className="add-entry-form__radio-label">
              <input
                type="radio"
                name={`${formId}-kind`}
                value="project"
                checked={kind === 'project'}
                onChange={() => setKind('project')}
              />
              Projects
            </label>
            <label className="add-entry-form__radio-label">
              <input
                type="radio"
                name={`${formId}-kind`}
                value="volunteer"
                checked={kind === 'volunteer'}
                onChange={() => setKind('volunteer')}
              />
              Volunteer
            </label>
          </div>
        </fieldset>

        <EntryFieldSet
          idPrefix={`${formId}-add`}
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
        />

        {dateError ? <p className="add-entry-form__error">{dateError}</p> : null}
        {submitError ? <p className="add-entry-form__error">{submitError}</p> : null}

        <div className="add-entry-form__actions">
          <button
            type="submit"
            className="add-entry-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : `Add to ${kind === 'project' ? 'projects' : 'volunteer'}`}
          </button>
        </div>
      </form>
    </section>
  )
}
