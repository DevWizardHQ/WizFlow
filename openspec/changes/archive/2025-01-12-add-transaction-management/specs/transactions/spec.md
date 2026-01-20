# Spec: Transactions

## ADDED Requirements

### REQ-TXN-001: Add Transaction Screen
The app shall provide a screen to add new transactions.

#### Scenario: Navigate to Add Transaction
- **Given** the user is on the Home screen
- **When** the user taps the add button (FAB)
- **Then** the Add Transaction screen is displayed

#### Scenario: Transaction Type Selection
- **Given** the user is on Add Transaction screen
- **When** the screen loads
- **Then** income/expense toggle is visible
- **And** expense is selected by default

---

### REQ-TXN-002: Transaction Form Fields
The Add Transaction form shall include required and optional fields.

#### Scenario: Required Fields
- **Given** the Add Transaction form is displayed
- **When** viewing the form
- **Then** the following required fields are visible:
  - Amount (numeric input)
  - Category (picker)
  - Account (picker)
  - Date (date picker, defaults to today)

#### Scenario: Optional Fields
- **Given** the Add Transaction form is displayed
- **When** viewing the form
- **Then** the following optional fields are available:
  - Title/Description
  - Note
  - Tags

---

### REQ-TXN-003: Transaction Validation
The form shall validate input before saving.

#### Scenario: Missing Amount
- **Given** the user has not entered an amount
- **When** the user tries to save
- **Then** an error message is shown
- **And** the transaction is not saved

#### Scenario: Missing Category
- **Given** the user has not selected a category
- **When** the user tries to save
- **Then** an error message is shown
- **And** the transaction is not saved

#### Scenario: Valid Transaction
- **Given** all required fields are filled
- **When** the user taps save
- **Then** the transaction is saved
- **And** the user is returned to Home screen
- **And** the account balance is updated

---

### REQ-TXN-004: Transaction List Display
The Home screen shall display transactions in a list.

#### Scenario: Transaction List Items
- **Given** transactions exist
- **When** viewing the Home screen
- **Then** transactions are displayed with:
  - Category icon and color
  - Title or category name
  - Amount (colored by type)
  - Date

#### Scenario: Date Grouping
- **Given** transactions exist across multiple days
- **When** viewing the transaction list
- **Then** transactions are grouped by date
- **And** each group shows the date header

#### Scenario: Empty State
- **Given** no transactions exist
- **When** viewing the Home screen
- **Then** an empty state message is shown
- **And** a prompt to add first transaction is displayed

---

### REQ-TXN-005: Edit Transaction
The app shall allow editing existing transactions.

#### Scenario: Navigate to Edit
- **Given** a transaction exists
- **When** the user taps on a transaction
- **Then** the Edit Transaction screen opens
- **And** the form is pre-filled with transaction data

#### Scenario: Save Edited Transaction
- **Given** the user has modified transaction data
- **When** the user saves changes
- **Then** the transaction is updated
- **And** account balances are adjusted if amount changed

---

### REQ-TXN-006: Delete Transaction
The app shall allow deleting transactions.

#### Scenario: Delete with Swipe
- **Given** a transaction is displayed in the list
- **When** the user swipes left on the transaction
- **Then** a delete option is revealed

#### Scenario: Delete from Edit Screen
- **Given** the user is on Edit Transaction screen
- **When** the user taps delete
- **Then** a confirmation dialog appears

#### Scenario: Confirm Delete
- **Given** the delete confirmation is shown
- **When** the user confirms deletion
- **Then** the transaction is deleted
- **And** the account balance is reversed
- **And** the user returns to Home screen

---

### REQ-TXN-007: Category Picker
The app shall provide a category picker component.

#### Scenario: Open Category Picker
- **Given** the user is adding/editing a transaction
- **When** the user taps the category field
- **Then** a modal/sheet displays available categories

#### Scenario: Filter by Transaction Type
- **Given** the category picker is open
- **When** the transaction type is 'expense'
- **Then** only expense categories are shown
- **When** the transaction type is 'income'
- **Then** only income categories are shown

#### Scenario: Select Category
- **Given** categories are displayed
- **When** the user taps a category
- **Then** the category is selected
- **And** the picker closes
- **And** the selected category is shown in the form

---

### REQ-TXN-008: Amount Input
The amount input shall handle currency formatting.

#### Scenario: Numeric Only Input
- **Given** the user is entering an amount
- **When** typing in the amount field
- **Then** only numeric values and decimal point are accepted

#### Scenario: Currency Display
- **Given** an amount is entered
- **When** viewing the field
- **Then** the amount shows the account's currency symbol

