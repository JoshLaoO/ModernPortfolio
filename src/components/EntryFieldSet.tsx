type Props = {
  name: string
  onNameChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  ongoing: boolean
  onOngoingChange: (value: boolean) => void
  description: string
  onDescriptionChange: (value: string) => void
  githubLink: string
  onGithubLinkChange: (value: string) => void
  mediaUrlInput: string
  onMediaUrlInputChange: (value: string) => void
  mediaFile: File | null
  onMediaFileChange: (file: File | null) => void
  existingImageUrl?: string | null
  removeMedia?: boolean
  onRemoveMediaChange?: (value: boolean) => void
  idPrefix?: string
}

export function EntryFieldSet({
  name,
  onNameChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  ongoing,
  onOngoingChange,
  description,
  onDescriptionChange,
  githubLink,
  onGithubLinkChange,
  mediaUrlInput,
  onMediaUrlInputChange,
  mediaFile,
  onMediaFileChange,
  existingImageUrl,
  removeMedia = false,
  onRemoveMediaChange,
  idPrefix = 'entry',
}: Props) {
  const showExistingPreview =
    Boolean(existingImageUrl) &&
    isPersistablePreviewUrl(existingImageUrl) &&
    !removeMedia &&
    !mediaFile

  return (
    <>
      <label className="add-entry-form__field">
        <span className="add-entry-form__label">Name</span>
        <input
          type="text"
          id={`${idPrefix}-name`}
          name="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          autoComplete="off"
        />
      </label>

      <div className="add-entry-form__row">
        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Start date</span>
          <input
            type="month"
            id={`${idPrefix}-start`}
            name="startDate"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            required
          />
        </label>
        <label className={`add-entry-form__field ${ongoing ? 'is-disabled' : ''}`}>
          <span className="add-entry-form__label">End date</span>
          <input
            type="month"
            id={`${idPrefix}-end`}
            name="endDate"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={ongoing}
          />
        </label>
      </div>

      <label className="add-entry-form__checkbox">
        <input
          type="checkbox"
          checked={ongoing}
          onChange={(e) => {
            onOngoingChange(e.target.checked)
            if (e.target.checked) onEndDateChange('')
          }}
        />
        Ongoing (no end date)
      </label>

      <label className="add-entry-form__field">
        <span className="add-entry-form__label">Description</span>
        <textarea
          id={`${idPrefix}-description`}
          name="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
        />
      </label>

      <label className="add-entry-form__field">
        <span className="add-entry-form__label">GitHub link</span>
        <input
          type="url"
          id={`${idPrefix}-github`}
          name="githubLink"
          value={githubLink}
          onChange={(e) => onGithubLinkChange(e.target.value)}
          inputMode="url"
          placeholder="https://github.com/org/repo"
        />
      </label>

      <fieldset className="add-entry-form__fieldset entry-fieldset__media">
        <legend className="add-entry-form__legend">Image (optional)</legend>
        {showExistingPreview ? (
          <div className="entry-fieldset__preview">
            <img src={existingImageUrl!} alt="" />
            <span className="entry-fieldset__preview-label">Current image</span>
          </div>
        ) : null}
        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Image URL</span>
          <input
            type="url"
            id={`${idPrefix}-media-url`}
            name="mediaUrl"
            value={mediaUrlInput}
            onChange={(e) => onMediaUrlInputChange(e.target.value)}
            placeholder="https://… or upload a file below"
            disabled={removeMedia}
          />
        </label>
        <label className="add-entry-form__field">
          <span className="add-entry-form__label">Upload image</span>
          <input
            type="file"
            id={`${idPrefix}-media-file`}
            name="media"
            accept="image/*"
            disabled={removeMedia}
            onChange={(e) => onMediaFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        {onRemoveMediaChange && existingImageUrl ? (
          <label className="add-entry-form__checkbox">
            <input
              type="checkbox"
              checked={removeMedia}
              onChange={(e) => onRemoveMediaChange(e.target.checked)}
            />
            Remove image
          </label>
        ) : null}
        <span className="add-entry-form__hint">
          Uploads go to Supabase Storage (<code>portfolio-media</code> bucket). A
          public URL is saved on the entry.
        </span>
      </fieldset>
    </>
  )
}

function isPersistablePreviewUrl(url: string | null | undefined): boolean {
  return Boolean(url?.trim()) && !url!.startsWith('blob:')
}
