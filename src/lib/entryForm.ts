export function validateEntryDates(
  startDate: string,
  endDate: string,
  ongoing: boolean,
): string | null {
  if (!startDate) return 'Add a start date (month).'
  if (!ongoing && endDate && endDate < startDate) {
    return 'End date must be the same as or after the start date.'
  }
  return null
}

export function isPersistableMediaUrl(url: string | null | undefined): url is string {
  if (!url?.trim()) return false
  return !url.startsWith('blob:')
}
