import { db } from '../db';

export const getSettings = async () => {
  const settings = {};
  const allSettings = await db.getAllAsync('SELECT * FROM settings');
  allSettings.forEach(setting => {
    settings[setting.key] = JSON.parse(setting.value);
  });
  return settings;
};

export const setSettings = async (settings) => {
  const statement = await db.prepareAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(settings)) {
    await statement.executeAsync(key, JSON.stringify(value));
  }
  await statement.finalizeAsync();
};
