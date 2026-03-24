import { useCallback, useState } from 'react'
import { AddEntryForm } from './components/AddEntryForm'
import { AboutSection } from './components/AboutSection'
import { EntryListSection } from './components/EntryListSection'
import { HeroSection } from './components/HeroSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import {
  initialProjects,
  initialVolunteer,
  type PortfolioEntry,
} from './data/portfolio'
import './App.css'

function App() {
  const [projects, setProjects] = useState<PortfolioEntry[]>(initialProjects)
  const [volunteer, setVolunteer] = useState<PortfolioEntry[]>(initialVolunteer)

  const handleAdd = useCallback(
    (kind: 'project' | 'volunteer', entry: Omit<PortfolioEntry, 'id'>) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `local-${Date.now()}`
      const next: PortfolioEntry = { ...entry, id }
      if (kind === 'project') {
        setProjects((prev) => [next, ...prev])
      } else {
        setVolunteer((prev) => [next, ...prev])
      }
    },
    [],
  )

  return (
    <div className="app">
      <SiteHeader />
      <main>
        <HeroSection />
        <EntryListSection
          id="projects"
          title="Projects"
          subtitle="Professional or personal work. Seed data lives in src/data/portfolio.ts."
          entries={projects}
          emptyLabel="No projects yet. Add one with the form below or edit the seed file."
        />
        <EntryListSection
          id="volunteer"
          title="Volunteer"
          subtitle="Community, nonprofit, or side-of-desk contributions—same card fields as projects."
          entries={volunteer}
          emptyLabel="No volunteer entries yet. Add one with the form below or edit the seed file."
        />
        <AddEntryForm onAdd={handleAdd} />
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
