import { isPersistableMediaUrl } from './entryForm'
import { supabase } from './supabaseClient'

const BUCKET = 'portfolio-media'

export async function uploadPortfolioImage(
  file: File,
  folderId: string,
): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80)
  const path = `${folderId}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

type ResolveMediaOptions = {
  file: File | null
  urlInput: string
  storageFolder: string
  existingUrl: string | null
  removeMedia?: boolean
}

/** Pick a URL to store: new upload, new URL, keep existing, or clear. */
export async function resolveMediaUrlForSave(
  options: ResolveMediaOptions,
): Promise<string | null> {
  if (options.removeMedia) return null

  if (options.file) {
    return uploadPortfolioImage(options.file, options.storageFolder)
  }

  const trimmed = options.urlInput.trim()
  if (trimmed && isPersistableMediaUrl(trimmed)) {
    return trimmed
  }

  if (isPersistableMediaUrl(options.existingUrl)) {
    return options.existingUrl
  }

  return null
}
