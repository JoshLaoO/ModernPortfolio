export type PortfolioEntry = {
  id: string
  name: string
  /** `YYYY-MM` from `<input type="month">` */
  startDate: string
  /** `YYYY-MM` or null when ongoing / not set */
  endDate: string | null
  description: string
  githubLink: string
  /** Local object URL or remote image URL for seeded entries */
  mediaUrl: string | null
  /** Hint for alt text when media is decorative + name is primary */
  mediaAlt?: string
}

export const initialProjects: PortfolioEntry[] = [
  {
    id: 'seed-design-system',
    name: 'Acme design system',
    startDate: '2023-01',
    endDate: '2024-06',
    description:
      'Shared UI tokens and components for product teams. Focus on accessibility, theming, and adoption across surfaces.',
    githubLink: 'https://github.com',
    mediaUrl: null,
  },
  {
    id: 'seed-ops-dashboard',
    name: 'Operations dashboard',
    startDate: '2022-04',
    endDate: '2023-11',
    description:
      'Internal dashboard for queues and SLAs. Led complex filter UI, charts, and CSV export with tight performance budgets.',
    githubLink: '',
    mediaUrl: null,
  },
  {
    id: 'seed-checkout',
    name: 'Checkout modernization',
    startDate: '2023-03',
    endDate: null,
    description:
      'Guest checkout refresh: validation, payments UX, and analytics. Collaborated on experiments and error handling from gateway responses.',
    githubLink: 'https://github.com',
    mediaUrl: null,
  },
]

export const initialVolunteer: PortfolioEntry[] = [
  {
    id: 'seed-open-source',
    name: 'Open-source docs nights',
    startDate: '2021-09',
    endDate: null,
    description:
      'Monthly sessions improving READMEs and onboarding for small OSS projects. Reviewed PRs and paired with first-time contributors.',
    githubLink: 'https://github.com',
    mediaUrl: null,
  },
  {
    id: 'seed-community-bridge',
    name: 'Community bridge program',
    startDate: '2020-01',
    endDate: '2022-12',
    description:
      'Mentoring and light technical support for a local nonprofit. Built a simple static site and trained staff on updates.',
    githubLink: '',
    mediaUrl: null,
  },
]
