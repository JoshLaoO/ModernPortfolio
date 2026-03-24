# ModernPortfolio — front-end prototype

This document describes the portfolio UI, data model, and how it evolved from the initial Vite starter.

## Stack

- **React 19** + **TypeScript**
- **Vite 8** for dev server and production builds
- Styling: component-scoped rules in `src/App.css`, global tokens in `src/index.css` (light/dark via `prefers-color-scheme`)

## Page structure

| Section        | Anchor        | Purpose |
|----------------|---------------|---------|
| Hero           | `#top`        | Intro and primary CTA to projects |
| Projects       | `#projects`   | Paid or personal work |
| Volunteer      | `#volunteer`  | Community / nonprofit-style entries (same card fields as projects) |
| Add an entry   | `#add-entry`  | Form to append rows in memory (prototype only) |
| About          | `#about`      | General bio, separate from project lists |
| Contact        | `#contact`    | Footer contact block |

Primary navigation lives in `src/components/SiteHeader.tsx`.

## Data model

Each row is a `PortfolioEntry` (`src/data/portfolio.ts`):

| Field        | Type              | Notes |
|--------------|-------------------|--------|
| `id`         | `string`          | Stable id; new rows use `crypto.randomUUID()` when available |
| `name`       | `string`          | Display title |
| `startDate`  | `string`          | `YYYY-MM` from `<input type="month">` |
| `endDate`    | `string \| null`  | Same format, or `null` for ongoing / omitted |
| `description`| `string`          | Body copy on the card |
| `githubLink` | `string`          | Shown as a “GitHub” link when non-empty; URLs without a scheme get `https://` (see `src/lib/url.ts`) |
| `mediaUrl`   | `string \| null`  | Image URL; uploads use `URL.createObjectURL` in the browser |
| `mediaAlt`   | `string` (optional) | Passed to `<img alt>` when set |

Seed content: `initialProjects` and `initialVolunteer` in the same file.

## Add-entry form

`src/components/AddEntryForm.tsx` collects:

1. **Section** — radio: append to Projects or Volunteer  
2. **Name**  
3. **Start date** / **End date** — month inputs; **Ongoing** disables end date and stores `endDate: null`  
4. **Description**  
5. **GitHub link**  
6. **Media** — optional image file  

Validation (client-side): name and start date required; end date must not be before start when both are set.

**Limitation:** submissions only update React state. A refresh clears user-added rows unless you add persistence (API, localStorage, etc.).

## UI building blocks

- `EntryListSection` — section heading + grid or empty state  
- `EntryCard` — date range (via `src/lib/dates.ts`), description, optional GitHub link, optional image  
- `App.tsx` — holds `projects` and `volunteer` state and `handleAdd`

## Scripts

```bash
npm run dev      # local development
npm run build    # typecheck + production bundle
npm run preview  # serve the built app
npm run lint     # ESLint
```

## Change history (high level)

1. **Initial prototype** — Replaced the default Vite demo with a portfolio layout: hero, project-style cards, about, footer.  
2. **Projects / Volunteer / About** — Split lists into two sections sharing one entry type; added the add-entry form with the fields above; removed the older multi-field card (tagline, contributions list, stack tags) in favor of the simpler column set.  
3. **Documentation** — Added this file and committed the project to version control.

When you add a backend, you can map `PortfolioEntry` (plus a `kind: 'project' | 'volunteer'` or separate tables) directly to your API payloads.
