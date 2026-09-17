## Purpose

Per-race start lists of rider names that can be edited for open races, locked for cancelled races, and kept on disk across refresh.

## ADDED Requirements

### Requirement: Start list is names on the race
The start list for a race in a category SHALL be the ordered set of rider names on that race. A rider is identified by name only. The system MUST NOT require interested / registered / DNS (or similar) status fields. The participant count MUST be derived solely from how many names are on the list.

#### Scenario: Seeded Merken list shows six names
- **WHEN** a user opens Amateur "Rund um Merken"
- **THEN** the start list shows the six seeded rider names and the participant count is 6

### Requirement: Add a rider to an open race
For a race that is not cancelled, the system SHALL allow adding a rider by name. After a successful add, the name MUST appear on the start list and the participant count MUST increase by one.

#### Scenario: Add a rider to an existing race
- **WHEN** the Amateur calendar includes "Rund um Merken" on 29.03. and the start list has 6 riders
- **AND** the user adds "Leo K." to that race
- **THEN** "Leo K." appears on the start list
- **AND** the participant count is 7

### Requirement: Remove a rider from an open race
For a race that is not cancelled, the system SHALL allow removing a rider by name. After a successful remove, the name MUST no longer appear on the start list and the participant count MUST decrease by one.

#### Scenario: Remove a rider from an open race
- **WHEN** a user removes an existing rider from Amateur "Rund um Merken"
- **THEN** that name is no longer on the start list
- **AND** the participant count decreases by one

### Requirement: Cancelled race rejects start-list changes
When a race is cancelled, the system MUST reject adding or removing riders. The start list MUST remain unchanged, and the UI MUST make it obvious that the race is cancelled.

#### Scenario: Cancelled race rejects adds
- **WHEN** "Rund in Rheinbach — cancelled" is on the calendar
- **AND** the user attempts to add "Jonas B." to that race
- **THEN** the start list does not change
- **AND** the app shows that the race is cancelled

### Requirement: Start lists persist across refresh
The system SHALL store races and start lists on the local machine in SQLite so that a browser refresh keeps the data. The system MUST NOT sync to Google Sheets.

#### Scenario: Added rider survives refresh
- **WHEN** a user adds "Leo K." to Amateur "Rund um Merken" and then refreshes the application
- **THEN** "Leo K." is still on that start list and the participant count remains 7
