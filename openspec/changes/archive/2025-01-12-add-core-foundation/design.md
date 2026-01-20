# Design: Core Foundation Architecture

## Overview
This document outlines the technical architecture for the WizFlow app foundation.

## Database Architecture

### SQLite Setup
Using `expo-sqlite` with synchronous API for simplicity and reliability.

```typescript
// database/db.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('wizflow.db');
```

### Schema Design
Following the schema from `project.md`:

1. **accounts** - User financial accounts
2. **categories** - Transaction categories (preset + custom)
3. **transactions** - Financial transactions

### Migration Strategy
- Version tracking in a `migrations` table
- Sequential migration files
- Rollback capability (future enhancement)

## Type System

### Core Interfaces
```typescript
// types/database.ts
interface Account {
  id: number;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
  type: 'general' | 'cash' | 'bank' | 'credit' | 'investment';
  is_archived: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  sort_order: number;
  is_custom: boolean;
}

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  account_id: number;
  to_account_id?: number;
  category: string;
  tags?: string;
  note?: string;
  attachment_uri?: string;
  location_lat?: number;
  location_lng?: number;
  date: string;
  created_at: string;
}
```

## Navigation Architecture

### Tab Structure
```
(tabs)/
├── index.tsx      # Home - Recent transactions
├── accounts.tsx   # Accounts list
├── stats.tsx      # Analytics/charts
└── settings.tsx   # Settings
```

### Screen Routes (Future)
```
transaction/
├── add.tsx        # Add transaction
└── [id].tsx       # Edit transaction

account/
├── add.tsx        # Add account
└── [id].tsx       # Account detail
```

## Data Flow

### Read Operations
```
Component → useQuery hook → Database service → SQLite
```

### Write Operations
```
Component → Mutation → Database service → SQLite → Re-fetch/invalidate
```

## Error Handling
- Database errors caught and logged
- User-friendly error messages
- Graceful degradation

## Performance Considerations
- Lazy load tabs
- Paginate transaction lists (50 per page)
- Index frequently queried columns

