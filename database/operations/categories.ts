/**
 * Category database operations
 */

import { getDbInstance } from '../db';
import type { Category, CreateCategoryInput, UpdateCategoryInput, CategoryType } from '@/types';

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  const db = getDbInstance();
  return db.getAllSync<Category>(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  );
}

/**
 * Get categories by type (income or expense)
 */
export function getCategoriesByType(type: CategoryType): Category[] {
  const db = getDbInstance();
  return db.getAllSync<Category>(
    'SELECT * FROM categories WHERE type = ? ORDER BY sort_order ASC',
    [type]
  );
}

/**
 * Get a single category by ID
 */
export function getCategoryById(id: number): Category | null {
  const db = getDbInstance();
  return db.getFirstSync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

/**
 * Get a category by name
 */
export function getCategoryByName(name: string): Category | null {
  const db = getDbInstance();
  return db.getFirstSync<Category>('SELECT * FROM categories WHERE name = ?', [name]);
}

/**
 * Create a new category
 */
export function createCategory(input: CreateCategoryInput): number {
  const db = getDbInstance();
  const result = db.runSync(
    `INSERT INTO categories (name, icon, color, type, sort_order, is_custom)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.icon,
      input.color,
      input.type,
      input.sort_order,
      input.is_custom,
    ]
  );
  return result.lastInsertRowId;
}

/**
 * Update an existing category
 */
export function updateCategory(id: number, input: UpdateCategoryInput): void {
  const db = getDbInstance();

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }
  if (input.icon !== undefined) {
    fields.push('icon = ?');
    values.push(input.icon);
  }
  if (input.color !== undefined) {
    fields.push('color = ?');
    values.push(input.color);
  }
  if (input.sort_order !== undefined) {
    fields.push('sort_order = ?');
    values.push(input.sort_order);
  }

  if (fields.length > 0) {
    values.push(id);
    db.runSync(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  }
}

/**
 * Delete a category
 */
export function deleteCategory(id: number): void {
  const db = getDbInstance();
  db.runSync('DELETE FROM categories WHERE id = ?', [id]);
}

/**
 * Check if a category is custom (can be deleted)
 */
export function isCategoryCustom(id: number): boolean {
  const category = getCategoryById(id);
  return category?.is_custom === 1;
}

