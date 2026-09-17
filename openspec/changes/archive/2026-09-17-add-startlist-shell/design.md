## Context

Repo is effectively greenfield for application code: tracked files are OpenSpec scaffolding, `AGENTS.md`, and ignore rules. Leftover local `node_modules` (Next.js 15, Vitest, Testing Library) and `.next` indicate a prior Next.js attempt was wiped from source. Canonical club wordmark lives at sibling path `../dl-mvp/images/dsd-logo.png` and must be copied into this repo as `images/dsd-logo.png` (also served under `public/`). See proposal.md for motivation; this design covers how to stand up the shell only.

## Goals / Non-Goals

**Goals:**
- Boot a runnable local TypeScript app with shared layout chrome.
- Encode club look as CSS variables + webfonts + DSD wordmark.
- Keep structure ready for later routes without building those features.

**Non-Goals:**
- Persistence, SQLite, seed data, calendars, start lists, Startgeld, auth, hosting (see proposal out of scope).
- Pixel-perfect recreation of an external club marketing site beyond the tokens and wordmark given.

## Decisions

### 1. Next.js App Router + TypeScript strict
- **Choice**: Scaffold a Next.js App Router app in the repo root with `strict` TypeScript.
- **Why**: Matches leftover toolchain, AGENTS.md “local web app”, and keeps a single layout for sticky chrome.
- **Alternatives**: Vite SPA (fine for shell, weaker fit for later server/SQLite on disk); plain HTML (rejects TS/test conventions).

### 2. Shared root layout owns the sticky header
- **Choice**: One root (or app) layout renders brand, nav stubs, and account placeholder; page content is children that scroll under a `position: sticky` / fixed header with padding offset.
- **Why**: Spec requires one chrome reused on every page, not rebuilt per route.
- **Alternatives**: Per-page headers (rejected by requirement); client-only shell wrapper without layout (easy to forget on new routes).

### 3. Nav stubs: Home + Kalender + Startgeld
- **Choice**: Header primary nav lists Home (active), Kalender, and Startgeld. Non-home items may link to placeholder routes or `#` with clear stub treatment; they MUST NOT imply finished features.
- **Why**: Matches near-term product areas without inventing unrelated IA.
- **Alternatives**: Home-only nav (weaker “general navigation”); many fake links (noise).

### 4. Brand assets and tokens
- **Choice**: CSS variables `--accent #ff4801`, `--ink #1c1a14`, `--links #2c5e7a`, `--cream #f5f1e8`. Load Bricolage Grotesque and Lato (next/font or equivalent). Copy the DSD wordmark from `../dl-mvp/images/dsd-logo.png` to `images/dsd-logo.png` and expose it under `public/images/` for static serving.
- **Why**: User-supplied club look; avoids a made-up brand; asset already available in the sibling workshop.
- **Alternatives**: Invented palette/fonts (out of scope); remote-only logo URL (fragile offline).

### 5. Quality gate scripts from day one
- **Choice**: `package.json` scripts for lint, typecheck, and tests (Vitest + Testing Library against the shipped shell scenarios). Slice is done when all three pass.
- **Why**: AGENTS.md done criteria; leftover Vitest/Testing Library already in `node_modules`.
- **Alternatives**: Defer tests (rejected); Playwright-only (heavier for a static shell).

### 6. Empty home
- **Choice**: Single home route with a short title (“Startlist”), one empty-state sentence, and one accent-styled button linking to `https://rtcdsd.de/` (`target="_blank"` + `rel="noopener noreferrer"`); no cards, stats, or schedule chrome.
- **Why**: Spec asks for almost empty under the chrome, plus a path to the club site.
## Risks / Trade-offs

- [Missing in-repo wordmark] → Copy from `../dl-mvp/images/dsd-logo.png` into `images/` and `public/images/`; do not substitute a fake mark.
- [Stale `node_modules` / `.next`] → Prefer a clean scaffold with a fresh lockfile; remove or ignore stale build output so lint/typecheck/test run against new source.
- [Stub nav looks “broken”] → Use muted stub affordance or placeholder pages with the same layout so clicks stay inside the shell.
- [Fixed vs sticky header] → Prefer sticky with solid cream background so content clearly scrolls underneath without covering interactive controls.

## Migration Plan

1. Scaffold app and scripts in-repo (no production deploy).
2. Add layout, tokens, fonts, wordmark, empty home.
3. Verify `lint`, `typecheck`, and `test` pass locally.
4. Rollback = delete the change’s source additions; OpenSpec artifacts remain until archive.

## Open Questions

- Exact German copy for the empty state (assume short English or “Noch keine Rennen” — confirm during apply if needed).
- Whether Kalender/Startgeld stubs should be inert buttons vs placeholder routes (either satisfies the spec; prefer placeholder routes under the shared layout).
