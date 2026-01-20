# Spec: Settings

## ADDED Requirements

### REQ-SET-001: Settings Screen Layout
The Settings tab shall display grouped configuration options.

#### Scenario: View Settings Screen
- **Given** the app is open
- **When** the Settings tab is selected
- **Then** settings are displayed in grouped sections
- **And** each section has a header

#### Scenario: Settings Sections
- **Given** the Settings screen is displayed
- **When** viewing the screen
- **Then** the following sections are visible:
  - Appearance
  - Defaults
  - Preferences
  - Data
  - About

---

### REQ-SET-002: Theme Selection
The app shall allow users to select a theme.

#### Scenario: Theme Options
- **Given** the user is in Appearance section
- **When** tapping theme option
- **Then** options are presented: Light, Dark, System

#### Scenario: Select Light Theme
- **Given** theme picker is open
- **When** user selects Light
- **Then** the app switches to light theme immediately
- **And** the preference is saved

#### Scenario: Select Dark Theme
- **Given** theme picker is open
- **When** user selects Dark
- **Then** the app switches to dark theme immediately
- **And** the preference is saved

#### Scenario: Select System Theme
- **Given** theme picker is open
- **When** user selects System
- **Then** the app follows device theme setting
- **And** the preference is saved

---

### REQ-SET-003: Default Account Selection
The app shall allow setting a default account.

#### Scenario: Select Default Account
- **Given** accounts exist
- **When** user taps default account setting
- **Then** a list of accounts is shown

#### Scenario: Set Default
- **Given** account list is shown
- **When** user selects an account
- **Then** it becomes the default account
- **And** new transactions pre-select this account

---

### REQ-SET-004: Base Currency Setting
The app shall allow setting a base currency.

#### Scenario: Select Base Currency
- **Given** user is in Defaults section
- **When** user taps currency setting
- **Then** currency picker is displayed

#### Scenario: Change Currency
- **Given** currency picker is open
- **When** user selects a currency
- **Then** base currency is updated
- **And** analytics show totals in base currency

---

### REQ-SET-005: Date Format Preferences
The app shall allow customizing date display.

#### Scenario: Date Format Options
- **Given** user is in Preferences section
- **When** viewing date format setting
- **Then** options include: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD

#### Scenario: Change Date Format
- **Given** date format picker is open
- **When** user selects a format
- **Then** all dates in app use new format

---

### REQ-SET-006: First Day of Week
The app shall allow setting the first day of the week.

#### Scenario: Week Start Options
- **Given** user is in Preferences section
- **When** viewing first day setting
- **Then** options are: Sunday, Monday

#### Scenario: Set First Day
- **Given** first day picker is open
- **When** user selects Monday
- **Then** weekly stats start from Monday

---

### REQ-SET-007: Data Management Options
The Settings screen shall provide data management options.

#### Scenario: Data Section Display
- **Given** the Settings screen is open
- **When** viewing Data section
- **Then** the following options are visible:
  - Backup Data
  - Export Data
  - Reset All Data

#### Scenario: Reset Data Confirmation
- **Given** user taps Reset All Data
- **When** the action is initiated
- **Then** a confirmation dialog appears
- **And** warns about permanent data loss

#### Scenario: Confirm Reset
- **Given** reset confirmation is shown
- **When** user confirms reset
- **Then** all transactions are deleted
- **And** all accounts are deleted
- **And** default categories are restored
- **And** settings are reset to defaults

---

### REQ-SET-008: About Section
The Settings screen shall show app information.

#### Scenario: View About Info
- **Given** the Settings screen is open
- **When** viewing About section
- **Then** app version is displayed
- **And** app name is shown

---

### REQ-SET-009: Settings Persistence
All settings shall persist across app restarts.

#### Scenario: Settings Saved
- **Given** user changes a setting
- **When** the app is closed and reopened
- **Then** the setting value is preserved

#### Scenario: Settings Storage
- **Given** settings are changed
- **When** values are saved
- **Then** they are stored in SQLite database

