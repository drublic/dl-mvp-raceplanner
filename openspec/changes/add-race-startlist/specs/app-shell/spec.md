## ADDED Requirements

### Requirement: Kalender navigation opens the calendar
The system SHALL treat Kalender in the sticky header as a working primary destination. Choosing Kalender MUST open the race calendar at `/calendar`. Kalender MUST NOT be marked or behaved as an unimplemented feature stub. Unimplemented entries such as Startgeld MAY remain stubs at `/start-fee`.

#### Scenario: Kalender opens the calendar
- **WHEN** a user chooses Kalender in the sticky header
- **THEN** they reach the race calendar at `/calendar` rather than a placeholder-only stub page

#### Scenario: Startgeld remains a stub
- **WHEN** a user views the sticky header
- **THEN** Startgeld is still present as a stub destination at `/start-fee`