## Context

The app shell (`add-startlist-shell`) is already shipping: Next.js App Router, sticky `AppHeader`, club fonts/colours, stub calendar and start-fee routes (today still at German paths `/kalender` and `/startgeld`), empty home. See proposal.md for why this slice exists. This change renames those routes to English paths.

Season truth today lives in `../dl-mvp/examples/race-planner-season-example.xlsx` (sheets Amateure, Elite-Amateure, Frauen). Workshop brief and acceptance scenarios are in `../dl-mvp/examples/startlist-slice.md` and `startlist-slice1-scenarios.md`. AGENTS.md names this change `add-race-startlist` and requires SQLite on disk, TypeScript `strict`, and lint/typecheck/test via `package.json`.

Official catalogue is rad-net.de, but later work explicitly lists “rad-net polish”; this slice seeds from the example sheet so demo races and riders are reliable offline.

## Goals / Non-Goals

**Goals:**
- Local SQLite model for categories, races (incl. cancelled), and rider names on a race.
- Seed once from the example season workbook (or an equivalent CSV copy in-repo).
- Calendar UI for all three categories under `/calendar`; race detail with add/remove.
- Server-side mutations that refuse cancelled-race edits; UI that surfaces cancelled state.
- Tests for the Merken add and Rheinbach cancelled scenarios; keep shell look intact.

**Non-Goals:**
- Live rad-net HTTP import, entry-form URL fields, Stichtage UI, Startgeld, auth/login.
- Google Sheets sync, hosting/deploy, CI expansion beyond existing local scripts.
- Interested/registered/DNS statuses or a separate rider master directory.

## Decisions

1. **Persistence: `better-sqlite3` on disk**
   - Synchronous SQLite fits a local single-user Next.js server. Store the DB under a gitignored path (e.g. `data/startlist.sqlite`); `.gitignore` already ignores `*.sqlite` / `*.db`.
   - Alternative considered: `libsql`/`sql.js` — heavier or less natural for Node server routes. JSON file — weaker for concurrent writes and queries.

2. **Seed from the example sheet, not live rad-net**
   - Copy the workbook (or CSV export) into the repo under something like `data/seed/` and import on first boot if the DB is empty.
   - Detect cancelled races from the sheet naming (`— cancelled` / `cancelled` in the title) and store an explicit `cancelled` flag.
   - Participant count is never stored as source of truth: always `COUNT` of start-list names.
   - Alternative: scrape rad-net now — brittle for the workshop demo and listed as later polish.

3. **Routing: English paths; German nav labels**
   - Rename stub routes: `/kalender` → `/calendar`, `/startgeld` → `/start-fee` (App Router folders and `AppHeader` `href`s).
   - Replace the calendar stub with category tabs/sections and a race list at `/calendar`.
   - Race detail at `/calendar/[category]/[raceId]` (or similar) so open-race and cancelled-race flows have a stable URL.
   - Keep home empty per `app-shell` (calendar must not move to `/`).
   - Nav labels may stay German (Kalender, Startgeld); only URL/path segments are English.
   - Mark Kalender `stub: false` in `AppHeader`; leave Startgeld stubbed at `/start-fee`.

4. **Mutations via server actions or Route Handlers**
   - Prefer Next.js server actions (or thin POST handlers) that load SQLite, enforce cancelled lock, insert/delete rider name, return updated list + count.
   - Client UI: simple name field + list; disable add/remove controls when cancelled and show clear cancelled messaging.
   - Alternative: client-only localStorage — fails AGENTS.md persistence and multi-refresh reliability expectations for server-backed SQLite.

5. **Riders are plain names**
   - No rider table required beyond unique name strings on a race (duplicates on the same race: reject or no-op; pick one and test it — prefer reject duplicate name on same race).
   - Adding "Leo K." is typing a free-text name, matching Excel columns.

6. **Look**
   - Reuse existing CSS variables and sticky header; no new brand. Calendar/detail pages sit in `app-main` under the shared layout.

## Risks / Trade-offs

- **[Seed path drift]** Workshop xlsx lives outside this repo → Mitigation: vendor a seed copy under `data/seed/` so apply does not depend on `../dl-mvp`.
- **[Native module pain with `better-sqlite3`]** → Mitigation: document Node version; if install fails in the environment, fall back to a pure-JS SQLite option with the same schema.
- **[Cancelled detection from title]** Sheet uses title suffix → Mitigation: parse on seed into a boolean; UI reads the flag, not string matching at runtime.
- **[Home copy still says season is next]** → Mitigation: optional one-line home copy tweak is fine if it stays empty of calendar/start-list UI; not required for acceptance.

## Migration Plan

1. Add dependency + DB module + schema + seed.
2. Implement read APIs / calendar + detail UI.
3. Implement add/remove with cancelled guard.
4. Tests for Merken + Rheinbach; adjust shell test if Kalender stub attribute changes.
5. Run `lint`, `typecheck`, `test`. Delete local DB file to re-seed if needed during demo.

Rollback: remove the change branch / revert; delete the local SQLite file. No production deploy in this slice.

## Open Questions

None that block the specs or task breakdown. Meldeschluss year is implied by the season sheet (day/month display as in Excel); store as the sheet string or a date with assumed year 2026 — either is fine if the calendar shows `29.03.` consistently with the seed.
