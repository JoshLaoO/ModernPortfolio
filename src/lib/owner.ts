/** UUID from Auth → must match RLS `auth.uid()` check and your Supabase user id. */
export function getPortfolioOwnerId(): string | null {
  const id = import.meta.env.VITE_PORTFOLIO_OWNER_ID?.trim()
  return id || null
}

export function isPortfolioOwner(
  user: { id: string } | null | undefined,
): boolean {
  const ownerId = getPortfolioOwnerId()
  if (!ownerId || !user) return false
  return user.id === ownerId
}
