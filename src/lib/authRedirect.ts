/** Where Supabase should send users after magic-link sign-in. */
export function getAuthRedirectUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
  if (configured) return configured
  return `${window.location.origin}${window.location.pathname}`
}
