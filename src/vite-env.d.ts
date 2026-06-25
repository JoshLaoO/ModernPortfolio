/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Supabase Auth user UUID — must match RLS insert policy for portfolio owner */
  readonly VITE_PORTFOLIO_OWNER_ID?: string
  /** Production site URL for magic-link redirects (e.g. https://joshglao.com) */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
