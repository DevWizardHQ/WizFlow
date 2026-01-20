/**
 * Database seed data for WizFlow
 * Seeds default categories on first run
 */

import { getDbInstance } from './db';
import { DEFAULT_CATEGORIES } from '@/utils/constants';

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
export function seedCategories(): void {
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
 * Seed all default data
 */
export function seedDatabase(): void {
  seedCategories();
}

