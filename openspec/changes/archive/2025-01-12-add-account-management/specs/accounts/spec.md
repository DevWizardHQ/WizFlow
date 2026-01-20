# Spec: Accounts

## ADDED Requirements

### REQ-ACC-001: Accounts List Screen
The Accounts tab shall display all user accounts.

#### Scenario: View Accounts List
- **Given** the user has created accounts
- **When** the Accounts tab is selected
- **Then** all active accounts are displayed as cards
- **And** each card shows name, balance, currency, icon

#### Scenario: Total Balance Display
- **Given** multiple accounts exist
- **When** viewing the Accounts screen
- **Then** the total balance across all accounts is shown at the top

#### Scenario: Empty Accounts State
- **Given** no accounts exist
- **When** viewing the Accounts screen
- **Then** an empty state is shown
- **And** a prompt to create first account is displayed

---

### REQ-ACC-002: Add Account Screen
The app shall provide a screen to create new accounts.

#### Scenario: Navigate to Add Account
- **Given** the user is on Accounts screen
- **When** the user taps add account button
- **Then** the Add Account screen is displayed

#### Scenario: Account Form Fields
- **Given** the Add Account form is displayed
- **When** viewing the form
- **Then** the following fields are available:
  - Name (required)
  - Account Type (Cash, Bank, Credit, Investment)
  - Currency (picker)
  - Icon (icon picker)
  - Color (color picker)
  - Initial Balance (optional, defaults to 0)

#### Scenario: Save New Account
- **Given** required fields are filled
- **When** the user taps save
- **Then** the account is created
- **And** the user returns to Accounts list
- **And** the new account appears in the list

---

### REQ-ACC-003: Edit Account Screen
The app shall allow editing existing accounts.

#### Scenario: Navigate to Edit Account
- **Given** an account exists
- **When** the user taps on an account card
- **Then** the Account Detail screen opens

#### Scenario: Edit Account Details
- **Given** the Account Detail screen is open
- **When** the user taps edit
- **Then** the Edit Account form opens
- **And** fields are pre-filled with current values

#### Scenario: Save Account Changes
- **Given** the user has modified account details
- **When** the user saves changes
- **Then** the account is updated
- **And** changes reflect in Accounts list

---

### REQ-ACC-004: Archive Account
The app shall allow archiving (soft delete) accounts.

#### Scenario: Archive from Edit Screen
- **Given** the user is editing an account
- **When** the user taps archive/delete
- **Then** a confirmation dialog appears

#### Scenario: Confirm Archive
- **Given** archive confirmation is shown
- **When** the user confirms
- **Then** the account is marked as archived
- **And** the account no longer appears in active list
- **And** historical transactions remain intact

---

### REQ-ACC-005: Account Detail Screen
The app shall show account-specific transaction history.

#### Scenario: View Account Transactions
- **Given** an account with transactions exists
- **When** the user opens Account Detail
- **Then** only transactions for that account are shown

#### Scenario: Account Balance Header
- **Given** the Account Detail screen is open
- **When** viewing the screen
- **Then** the account balance is prominently displayed
- **And** account name and icon are shown

---

### REQ-ACC-006: Transfer Between Accounts
The app shall support transfers between accounts.

#### Scenario: Initiate Transfer
- **Given** at least two accounts exist
- **When** the user selects transfer option
- **Then** the Transfer screen opens

#### Scenario: Transfer Form
- **Given** the Transfer screen is open
- **When** viewing the form
- **Then** the following fields are available:
  - From Account (picker)
  - To Account (picker)
  - Amount
  - Date
  - Note (optional)

#### Scenario: Execute Transfer
- **Given** valid transfer details are entered
- **When** the user confirms transfer
- **Then** the source account balance decreases
- **And** the destination account balance increases
- **And** a transfer transaction is recorded

#### Scenario: Same Account Prevention
- **Given** the user is creating a transfer
- **When** source and destination are the same
- **Then** an error is shown
- **And** the transfer is prevented

---

### REQ-ACC-007: Account Card Component
Account cards shall display essential information.

#### Scenario: Card Display
- **Given** an account card is rendered
- **When** viewing the card
- **Then** the card displays:
  - Account icon with color background
  - Account name
  - Current balance with currency
  - Account type indicator

#### Scenario: Card Tap Action
- **Given** an account card is displayed
- **When** the user taps the card
- **Then** the Account Detail screen opens

---

### REQ-ACC-008: Icon Picker
The app shall provide an icon picker for account customization.

#### Scenario: Open Icon Picker
- **Given** the user is creating/editing an account
- **When** the user taps the icon field
- **Then** a grid of available icons is displayed

#### Scenario: Icon Categories
- **Given** the icon picker is open
- **When** viewing available icons
- **Then** finance-related icons are available (wallet, bank, credit card, etc.)

#### Scenario: Select Icon
- **Given** icons are displayed
- **When** the user taps an icon
- **Then** the icon is selected
- **And** the picker closes

---

### REQ-ACC-009: Color Picker
The app shall provide a color picker for account customization.

#### Scenario: Open Color Picker
- **Given** the user is creating/editing an account
- **When** the user taps the color field
- **Then** a palette of colors is displayed

#### Scenario: Select Color
- **Given** colors are displayed
- **When** the user taps a color
- **Then** the color is selected
- **And** the icon preview updates with new color

