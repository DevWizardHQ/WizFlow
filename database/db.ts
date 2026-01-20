/**
 * Database initialization and connection for WizFlow
 * Uses expo-sqlite with synchronous API
 */

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'wizflow.db';

/**
 * Get the database instance (synchronous)
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  return SQLite.openDatabaseSync(DATABASE_NAME);
}

/**
 * Database singleton for app-wide use
 */
let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDbInstance(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = getDatabase();
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.closeSync();
    dbInstance = null;
  }
}

