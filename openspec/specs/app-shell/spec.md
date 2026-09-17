# app-shell Specification

## Purpose

Provides the Startlist app chrome with club branding and a sticky shared header so later race features land in a consistent shell.

## Requirements

### Requirement: Sticky club header on every page
The system SHALL show a sticky header on every page that remains visible while main content scrolls underneath. The header MUST include the DSD wordmark, primary navigation, and an account area. The same header chrome MUST be reused across pages; pages MUST NOT introduce a separate page-local header that replaces it.

#### Scenario: Header stays visible while scrolling
- **WHEN** a user opens the home page and scrolls the main content
- **THEN** the sticky header remains visible and content scrolls under it

#### Scenario: Header is shared, not rebuilt per page
- **WHEN** a user navigates between routes that use the app layout
- **THEN** they see the same header structure (brand, primary navigation, account area) rather than a different header rebuilt for that page

### Requirement: DSD brand and club look
The system SHALL present the club brand using the DSD wordmark image and club typography and colours. Headings MUST use Bricolage Grotesque. Body text MUST use Lato. The UI MUST apply the club colour tokens: accent `#ff4801`, ink `#1c1a14`, links `#2c5e7a`, cream `#f5f1e8`.

#### Scenario: Wordmark is visible in the header
- **WHEN** a user views any page using the app shell
- **THEN** the DSD wordmark is visible in the header

#### Scenario: Club colours and fonts are applied
- **WHEN** a user views the home page
- **THEN** the page uses cream background and ink text tones with Bricolage Grotesque for headings and Lato for body text, and interactive link styling uses the club link colour

### Requirement: Primary navigation stubs
The system SHALL expose primary navigation places in the sticky header. Navigation entries that are not yet implemented MUST still be present as stubs (visible links or controls that do not open a finished feature).

#### Scenario: Navigation entries are present
- **WHEN** a user views the sticky header
- **THEN** primary navigation entries are shown in the header alongside brand and account

### Requirement: Account placeholder
The system SHALL reserve space in the sticky header for who is signed in and account actions. Until real login exists, the account area MAY show a non-functional placeholder. The system MUST NOT claim a real authenticated session in this change.

#### Scenario: Account area is visible without real login
- **WHEN** a user views the sticky header
- **THEN** an account placeholder is visible and no real sign-in or session is required to use the shell

### Requirement: Minimal empty home under the chrome
The system SHALL provide a home content area under the header that is intentionally sparse: a title and/or short empty-state copy, plus a single button that opens the club website at `https://rtcdsd.de/`. The home content MUST NOT include a race calendar, start lists, rider management, or Startgeld UI.

#### Scenario: Home shows empty state only
- **WHEN** a user opens the application home
- **THEN** they see the sticky header and a minimal title or empty-state message with no calendar or start-list content

#### Scenario: Home links to the club website
- **WHEN** a user opens the application home
- **THEN** they see a button that opens `https://rtcdsd.de/`

### Requirement: Kalender navigation opens the calendar
The system SHALL treat Kalender in the sticky header as a working primary destination. Choosing Kalender MUST open the race calendar at `/calendar`. Kalender MUST NOT be marked or behaved as an unimplemented feature stub. Unimplemented entries such as Startgeld MAY remain stubs at `/start-fee`.

#### Scenario: Kalender opens the calendar
- **WHEN** a user chooses Kalender in the sticky header
- **THEN** they reach the race calendar at `/calendar` rather than a placeholder-only stub page

#### Scenario: Startgeld remains a stub
- **WHEN** a user views the sticky header
- **THEN** Startgeld is still present as a stub destination at `/start-fee`
