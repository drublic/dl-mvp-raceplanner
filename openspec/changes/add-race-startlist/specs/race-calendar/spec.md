## Purpose

Season race calendars for Amateure, Elite-Amateure, and Frauen so riders can see which races exist, when they run, and when Meldeschluss is.

## ADDED Requirements

### Requirement: Three category calendars
The system SHALL present a season calendar for each of the three categories: Amateure, Elite-Amateure, and Frauen. The user MUST be able to view all three categories without being limited to a single category.

#### Scenario: All three categories are available
- **WHEN** a user opens the calendar
- **THEN** they can switch between or otherwise reach Amateure, Elite-Amateure, and Frauen calendars

### Requirement: Race metadata on the calendar
Each race on a calendar MUST show its name, weekday, date, and Meldeschluss. Meldeschluss MUST be treated as an entry deadline, not as a link to an entry form. The participant count shown for a race MUST equal the number of rider names on that race’s start list.

#### Scenario: Amateur Rund um Merken shows seeded metadata
- **WHEN** a user views the Amateure calendar
- **THEN** they see "Rund um Merken" on 29.03. with weekday, Meldeschluss, and a participant count of 6 matching the seeded start list

### Requirement: Cancelled races remain listed
Cancelled races MUST remain visible on the calendar for their category. The system MUST make the cancelled status obvious on the calendar listing.

#### Scenario: Cancelled Rheinbach stays on Amateure calendar
- **WHEN** a user views the Amateure calendar
- **THEN** "Rund in Rheinbach" appears as cancelled and remains on the list

### Requirement: Open a race from the calendar
The system SHALL let a user open a race from the calendar to view that race’s start list for the selected category.

#### Scenario: Open Rund um Merken from Amateure
- **WHEN** a user opens "Rund um Merken" from the Amateure calendar
- **THEN** they see the start list for that race in Amateure
