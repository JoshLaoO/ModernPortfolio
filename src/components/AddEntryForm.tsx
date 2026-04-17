import { useId, useState, type FormEvent } from 'react'
import type { PortfolioEntry } from '../data/portfolio'

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
    setMediaFile(null)
    setDateError(null)
    setSubmitError(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDateError(null)
    setSubmitError(null)

    if (!name.trim()) return

    if (!startDate) {
      setDateError('Add a start date (month).')
      return
    }

    if (!ongoing && endDate && endDate < startDate) {
      setDateError('End date must be the same as or after the start date.')
      return
    }

    const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : null

    setSubmitting(true)
    try {
      await onAdd(kind, {
        name: name.trim(),
        startDate,
        endDate: ongoing || !endDate ? null : endDate,
        description: description.trim(),
        githubLink: githubLink.trim(),
        mediaUrl,
        mediaAlt: mediaFile ? `${name.trim()} — uploaded image` : undefined,
      })
      if (mediaUrl) URL.revokeObjectURL(mediaUrl)
      reset()
    } catch (err) {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl)
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
          Saves to the <code>portfolio_entries</code> table. File uploads are not
          stored yet (blob URLs are not saved); use a public image URL in a future
          version or Supabase Storage.
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

        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            placeholder="e.g. Design system rollout"
          />
        </label>

        <div className="add-entry-form__row">
          <label className="add-entry-form__field">
            <span className="add-entry-form__label">Start date</span>
            <input
              type="month"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className={`add-entry-form__field ${ongoing ? 'is-disabled' : ''}`}>
            <span className="add-entry-form__label">End date</span>
            <input
              type="month"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={ongoing}
            />
          </label>
        </div>

        <label className="add-entry-form__checkbox">
          <input
            type="checkbox"
            checked={ongoing}
            onChange={(e) => {
              setOngoing(e.target.checked)
              if (e.target.checked) setEndDate('')
            }}
          />
          Ongoing (no end date)
        </label>

        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Description</span>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What you did, impact, and tools—whatever you want on the card."
          />
        </label>

        <label className="add-entry-form__field">
          <span className="add-entry-form__label">GitHub link</span>
          <input
            type="url"
            name="githubLink"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            inputMode="url"
            placeholder="https://github.com/org/repo"
          />
        </label>

        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Media</span>
          <input
            type="file"
            name="media"
            accept="image/*"
            onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
          />
          <span className="add-entry-form__hint">Optional image (screenshot, photo, diagram).</span>
        </label>

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
