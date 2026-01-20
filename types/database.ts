/**
 * Database type definitions for WizFlow
 */

// Account types enum
export type AccountType = 'general' | 'cash' | 'bank' | 'credit' | 'investment';

// Transaction types enum
export type TransactionType = 'income' | 'expense' | 'transfer';

// Category types enum
export type CategoryType = 'income' | 'expense';

/**
 * Account interface - represents a financial account
 */
export interface Account {
  id: number;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
  type: AccountType;
  is_archived: number; // SQLite uses 0/1 for boolean
  created_at: string;
}

/**
 * Category interface - represents a transaction category
 */
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  sort_order: number;
  is_custom: number; // SQLite uses 0/1 for boolean
}

/**
 * Transaction interface - represents a financial transaction
 */
export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  account_id: number;
  to_account_id: number | null; // For transfers
  category: string;
  tags: string | null; // Comma-separated
  note: string | null;
  attachment_uri: string | null;
  location_lat: number | null;
  location_lng: number | null;
  date: string; // ISO date string
  created_at: string;
}

/**
 * Input types for creating new records (omit auto-generated fields)
 */
export type CreateAccountInput = Omit<Account, 'id' | 'created_at'>;
export type UpdateAccountInput = Partial<Omit<Account, 'id' | 'created_at'>>;

export type CreateCategoryInput = Omit<Category, 'id'>;
export type UpdateCategoryInput = Partial<Omit<Category, 'id'>>;

export type CreateTransactionInput = Omit<Transaction, 'id' | 'created_at'>;
export type UpdateTransactionInput = Partial<Omit<Transaction, 'id' | 'created_at'>>;

/**
 * Transaction with joined account data for display
 */
export interface TransactionWithAccount extends Transaction {
  account_name?: string;
  account_icon?: string;
  account_color?: string;
  to_account_name?: string;
}

