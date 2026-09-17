## 1. Project scaffold

- [x] 1.1 Create `package.json` with Next.js App Router, React, TypeScript strict, and scripts `dev`, `build`, `lint`, `typecheck`, and `test`; verify `npm install` succeeds and produces a lockfile
- [x] 1.2 Add `tsconfig.json` (`strict: true`), Next/ESLint/Vitest config, and keep `.gitignore` covering `node_modules`, `.next`, and coverage; verify `npm run typecheck` is runnable once sources exist
- [x] 1.3 Copy club wordmark from `../dl-mvp/images/dsd-logo.png` to `images/dsd-logo.png` and `public/images/dsd-logo.png`; verify both files exist and are non-empty

## 2. App shell chrome

- [x] 2.1 Add App Router root layout that renders a sticky header (brand, primary nav, account) wrapping `{children}` with cream page background and ink text; verify the home route renders inside that shared layout
- [x] 2.2 Wire DSD wordmark in the header from the public asset, load Bricolage Grotesque (headings) and Lato (body), and define CSS variables for accent `#ff4801`, ink `#1c1a14`, links `#2c5e7a`, cream `#f5f1e8`; verify fonts and colours apply on the home page
- [x] 2.3 Add primary nav stubs Home, Kalender, and Startgeld (Home active; others as placeholder routes under the same layout) plus an account placeholder that does not require real login; verify all three regions are present in the header
- [x] 2.4 Implement a minimal home page with title “Startlist”, a short empty-state line, and a button that opens `https://rtcdsd.de/` (no calendar/start-list UI); verify the page shows header + empty content and the club-site button with the correct href

## 3. Spec coverage and quality gate

- [x] 3.1 Add tests for sticky shared header (brand, nav stubs, account placeholder), club look signals (wordmark present, cream/ink usage), empty home (no calendar/start-list content), and the club-site button href `https://rtcdsd.de/`; verify `npm test` passes
- [x] 3.2 Run `npm run lint`, `npm run typecheck`, and `npm test` together and verify all three succeed
- [x] 3.3 Start the app with `npm run dev` and verify the home URL loads the shell in a browser (or equivalent local request)
