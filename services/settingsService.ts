import { getDbInstance } from '@/database/db';

export interface Setting {
    key: string;
    value: string;
}

/**
 * Get a setting by key
 */
export const getSetting = (key: string): string | null => {
    const db = getDbInstance();
    try {
        const result = db.getFirstSync<{ value: string }>(
            'SELECT value FROM settings WHERE key = ?',
            [key]
        );
        return result?.value || null;
    } catch (error) {
        console.error(`Error getting setting ${key}:`, error);
        return null;
    }
};

/**
 * Save a setting (insert or update)
 */
export const setSetting = (key: string, value: string): void => {
    const db = getDbInstance();
    try {
        db.runSync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            [key, value]
        );
    } catch (error) {
        console.error(`Error setting setting ${key} to ${value}:`, error);
        throw error;
    }
};

/**
 * Get all settings as a key-value object
 */
export const getAllSettings = (): Record<string, string> => {
    const db = getDbInstance();
    try {
        const results = db.getAllSync<Setting>('SELECT * FROM settings');
        const settings: Record<string, string> = {};
        results.forEach(row => {
            settings[row.key] = row.value;
        });
        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        return {};
    }
};

/**
 * Reset all settings to defaults (clears table)
 */
export const resetSettings = (): void => {
    const db = getDbInstance();
    try {
        db.runSync('DELETE FROM settings');
    } catch (error) {
        console.error('Error resetting settings:', error);
        throw error;
    }
};
