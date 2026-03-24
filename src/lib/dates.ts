/** Format `YYYY-MM` (from month inputs) for display. */
export function formatMonth(isoMonth: string): string {
  const [y, m] = isoMonth.split('-').map(Number)
  if (!y || !m) return isoMonth
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
): string {
  if (!startDate) return ''
  const start = formatMonth(startDate)
  const end = endDate ? formatMonth(endDate) : 'Present'
  return `${start} – ${end}`
}
