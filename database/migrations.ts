/**
 * Database migrations for WizFlow
 * Handles schema creation and versioning
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import { getDbInstance } from './db';

const CURRENT_VERSION = 2;

/**
 * Create all database tables
 */
function createTables(db: SQLiteDatabase): void {
  // Migrations tracking table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Accounts table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('general', 'cash', 'bank', 'credit', 'investment')),
      is_archived INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Categories table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      sort_order INTEGER DEFAULT 0,
      is_custom INTEGER DEFAULT 0
    );
  `);

  // Transactions table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'transfer')),
      account_id INTEGER NOT NULL,
      to_account_id INTEGER,
      category TEXT NOT NULL,
      tags TEXT,
      note TEXT,
      attachment_uri TEXT,
      location_lat REAL,
      location_lng REAL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (to_account_id) REFERENCES accounts(id)
    );
  `);

  // Settings table (key-value storage)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Create indexes for better query performance
  db.execSync(`
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
  `);
}

/**
 * Get current database version
 */
function getCurrentVersion(db: SQLiteDatabase): number {
  try {
    const result = db.getFirstSync<{ version: number }>(
      'SELECT MAX(version) as version FROM migrations'
    );
    return result?.version ?? 0;
  } catch {
    // Table doesn't exist yet
    return 0;
  }
}

/**
 * Record migration version
 */
function recordMigration(db: SQLiteDatabase, version: number): void {
  db.runSync('INSERT INTO migrations (version) VALUES (?)', [version]);
}

/**
 * Run all pending migrations
 */
export function runMigrations(): void {
  const db = getDbInstance();
  const currentVersion = getCurrentVersion(db);

  if (currentVersion < CURRENT_VERSION) {
    console.log(`Running migrations from v${currentVersion} to v${CURRENT_VERSION}`);

    // Version 1: Initial schema
    if (currentVersion < 1) {
      createTables(db);
      recordMigration(db, 1);
      console.log('Migration v1 applied: Initial schema created');
    }

    // Version 2: Add settings table
    if (currentVersion < 2) {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      recordMigration(db, 2);
      console.log('Migration v2 applied: Settings table created');
    }
  } else {
    console.log('Database is up to date');
  }
}

/**
 * Check if database has been initialized
 */
export function isDatabaseInitialized(): boolean {
  try {
    const db = getDbInstance();
    const result = db.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='accounts'"
    );
    return (result?.count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Reset database (for development/testing)
 */
export function resetDatabase(): void {
  const db = getDbInstance();

  db.execSync('DROP TABLE IF EXISTS transactions');
  db.execSync('DROP TABLE IF EXISTS categories');
  db.execSync('DROP TABLE IF EXISTS accounts');
  db.execSync('DROP TABLE IF EXISTS settings');
  db.execSync('DROP TABLE IF EXISTS migrations');

  console.log('Database reset complete');
}

