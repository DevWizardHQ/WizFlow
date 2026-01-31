/**
 * Database seed data for WizFlow
 * Seeds default categories and initial account on first run
 */

import { getDbInstance } from './db';
import { createAccount } from './operations/accounts';
import { DEFAULT_ACCOUNT, DEFAULT_CATEGORIES, DEFAULT_CURRENCY } from '@/utils/constants';

/**
 * Check if categories have been seeded
 */
function isCategoriesSeeded(): boolean {
  const db = getDbInstance();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Seed default categories
 */
function seedCategories(): void {
  if (isCategoriesSeeded()) {
    console.log('Categories already seeded, skipping');
    return;
  }

  const db = getDbInstance();

  const stmt = db.prepareSync(
    `INSERT INTO categories (name, icon, color, type, sort_order, is_custom)
     VALUES (?, ?, ?, ?, ?, 0)`
  );

  try {
    for (const category of DEFAULT_CATEGORIES) {
      stmt.executeSync([
        category.name,
        category.icon,
        category.color,
        category.type,
        category.sort_order,
      ]);
    }
    console.log(`Seeded ${DEFAULT_CATEGORIES.length} default categories`);
  } finally {
    stmt.finalizeSync();
  }
}

/**
 * Check if accounts have been seeded
 */
function isAccountsSeeded(): boolean {
  const db = getDbInstance();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM accounts'
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Seed initial account
 */
function seedInitialAccount(): void {
  if (isAccountsSeeded()) {
    console.log('Accounts already seeded, skipping');
    return;
  }

  try {
    const accountId = createAccount({
      ...DEFAULT_ACCOUNT,
      balance: 0,
      currency: DEFAULT_CURRENCY,
      is_archived: 0,
    });
    console.log(`Seeded initial account with ID: ${accountId}`);
  } catch (error) {
    console.error('Error seeding initial account:', error);
  }
}

/**
 * Seed all default data
 */
export function seedDatabase(): void {
  seedInitialAccount();
  seedCategories();
}
