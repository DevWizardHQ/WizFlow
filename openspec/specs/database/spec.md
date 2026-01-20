# Spec: Database

## ADDED Requirements

### REQ-DB-001: Database Initialization
The app shall initialize an SQLite database named `wizflow.db` on first launch.

#### Scenario: First App Launch
- **Given** the app is launched for the first time
- **When** the database initialization runs
- **Then** a SQLite database file `wizflow.db` is created
- **And** all required tables are created

#### Scenario: Subsequent App Launch
- **Given** the app has been launched before
- **When** the app starts
- **Then** the existing database is opened
- **And** migrations are checked and applied if needed

---

### REQ-DB-002: Accounts Table Schema
The database shall have an `accounts` table with the following columns:
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `name` - TEXT NOT NULL
- `balance` - REAL NOT NULL DEFAULT 0
- `currency` - TEXT NOT NULL DEFAULT 'USD'
- `icon` - TEXT NOT NULL
- `color` - TEXT NOT NULL
- `type` - TEXT NOT NULL (enum: general, cash, bank, credit, investment)
- `is_archived` - INTEGER DEFAULT 0
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

#### Scenario: Create Account Table
- **Given** the database is initializing
- **When** the accounts table is created
- **Then** all columns exist with correct types and constraints

---

### REQ-DB-003: Categories Table Schema
The database shall have a `categories` table with the following columns:
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `name` - TEXT NOT NULL
- `icon` - TEXT NOT NULL
- `color` - TEXT NOT NULL
- `type` - TEXT NOT NULL (enum: income, expense)
- `sort_order` - INTEGER DEFAULT 0
- `is_custom` - INTEGER DEFAULT 0

#### Scenario: Create Categories Table
- **Given** the database is initializing
- **When** the categories table is created
- **Then** all columns exist with correct types and constraints

---

### REQ-DB-004: Transactions Table Schema
The database shall have a `transactions` table with the following columns:
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `title` - TEXT NOT NULL
- `amount` - REAL NOT NULL
- `type` - TEXT NOT NULL (enum: income, expense, transfer)
- `account_id` - INTEGER NOT NULL (foreign key to accounts)
- `to_account_id` - INTEGER (nullable, for transfers)
- `category` - TEXT NOT NULL
- `tags` - TEXT (nullable, comma-separated)
- `note` - TEXT (nullable)
- `attachment_uri` - TEXT (nullable)
- `location_lat` - REAL (nullable)
- `location_lng` - REAL (nullable)
- `date` - TEXT NOT NULL
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

#### Scenario: Create Transactions Table
- **Given** the database is initializing
- **When** the transactions table is created
- **Then** all columns exist with correct types and constraints
- **And** foreign key to accounts table is established

---

### REQ-DB-005: Default Categories Seeding
The app shall seed default categories on first initialization.

#### Scenario: Seed Expense Categories
- **Given** the database is initialized for the first time
- **When** seeding runs
- **Then** default expense categories are created (Food, Transport, Shopping, Bills, Healthcare, Education, Entertainment)

#### Scenario: Seed Income Categories
- **Given** the database is initialized for the first time
- **When** seeding runs
- **Then** default income categories are created (Salary, Freelance, Investment, Gift)

---

### REQ-DB-006: Account CRUD Operations
The database module shall provide CRUD operations for accounts.

#### Scenario: Create Account
- **Given** valid account data
- **When** createAccount is called
- **Then** a new account record is inserted
- **And** the new account ID is returned

#### Scenario: Read All Accounts
- **Given** accounts exist in the database
- **When** getAllAccounts is called
- **Then** all non-archived accounts are returned

#### Scenario: Read Single Account
- **Given** an account exists with a specific ID
- **When** getAccountById is called
- **Then** the account data is returned

#### Scenario: Update Account
- **Given** an account exists
- **When** updateAccount is called with new data
- **Then** the account record is updated

#### Scenario: Delete Account
- **Given** an account exists
- **When** deleteAccount is called
- **Then** the account is archived (soft delete)

---

### REQ-DB-007: Category CRUD Operations
The database module shall provide CRUD operations for categories.

#### Scenario: Get Categories by Type
- **Given** categories exist
- **When** getCategoriesByType is called with 'expense' or 'income'
- **Then** only categories of that type are returned

#### Scenario: Create Custom Category
- **Given** valid category data with is_custom=1
- **When** createCategory is called
- **Then** a new custom category is created

---

### REQ-DB-008: Transaction CRUD Operations
The database module shall provide CRUD operations for transactions.

#### Scenario: Create Transaction
- **Given** valid transaction data
- **When** createTransaction is called
- **Then** a new transaction is inserted
- **And** the associated account balance is updated

#### Scenario: Get Transactions with Filters
- **Given** transactions exist
- **When** getTransactions is called with filter options
- **Then** filtered transactions are returned in date descending order

#### Scenario: Delete Transaction
- **Given** a transaction exists
- **When** deleteTransaction is called
- **Then** the transaction is deleted
- **And** the account balance is reversed

