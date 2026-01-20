# Tasks: Add Core Foundation

## Phase 1: Database Layer

### 1.1 Create Type Definitions
- [x] Create `types/database.ts` with Account, Category, Transaction interfaces
- [x] Create `types/index.ts` to export all types
- [x] Add enum types for account types, transaction types, category types

### 1.2 Setup Database Module
- [x] Create `database/db.ts` - SQLite initialization and connection
- [x] Create `database/migrations.ts` - Schema creation and versioning
- [x] Create `database/seed.ts` - Default categories and data

### 1.3 Create Database Operations
- [x] Create `database/operations/accounts.ts` - CRUD for accounts
- [x] Create `database/operations/categories.ts` - CRUD for categories
- [x] Create `database/operations/transactions.ts` - CRUD for transactions
- [x] Create `database/operations/index.ts` - Export all operations

## Phase 2: Constants and Configuration

### 2.1 App Constants
- [x] Create `utils/constants.ts` with app-wide constants
- [x] Define default currencies list
- [x] Define account type options
- [x] Define default color palette

### 2.2 Default Categories
- [x] Define preset expense categories (Food, Transport, Shopping, etc.)
- [x] Define preset income categories (Salary, Freelance, etc.)
- [x] Define category icons mapping

## Phase 3: Navigation Structure

### 3.1 Update Tab Layout
- [x] Modify `app/(tabs)/_layout.tsx` for 4 tabs (Home, Accounts, Stats, Settings)
- [x] Add appropriate icons for each tab
- [x] Configure tab bar styling

### 3.2 Create Tab Screens (Placeholder)
- [x] Update `app/(tabs)/index.tsx` - Home screen placeholder
- [x] Create `app/(tabs)/accounts.tsx` - Accounts screen placeholder
- [x] Create `app/(tabs)/stats.tsx` - Stats screen placeholder
- [x] Create `app/(tabs)/settings.tsx` - Settings screen placeholder

### 3.3 Update Root Layout
- [x] Modify `app/_layout.tsx` to initialize database on app start
- [x] Add SQLite provider/context if needed
- [x] Ensure database ready before rendering

## Phase 4: Validation & Testing

### 4.1 Verify Database
- [x] Confirm database file is created
- [x] Verify all tables exist with correct schema
- [x] Test basic CRUD operations work

### 4.2 Verify Navigation
- [x] All 4 tabs accessible
- [x] Tab icons display correctly
- [x] Navigation state persists

## Dependencies
- Tasks 1.1 must complete before 1.2, 1.3
- Tasks 2.1, 2.2 must complete before 1.2 (seed data needs constants)
- Task 3.3 depends on 1.2 (database initialization)

## Estimated Effort
- Phase 1: ~2-3 hours
- Phase 2: ~1 hour
- Phase 3: ~1-2 hours
- Phase 4: ~30 minutes

**Total: ~5-6 hours**

## Implementation Complete ✅
All tasks completed on January 12, 2026.

