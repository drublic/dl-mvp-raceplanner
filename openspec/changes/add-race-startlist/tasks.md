## 1. Persistence and seed

- [x] 1.1 Add SQLite dependency (prefer `better-sqlite3`) and a DB module that opens a gitignored file under `data/`; verify `npm install` succeeds and typecheck still runs
- [x] 1.2 Create schema for categories, races (name, weekday, date, Meldeschluss, cancelled flag), and start-list rider names; verify empty DB initializes without error
- [x] 1.3 Vendor season seed under `data/seed/` (copy from `race-planner-season-example.xlsx` or CSV) and implement first-boot seed for Amateure, Elite-Amateure, and Frauen; verify Amateur "Rund um Merken" has 6 riders and "Rund in Rheinbach" is cancelled

## 2. Calendar and navigation

- [x] 2.1 Rename German stub routes to English (`/kalender` → `/calendar`, `/startgeld` → `/start-fee`), replace `/calendar` with a three-category calendar showing name, weekday, date, Meldeschluss (deadline text, not entry-form link), derived participant count, and cancelled state; verify Amateure lists Merken on 29.03. with count 6 and cancelled Rheinbach stays visible
- [x] 2.2 Add race detail route under `/calendar` so opening a race shows that category’s start list; verify opening Amateur Merken shows the six seeded names
- [x] 2.3 Point Kalender nav to `/calendar` as a real item (`stub: false`) and Startgeld to `/start-fee` as a stub; verify header Kalender opens the calendar and Startgeld remains `data-stub="true"`

## 3. Start-list mutations

- [x] 3.1 Implement add-rider (by name) for non-cancelled races with count derived from names; verify adding "Leo K." to Amateur Merken yields count 7 and the name on the list
- [x] 3.2 Implement remove-rider for non-cancelled races; verify removing a seeded rider drops count by one and removes the name
- [x] 3.3 Reject add/remove on cancelled races in the server path and disable/clearly label cancelled UI; verify adding "Jonas B." to Rheinbach leaves the list unchanged and cancelled status is obvious
- [x] 3.4 Confirm SQLite persistence across process/page refresh for an added rider; verify Leo K. remains after reload

## 4. Tests and quality gate

- [x] 4.1 Add tests covering "Add a rider to an existing race" and "Cancelled race rejects adds" from the start-list spec; verify they pass via `npm test`
- [x] 4.2 Update shell/nav tests for Kalender no longer being a stub; verify `npm test` still passes for app-shell scenarios
- [x] 4.3 Run `npm run lint`, `npm run typecheck`, and `npm test` and fix until all three pass
