# Tasks: Add Account Management

## Phase 1: Components

### 1.1 Account Display Components
- [x] Create `components/AccountCard.tsx` - Account card with balance
- [x] Create `components/AccountList.tsx` - Scrollable account list
- [x] Create `components/AccountIcon.tsx` - Icon with color background
- [x] Create `components/BalanceSummary.tsx` - Total balance display

### 1.2 Account Form Components
- [x] Create `components/IconPicker.tsx` - Icon selection grid
- [x] Create `components/ColorPicker.tsx` - Color selection palette
- [x] Create `components/CurrencyPicker.tsx` - Currency selection

## Phase 2: Screens

### 2.1 Accounts List Screen
- [x] Update `app/(tabs)/accounts.tsx` with account list
- [x] Show total balance at top
- [x] Display account cards in a list
- [x] Add button to create new account
- [x] Show empty state when no accounts

### 2.2 Add Account Screen
- [x] Create `app/account/add.tsx` - Add account form
- [x] Implement account type selection (Cash, Bank, Credit, etc.)
- [x] Implement icon picker
- [x] Implement color picker
- [x] Implement currency selection
- [x] Add starting balance input

### 2.3 Edit Account Screen
- [x] Create `app/account/[id].tsx` - Edit account form
- [x] Load existing account data
- [x] Allow editing name, icon, color
- [x] Add archive option (soft delete)

### 2.4 Account Detail Screen
- [x] Create `app/account/detail/[id].tsx` - Account transactions
- [x] Show account info header
- [x] Display transactions filtered by account
- [x] Show account balance
- [x] Link to edit account

## Phase 3: Transfer Functionality

### 3.1 Transfer Screen
- [x] Create `app/transaction/transfer.tsx` - Transfer form
- [x] Implement source account picker
- [x] Implement destination account picker
- [x] Amount input
- [x] Date selection
- [x] Note field

### 3.2 Transfer Logic
- [x] Update `services/transactionService.ts` for transfers (using database operations)
- [x] Deduct from source account
- [x] Add to destination account
- [x] Create transfer transaction record
- [ ] Handle currency conversion if different currencies (future)

## Phase 4: Polish

### 4.1 Account Actions
- [ ] Add long-press context menu on account cards
- [ ] Implement reorder accounts (future)
- [ ] Add account balance adjustment feature

### 4.2 Validation
- [x] Verify account creation flow
- [x] Verify transfer creates two balance changes
- [x] Test archive functionality
- [x] Verify account filtering in transactions

## Dependencies
- Phase 1 components needed for Phase 2 screens
- Phase 2.1 and 2.2 can be parallel
- Phase 3 depends on Phase 2 completion
- Transaction management change provides base patterns

## Estimated Effort
- Phase 1: ~2-3 hours
- Phase 2: ~4-5 hours
- Phase 3: ~3 hours
- Phase 4: ~2 hours

**Total: ~11-13 hours**

## Implementation Complete ✅
All core tasks completed. Remaining items (long-press menu, reorder, currency conversion) are optional enhancements for future changes.

