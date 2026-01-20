# Spec: Data Management

## ADDED Requirements

### REQ-DM-001: Full Backup Creation
The app shall allow creating a full backup of all data.

#### Scenario: Initiate Backup
- **Given** the user is on backup screen
- **When** the user taps "Create Backup"
- **Then** backup process starts
- **And** progress indicator is shown

#### Scenario: Backup Contents
- **Given** a backup is created
- **When** the backup file is generated
- **Then** it contains:
  - All accounts
  - All transactions
  - All categories
  - All settings
  - All attachments (base64)
  - Backup version and timestamp

#### Scenario: Backup Format
- **Given** a backup is generated
- **When** the file is created
- **Then** it is a ZIP file
- **And** contains backup.json with all data

#### Scenario: Share Backup
- **Given** backup is created successfully
- **When** backup completes
- **Then** system share sheet opens
- **And** user can save or share the file

---

### REQ-DM-002: Restore from Backup
The app shall allow restoring from a backup file.

#### Scenario: Select Backup File
- **Given** user is on restore screen
- **When** user taps "Select Backup"
- **Then** file picker opens
- **And** user can select a ZIP file

#### Scenario: Backup Validation
- **Given** a backup file is selected
- **When** file is loaded
- **Then** backup version is checked
- **And** data integrity is validated
- **And** preview of data is shown

#### Scenario: Restore Confirmation
- **Given** a valid backup is selected
- **When** user sees backup preview
- **Then** a warning is shown that current data will be replaced
- **And** user must confirm to proceed

#### Scenario: Restore Process
- **Given** user confirms restore
- **When** restore begins
- **Then** existing data is cleared
- **And** backup data is inserted
- **And** progress is shown
- **And** success message on completion

#### Scenario: Restore Error
- **Given** backup file is corrupted
- **When** restore is attempted
- **Then** error message is shown
- **And** existing data is preserved

---

### REQ-DM-003: CSV Export
The app shall allow exporting transactions to CSV.

#### Scenario: Export Options
- **Given** user is on export screen
- **When** viewing export options
- **Then** CSV format is available
- **And** date range filter is available

#### Scenario: Generate CSV
- **Given** user initiates CSV export
- **When** export runs
- **Then** transactions are formatted as CSV
- **And** columns include: Date, Title, Type, Account, Category, Amount, Currency, Tags, Note

#### Scenario: Share CSV
- **Given** CSV is generated
- **When** export completes
- **Then** share sheet opens
- **And** user can save or share the file

---

### REQ-DM-004: CSV Import
The app shall allow importing transactions from CSV.

#### Scenario: Select CSV File
- **Given** user is on import screen
- **When** user taps "Select CSV"
- **Then** file picker opens for CSV files

#### Scenario: CSV Preview
- **Given** a CSV file is selected
- **When** file is parsed
- **Then** preview shows first few rows
- **And** number of transactions to import is shown
- **And** any errors are highlighted

#### Scenario: Import Validation
- **Given** CSV is parsed
- **When** validating rows
- **Then** required fields are checked (Date, Amount, Type)
- **And** categories are matched or created
- **And** accounts are matched or error shown

#### Scenario: Import Confirmation
- **Given** CSV is validated
- **When** user confirms import
- **Then** transactions are inserted
- **And** account balances are updated
- **And** success count is shown

#### Scenario: Import Errors
- **Given** some rows have errors
- **When** import completes
- **Then** error count is shown
- **And** details of failed rows available

---

### REQ-DM-005: Backup Metadata
Backup files shall include metadata for compatibility.

#### Scenario: Backup Version
- **Given** a backup is created
- **When** viewing backup.json
- **Then** version field is present (e.g., "1.0")

#### Scenario: Timestamp
- **Given** a backup is created
- **When** viewing backup.json
- **Then** exported_at timestamp is present (ISO format)

#### Scenario: Version Compatibility
- **Given** restoring a backup
- **When** backup version is checked
- **Then** older versions are supported with migration
- **And** incompatible versions show error

---

### REQ-DM-006: Backup Screen UI
The backup screen shall provide clear options and status.

#### Scenario: Last Backup Info
- **Given** the user opens backup screen
- **When** viewing the screen
- **Then** last backup date is shown (if exists)
- **And** "Never" shown if no backups made

#### Scenario: Backup Progress
- **Given** backup is in progress
- **When** viewing the screen
- **Then** progress bar or spinner is shown
- **And** current step is indicated

---

### REQ-DM-007: Export Date Range
CSV export shall support filtering by date range.

#### Scenario: Select Date Range
- **Given** user is on export screen
- **When** selecting date range
- **Then** options include: All Time, This Month, This Year, Custom

#### Scenario: Custom Range
- **Given** user selects Custom
- **When** custom range is selected
- **Then** date pickers for start and end appear
- **And** only transactions in range are exported

