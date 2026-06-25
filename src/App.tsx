import { useCallback } from 'react'
import { AddEntryForm } from './components/AddEntryForm'
import { AboutSection } from './components/AboutSection'
import { EntryListSection } from './components/EntryListSection'
import { HeroSection } from './components/HeroSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import type { PortfolioEntry } from './data/portfolio'
import { useAuthSession } from './hooks/useAuthSession'
import { usePortfolioFromSupabase } from './hooks/usePortfolioFromSupabase'
import {
  deletePortfolioEntry,
  insertPortfolioEntry,
  updatePortfolioEntry,
} from './lib/portfolioSupabase'
import { getPortfolioOwnerId, isPortfolioOwner } from './lib/owner'
import './App.css'

function App() {
  const { user } = useAuthSession()
  const canAddEntries = isPortfolioOwner(user)
  const ownerIdConfigured = Boolean(getPortfolioOwnerId())

  const {
    projects,
    setProjects,
    volunteer,
    setVolunteer,
    loading,
    loadError,
  } = usePortfolioFromSupabase()

  const handleAdd = useCallback(
    async (kind: 'project' | 'volunteer', entry: Omit<PortfolioEntry, 'id'>) => {
      const saved = await insertPortfolioEntry(kind, entry)
      if (kind === 'project') {
        setProjects((prev) => [saved, ...prev])
      } else {
        setVolunteer((prev) => [saved, ...prev])
      }
    },
    [setProjects, setVolunteer],
  )

  const handleDeleteEntry = useCallback(
    async (id: string) => {
      await deletePortfolioEntry(id)
      setProjects((prev) => prev.filter((e) => e.id !== id))
      setVolunteer((prev) => prev.filter((e) => e.id !== id))
    },
    [setProjects, setVolunteer],
  )

  const handleUpdateEntry = useCallback(
    async (id: string, entry: Omit<PortfolioEntry, 'id'>) => {
      const updated = await updatePortfolioEntry(id, entry)
      const applyUpdate = (prev: PortfolioEntry[]) =>
        prev.map((e) => (e.id === id ? updated : e))
      setProjects(applyUpdate)
      setVolunteer(applyUpdate)
    },
    [setProjects, setVolunteer],
  )

  return (
    <div className="app">
      <SiteHeader />
      <main>
        <HeroSection />
        {loading ? (
          <p className="data-banner data-banner--loading" role="status">
            Loading entries from Supabase…
          </p>
        ) : null}
        {loadError ? (
          <p className="data-banner data-banner--error" role="alert">
            Could not load from Supabase ({loadError}). Showing sample data from{' '}
            <code>src/data/portfolio.ts</code> until the request succeeds.
          </p>
        ) : null}
        <EntryListSection
          id="projects"
          title="Projects"
          subtitle="Rows load from the portfolio_entries table (kind = project). New entries from the form are saved to Supabase."
          entries={projects}
          emptyLabel="No projects yet. Add one with the form below or in the Supabase table editor."
          canManageEntries={canAddEntries}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
        />
        <EntryListSection
          id="volunteer"
          title="Volunteer"
          subtitle="Same table with kind = volunteer."
          entries={volunteer}
          emptyLabel="No volunteer entries yet. Add one with the form below or in the Supabase table editor."
          canManageEntries={canAddEntries}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
        />
        {canAddEntries ? (
          <AddEntryForm onAdd={handleAdd} />
        ) : (
          <section className="add-entry-section" id="add-entry" aria-labelledby="add-entry-locked-heading">
            <div className="section-heading">
              <h2 id="add-entry-locked-heading">Add an entry</h2>
              <p className="section-subtitle">
                Adding entries is limited to the portfolio owner. Use the magic link
                in the header with your email, then ensure{' '}
                <code>VITE_PORTFOLIO_OWNER_ID</code> in <code>.env.local</code> matches
                your Supabase user id (shown after sign-in). Replace the old open{' '}
                <code>INSERT</code> policy with an owner-only policy (see{' '}
                <code>supabase/owner-insert-policy.sql</code>).
              </p>
            </div>
            {!ownerIdConfigured && user ? (
              <p className="add-entry-locked-note">
                Your user id: <code>{user.id}</code> — add{' '}
                <code>VITE_PORTFOLIO_OWNER_ID={user.id}</code> to <code>.env.local</code>{' '}
                and restart <code>npm run dev</code>.
              </p>
            ) : null}
          </section>
        )}
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
