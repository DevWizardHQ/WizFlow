/**
 * Transaction database operations
 */

import { getDbInstance } from '../db';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionType,
  TransactionWithAccount
} from '@/types';
import { updateAccountBalance } from './accounts';

/**
 * Filter options for querying transactions
 */
export interface TransactionFilters {
  accountId?: number;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get transactions with optional filters
 */
export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const db = getDbInstance();

  let query = 'SELECT * FROM transactions WHERE 1=1';
  const params: (string | number)[] = [];

  if (filters.accountId !== undefined) {
    query += ' AND (account_id = ? OR to_account_id = ?)';
    params.push(filters.accountId, filters.accountId);
  }
  if (filters.type !== undefined) {
    query += ' AND type = ?';
    params.push(filters.type);
  }
  if (filters.category !== undefined) {
    query += ' AND category = ?';
    params.push(filters.category);
  }
  if (filters.startDate !== undefined) {
    query += ' AND date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate !== undefined) {
    query += ' AND date <= ?';
    params.push(filters.endDate);
  }

  query += ' ORDER BY date DESC, created_at DESC';

  if (filters.limit !== undefined) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset !== undefined) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return await db.getAllAsync<Transaction>(query, params);
}

/**
 * Get transactions with joined account data
 */
export async function getTransactionsWithAccounts(filters: TransactionFilters = {}): Promise<TransactionWithAccount[]> {
  const db = getDbInstance();

  let query = `
    SELECT
      t.*,
      a.name as account_name,
      a.icon as account_icon,
      a.color as account_color,
      ta.name as to_account_name
    FROM transactions t
    LEFT JOIN accounts a ON t.account_id = a.id
    LEFT JOIN accounts ta ON t.to_account_id = ta.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters.accountId !== undefined) {
    query += ' AND (t.account_id = ? OR t.to_account_id = ?)';
    params.push(filters.accountId, filters.accountId);
  }
  if (filters.type !== undefined) {
    query += ' AND t.type = ?';
    params.push(filters.type);
  }
  if (filters.category !== undefined) {
    query += ' AND t.category = ?';
    params.push(filters.category);
  }
  if (filters.startDate !== undefined) {
    query += ' AND t.date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate !== undefined) {
    query += ' AND t.date <= ?';
    params.push(filters.endDate);
  }

  query += ' ORDER BY t.date DESC, t.created_at DESC';

  if (filters.limit !== undefined) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset !== undefined) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return await db.getAllAsync<TransactionWithAccount>(query, params);
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(id: number): Promise<Transaction | null> {
  const db = getDbInstance();
  return await db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
}

/**
 * Create a new transaction and update account balance
 */
export async function createTransaction(input: CreateTransactionInput): Promise<number> {
  const db = getDbInstance();

  const result = await db.runAsync(
    `INSERT INTO transactions (title, amount, type, account_id, to_account_id, category, tags, note, attachment_uri, location_lat, location_lng, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.amount,
      input.type,
      input.account_id,
      input.to_account_id,
      input.category,
      input.tags,
      input.note,
      input.attachment_uri,
      input.location_lat,
      input.location_lng,
      input.date,
    ]
  );

  // Update account balance based on transaction type
  if (input.type === 'income') {
    await updateAccountBalance(input.account_id, input.amount);
  } else if (input.type === 'expense') {
    await updateAccountBalance(input.account_id, -input.amount);
  } else if (input.type === 'transfer' && input.to_account_id) {
    await updateAccountBalance(input.account_id, -input.amount);
    await updateAccountBalance(input.to_account_id, input.amount);
  }

  return result.lastInsertRowId;
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(id: number, input: UpdateTransactionInput): Promise<void> {
  const db = getDbInstance();

  // Get the original transaction to calculate balance adjustments
  const original = await getTransactionById(id);
  if (!original) return;

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) {
    fields.push('title = ?');
    values.push(input.title);
  }
  if (input.amount !== undefined) {
    fields.push('amount = ?');
    values.push(input.amount);
  }
  if (input.type !== undefined) {
    fields.push('type = ?');
    values.push(input.type);
  }
  if (input.account_id !== undefined) {
    fields.push('account_id = ?');
    values.push(input.account_id);
  }
  if (input.to_account_id !== undefined) {
    fields.push('to_account_id = ?');
    values.push(input.to_account_id);
  }
  if (input.category !== undefined) {
    fields.push('category = ?');
    values.push(input.category);
  }
  if (input.tags !== undefined) {
    fields.push('tags = ?');
    values.push(input.tags);
  }
  if (input.note !== undefined) {
    fields.push('note = ?');
    values.push(input.note);
  }
  if (input.date !== undefined) {
    fields.push('date = ?');
    values.push(input.date);
  }

  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`, values);

    // Handle balance adjustments if amount or type changed
    const newAmount = input.amount ?? original.amount;
    const newType = input.type ?? original.type;
    const newAccountId = input.account_id ?? original.account_id;
    const newToAccountId = input.to_account_id ?? original.to_account_id;

    // Reverse original balance change
    if (original.type === 'income') {
      await updateAccountBalance(original.account_id, -original.amount);
    } else if (original.type === 'expense') {
      await updateAccountBalance(original.account_id, original.amount);
    } else if (original.type === 'transfer' && original.to_account_id) {
      await updateAccountBalance(original.account_id, original.amount);
      await updateAccountBalance(original.to_account_id, -original.amount);
    }

    // Apply new balance change
    if (newType === 'income') {
      await updateAccountBalance(newAccountId, newAmount);
    } else if (newType === 'expense') {
      await updateAccountBalance(newAccountId, -newAmount);
    } else if (newType === 'transfer' && newToAccountId) {
      await updateAccountBalance(newAccountId, -newAmount);
      await updateAccountBalance(newToAccountId, newAmount);
    }
  }
}

/**
 * Delete a transaction and reverse balance changes
 */
export async function deleteTransaction(id: number): Promise<void> {
  const db = getDbInstance();

  const transaction = await getTransactionById(id);
  if (!transaction) return;

  // Reverse balance change
  if (transaction.type === 'income') {
    await updateAccountBalance(transaction.account_id, -transaction.amount);
  } else if (transaction.type === 'expense') {
    await updateAccountBalance(transaction.account_id, transaction.amount);
  } else if (transaction.type === 'transfer' && transaction.to_account_id) {
    await updateAccountBalance(transaction.account_id, transaction.amount);
    await updateAccountBalance(transaction.to_account_id, -transaction.amount);
  }

  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

/**
 * Get transaction count
 */
export async function getTransactionCount(filters: TransactionFilters = {}): Promise<number> {
  const db = getDbInstance();

  let query = 'SELECT COUNT(*) as count FROM transactions WHERE 1=1';
  const params: (string | number)[] = [];

  if (filters.accountId !== undefined) {
    query += ' AND (account_id = ? OR to_account_id = ?)';
    params.push(filters.accountId, filters.accountId);
  }
  if (filters.type !== undefined) {
    query += ' AND type = ?';
    params.push(filters.type);
  }
  if (filters.startDate !== undefined) {
    query += ' AND date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate !== undefined) {
    query += ' AND date <= ?';
    params.push(filters.endDate);
  }

  const result = await db.getFirstAsync<{ count: number }>(query, params);
  return result?.count ?? 0;
}
