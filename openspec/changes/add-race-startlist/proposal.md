## Why

The club still plans who rides which race in Excel. The Startlist shell already has the club look; this change replaces the season sheet’s core job: a three-category calendar, per-race start lists of names, and edits that survive refresh on the machine.

## What Changes

- Persist season data locally with SQLite (races, categories, rider names on each race).
- Seed from `race-planner-season-example.xlsx` so Amateure, Elite-Amateure, and Frauen calendars match the sheet (including Amateur *Rund um Merken* with 6 riders and *Rund in Rheinbach* cancelled).
- Replace the `/calendar` placeholder with a calendar for all three categories showing race name, weekday, date, Meldeschluss (deadline only), participant count, and cancelled state.
- Open a race to see its start list; add or remove a rider by name; participant count equals the number of names and updates with edits.
- Keep cancelled races listed but reject add/remove; make cancelled status obvious in the UI.
- Keep the existing sticky header and club brand; rename routes to English (`/calendar`, `/start-fee`); wire Kalender as a real nav destination (Startgeld stays a stub).
- Cover the shipped scenarios with lint, typecheck, and tests.

## Capabilities

### New Capabilities

- `race-calendar`: Season calendar for Amateure, Elite-Amateure, and Frauen with race metadata (name, weekday, date, Meldeschluss), participant counts, and cancelled races that remain visible.
- `start-list`: Per-race start list of rider names; add/remove for open races; immutable lists for cancelled races; counts derived from names; durable SQLite persistence across refresh.

### Modified Capabilities

- `app-shell`: Kalender primary nav becomes a working destination at `/calendar` (no longer a feature stub). Home remains the minimal empty state; calendar and start-list UI live under `/calendar`, not home. Startgeld stub moves to `/start-fee`.

## Impact

- Next.js app: rename stub folders/routes to English, implement `/calendar` (and race detail UI under it); keep layout/`AppHeader` brand and sticky chrome.
- New SQLite persistence layer, seed from the example season sheet (copy or path from workshop examples), likely new deps (e.g. `better-sqlite3` or equivalent).
- Tests for add-rider and cancelled-race scenarios; extend/adjust shell tests if Kalender stub markers change.
- Out of scope: Startgeld, club login, hosting, entry-form URLs, Stichtage UI, live rad-net fetch polish, CI test suite expansion beyond local scripts.
