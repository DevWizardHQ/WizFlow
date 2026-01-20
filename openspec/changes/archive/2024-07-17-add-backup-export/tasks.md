# Tasks: Add Backup & Export

## Phase 1: Backup Service

### 1.1 Create Backup Service
- [x] Create `services/backupService.ts`
- [x] Implement `createBackup()` - generate backup JSON
- [x] Implement `packageBackup()` - create ZIP file
- [x] Implement `shareBackup(filePath)` - share via system

### 1.2 Backup Data Structure
- [x] Define backup JSON schema
- [x] Include version for compatibility
- [x] Include all tables (accounts, transactions, categories)
- [x] Include settings
- [x] Include attachments (base64 encoded)

## Phase 2: Restore Service

### 2.1 Create Restore Service
- [x] Create `services/restoreService.ts`
- [x] Implement `pickBackupFile()` - file picker
- [x] Implement `extractBackup()` - unzip file
- [x] Implement `validateBackup()` - check data integrity
- [x] Implement `restoreBackup()` - restore all data

### 2.2 Restore Process
- [x] Clear existing data (with confirmation)
- [x] Insert accounts
- [x] Insert categories
- [x] Insert transactions
- [x] Restore settings
- [x] Restore attachments

## Phase 3: CSV Export

### 3.1 Create Export Service
- [x] Create `services/exportService.ts`
- [x] Implement `exportTransactionsCSV()` - transactions to CSV
- [ ] Implement `exportAccountsCSV()` - accounts to CSV
- [x] Handle special characters and escaping

### 3.2 CSV Format
- [x] Define column headers
- [x] Format dates consistently
- [x] Handle currency formatting
- [x] Include all relevant fields

## Phase 4: CSV Import

### 4.1 Create Import Service
- [x] Create `services/importService.ts`
- [x] Implement `pickCSVFile()` - file picker
- [x] Implement `parseCSV()` - parse CSV content
- [x] Implement `validateCSVData()` - validate rows
- [x] Implement `importTransactions()` - insert data

### 4.2 Import Validation
- [x] Check required fields
- [x] Validate amounts (numeric)
- [x] Validate dates
- [x] Match categories
- [x] Match accounts

## Phase 5: UI Screens

### 5.1 Backup Screen
- [x] Create `app/backup/index.tsx` - backup main screen
- [x] Show backup button with progress
- [x] Show last backup date
- [x] Show backup file size estimate

### 5.2 Restore Screen
- [x] Create `app/backup/restore.tsx` - restore screen
- [x] File picker integration
- [x] Show backup info after selection
- [x] Confirmation before restore
- [x] Progress indicator during restore

### 5.3 Export Screen
- [x] Create `app/export/index.tsx` - export options
- [x] Export format selection (CSV)
- [x] Date range filter for export
- [x] Share action after export

### 5.4 Import Screen
- [x] Create `app/import/index.tsx` - import screen
- [x] File picker for CSV
- [x] Preview of data to import
- [x] Import confirmation
- [x] Success/error feedback

## Phase 6: Integration

### 6.1 Connect to Settings
- [x] Link backup option from Settings
- [x] Link export option from Settings
- [x] Add import option

### 6.2 Error Handling
- [x] Handle file read errors
- [x] Handle parse errors
- [x] Handle validation errors
- [x] Show user-friendly error messages

## Phase 7: Validation

### 7.1 Testing
- [x] Test full backup/restore cycle
- [x] Test CSV export opens in spreadsheet apps
- [x] Test CSV import with various formats
- [x] Test large dataset backup
- [x] Test error scenarios

## Dependencies
- Phase 1 and 2 can be parallel
- Phase 3 and 4 can be parallel
- Phase 5 depends on Phase 1-4
- Phase 6 depends on Phase 5

## Estimated Effort
- Phase 1: ~3 hours
- Phase 2: ~3 hours
- Phase 3: ~2 hours
- Phase 4: ~3 hours
- Phase 5: ~4 hours
- Phase 6: ~1 hour
- Phase 7: ~2 hours

**Total: ~18-20 hours**
