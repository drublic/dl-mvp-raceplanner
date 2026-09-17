## Why

The club still runs the season in Excel. Before calendars, start lists, or login, riders and admins need a local Startlist app that looks like the club and has a stable chrome every later page can sit under. Shipping the shell first lets us lock brand and layout without inventing domain features yet.

## What Changes

- Scaffold a local TypeScript web app (Next.js App Router) that runs on disk and survives refresh for later data work.
- Add a single sticky app header shared across routes: DSD wordmark, primary navigation (stubs allowed), and an account placeholder.
- Apply club look: DSD wordmark from `images/dsd-logo.png`, Bricolage Grotesque headings, Lato body, and the club colour tokens (accent, ink, links, cream).
- Ship a minimal home/empty content area under the chrome (title or short empty state only).
- On the empty home, include a button that opens the club site at `https://rtcdsd.de/`.
- Add lint, typecheck, and test scripts; cover the shell scenarios from the spec.

## Capabilities

### New Capabilities

- `app-shell`: Sticky club chrome (brand, nav stubs, account placeholder) and a minimal empty home under it; no race or auth behaviour.

### Modified Capabilities

- (none — greenfield; `openspec/specs/` has no capabilities yet)

## Impact

- New app scaffold (`package.json`, Next.js app routes, styles, public/static assets). Copy DSD wordmark from `../dl-mvp/images/dsd-logo.png` into `images/dsd-logo.png` and serve via `public/`.
- No SQLite, seed data, calendars, start lists, Startgeld, or real auth in this change.
- Leftover `node_modules` / `.next` from earlier local work may be reused or reset when scaffolding.
- Follow-on change (see `startlist-slice.md` / next slices) will fill calendar and start-list behaviour under this chrome.
