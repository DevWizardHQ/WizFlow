# WizFlow Development Roadmap

This document outlines the step-by-step development changes for the WizFlow personal finance tracker app.

## Overview

The development is organized into **7 change proposals** that follow a logical progression from foundation to advanced features.

## Progress Summary

| Change | Status | Completed |
|--------|--------|-----------|
| add-core-foundation | ✅ Complete | Jan 12, 2025 |
| add-transaction-management | ✅ Complete | Jan 12, 2025 |
| add-account-management | ✅ Complete | Jan 12, 2025 |
| add-custom-categories | ✅ Complete | Jan 14, 2025 |
| add-analytics-stats | ✅ Complete | Jan 14, 2025 |
| add-settings-screen | ✅ Complete | Jan 17, 2026 |
| add-backup-export | 🔲 Pending | - |

## Change Proposals (In Order)

### 1. `add-core-foundation` ✅ COMPLETE
**Purpose:** Establish the base architecture for the entire app.

**Key Deliverables:**
- SQLite database initialization and schema
- Type definitions (Account, Transaction, Category)
- Database CRUD operations
- Tab navigation structure (Home, Accounts, Stats, Settings)
- Default categories seeding

**Estimated Time:** 5-6 hours

---

### 2. `add-transaction-management` ✅ COMPLETE
**Purpose:** Implement the primary feature - transaction tracking.

**Key Deliverables:**
- Add Transaction screen with form
- Edit Transaction screen
- Transaction list on Home screen
- Category picker component
- Account picker component
- Swipe-to-delete functionality

**Prerequisites:** `add-core-foundation`  
**Estimated Time:** 11-13 hours

---

### 3. `add-account-management` ✅ COMPLETE
**Purpose:** Enable multi-account tracking and transfers.

**Key Deliverables:**
- Accounts list screen with balance cards
- Add/Edit Account screens
- Account detail with filtered transactions
- Icon and color pickers
- Transfer between accounts

**Prerequisites:** `add-core-foundation`, `add-transaction-management`  
**Estimated Time:** 11-13 hours

---

### 4. `add-custom-categories` ✅ COMPLETE
**Purpose:** Allow users to personalize transaction categories.

**Key Deliverables:**
- Categories management screen
- Add/Edit custom category
- Icon picker (50+ finance icons)
- Color picker
- Category deletion with reassignment

**Prerequisites:** `add-core-foundation`, `add-transaction-management`  
**Estimated Time:** 13-15 hours

---

### 5. `add-analytics-stats` ✅ COMPLETE
**Purpose:** Provide visual insights into financial data.

**Key Deliverables:**
- Stats screen with summary cards
- Pie chart for category breakdown
- Bar chart for time trends
- Period selector (Today/Week/Month/Year)
- Analytics calculations service

**Prerequisites:** All Phase 1 changes  
**Estimated Time:** 12-15 hours

---

### 6. `add-settings-screen` ✅ COMPLETE
**Purpose:** Enable app customization and preferences.

**Key Deliverables:**
- Settings screen with grouped options
- Theme selector (Light/Dark/System)
- Default account and currency settings
- Date format preferences
- Data management links
- About section

**Prerequisites:** `add-core-foundation`, `add-account-management`  
**Estimated Time:** 10-11 hours

---

### 7. `add-backup-export` (Phase 3) ← NEXT
**Purpose:** Enable data portability and backup.

**Key Deliverables:**
- Full backup to ZIP (JSON + attachments)
- Restore from backup
- CSV export with date range filter
- CSV import with validation
- Share functionality

**Prerequisites:** All Phase 1 and 2 changes  
**Estimated Time:** 18-20 hours

---

## Recommended Development Order

```
Week 1: Foundation
├── add-core-foundation (5-6 hrs)
└── Start add-transaction-management

Week 2: Core Features
├── Complete add-transaction-management (11-13 hrs)
└── Start add-account-management

Week 3: Account & Categories
├── Complete add-account-management (11-13 hrs)
└── add-custom-categories (13-15 hrs)

Week 4: Analytics & Stats
└── add-analytics-stats (12-15 hrs)

Week 5: Settings & Data
├── add-settings-screen (10-11 hrs)
└── Start add-backup-export

Week 6: Backup & Polish
├── Complete add-backup-export (18-20 hrs)
└── Testing and bug fixes
```

## Total Estimated Effort

| Change | Hours |
|--------|-------|
| add-core-foundation | 5-6 |
| add-transaction-management | 11-13 |
| add-account-management | 11-13 |
| add-custom-categories | 13-15 |
| add-analytics-stats | 12-15 |
| add-settings-screen | 10-11 |
| add-backup-export | 18-20 |
| **Total** | **80-93 hours** |

## How to Use These Changes

1. **Start with `add-core-foundation`** - This sets up everything else
2. **Complete each change's tasks.md** - Tasks are ordered by dependency
3. **Validate with specs** - Each spec.md defines acceptance scenarios
4. **Archive completed changes** - Move to `archive/` after deployment

## File Structure After All Changes

```
app/
├── (tabs)/
│   ├── index.tsx          # Home - Transactions
│   ├── accounts.tsx       # Accounts list
│   ├── stats.tsx          # Analytics
│   └── settings.tsx       # Settings
├── transaction/
│   ├── add.tsx
│   ├── [id].tsx
│   └── transfer.tsx
├── account/
│   ├── add.tsx
│   ├── [id].tsx
│   └── detail/[id].tsx
├── categories/
│   ├── index.tsx
│   ├── add.tsx
│   └── [id].tsx
├── backup/
│   ├── index.tsx
│   └── restore.tsx
├── export/
│   └── index.tsx
└── import/
    └── index.tsx

database/
├── db.ts
├── migrations.ts
├── seed.ts
└── operations/
    ├── accounts.ts
    ├── categories.ts
    ├── transactions.ts
    └── index.ts

services/
├── transactionService.ts
├── analyticsService.ts
├── settingsService.ts
├── backupService.ts
├── restoreService.ts
├── exportService.ts
└── importService.ts

components/
├── TransactionItem.tsx
├── TransactionList.tsx
├── AccountCard.tsx
├── CategoryPicker.tsx
├── IconPicker.tsx
├── ColorPicker.tsx
├── SummaryCard.tsx
├── PeriodSelector.tsx
├── Charts/
│   ├── PieChart.tsx
│   ├── BarChart.tsx
│   └── LineChart.tsx
└── ...

types/
├── database.ts
└── index.ts

utils/
├── constants.ts
├── dateUtils.ts
└── categoryIcons.ts

contexts/
└── SettingsContext.tsx
```

