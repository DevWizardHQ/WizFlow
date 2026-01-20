/**
 * Account database operations
 */

import { getDbInstance } from '../db';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types';

/**
 * Get all active (non-archived) accounts
 */
export function getAllAccounts(): Account[] {
  const db = getDbInstance();
  return db.getAllSync<Account>(
    'SELECT * FROM accounts WHERE is_archived = 0 ORDER BY created_at DESC'
  );
}

/**
 * Get all accounts including archived
 */
export function getAllAccountsIncludingArchived(): Account[] {
  const db = getDbInstance();
  return db.getAllSync<Account>('SELECT * FROM accounts ORDER BY created_at DESC');
}

/**
 * Get a single account by ID
 */
export function getAccountById(id: number): Account | null {
  const db = getDbInstance();
  return db.getFirstSync<Account>('SELECT * FROM accounts WHERE id = ?', [id]);
}

/**
 * Create a new account
 */
export function createAccount(input: CreateAccountInput): number {
  const db = getDbInstance();
  const result = db.runSync(
    `INSERT INTO accounts (name, balance, currency, icon, color, type, is_archived)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.balance,
      input.currency,
      input.icon,
      input.color,
      input.type,
      input.is_archived,
    ]
  );
  return result.lastInsertRowId;
}

/**
 * Update an existing account
 */
export function updateAccount(id: number, input: UpdateAccountInput): void {
  const db = getDbInstance();

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }
  if (input.balance !== undefined) {
    fields.push('balance = ?');
    values.push(input.balance);
  }
  if (input.currency !== undefined) {
    fields.push('currency = ?');
    values.push(input.currency);
  }
  if (input.icon !== undefined) {
    fields.push('icon = ?');
    values.push(input.icon);
  }
  if (input.color !== undefined) {
    fields.push('color = ?');
    values.push(input.color);
  }
  if (input.type !== undefined) {
    fields.push('type = ?');
    values.push(input.type);
  }
  if (input.is_archived !== undefined) {
    fields.push('is_archived = ?');
    values.push(input.is_archived);
  }

  if (fields.length > 0) {
    values.push(id);
    db.runSync(`UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`, values);
  }
}

/**
 * Archive an account (soft delete)
 */
export function archiveAccount(id: number): void {
  updateAccount(id, { is_archived: 1 });
}

/**
 * Delete an account permanently
 */
export function deleteAccount(id: number): void {
  const db = getDbInstance();
  db.runSync('DELETE FROM accounts WHERE id = ?', [id]);
}

/**
 * Update account balance
 */
export function updateAccountBalance(id: number, amount: number): void {
  const db = getDbInstance();
  db.runSync('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, id]);
}

/**
 * Get total balance across all active accounts
 */
export function getTotalBalance(): number {
  const db = getDbInstance();
  const result = db.getFirstSync<{ total: number }>(
    'SELECT COALESCE(SUM(balance), 0) as total FROM accounts WHERE is_archived = 0'
  );
  return result?.total ?? 0;
}

