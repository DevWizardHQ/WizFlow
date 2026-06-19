import { getDbInstance } from "../db";

export const getSettings = async (): Promise<Record<string, string>> => {
  const db = getDbInstance();
  const settings: Record<string, string> = {};
  const allSettings = db.getAllSync<{ key: string; value: string }>(
    "SELECT * FROM settings",
  );
  allSettings.forEach((setting) => {
    settings[setting.key] = setting.value;
  });
  return settings;
};

export const setSettings = async (
  settings: Record<string, string>,
): Promise<void> => {
  const db = getDbInstance();
  for (const [key, value] of Object.entries(settings)) {
    db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
      key,
      value,
    ]);
  }
};
