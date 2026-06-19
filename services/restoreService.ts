/**
 * Service for restoring data from a backup
 */

import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { resetDatabase } from "@/database/migrations";
import {
  bulkInsertAccounts,
  bulkInsertCategories,
  bulkInsertTransactions,
} from "@/database/operations";
import { setSettings } from "@/database/operations/settings";
import type { Account, Category, Transaction } from "@/types";

/**
 * Picks a backup file using the document picker
 */
export async function pickBackupFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }
  return result.assets[0].uri;
}

/**
 * Restores a backup from a file URI
 */
export async function restoreBackup(uri: string) {
  const backupFile = new File(uri);
  const backupJson = await backupFile.text();
  const backupData = JSON.parse(backupJson);

  if (!backupData.version || backupData.version !== 1) {
    throw new Error("Invalid or unsupported backup file");
  }

  // Clear existing data
  await resetDatabase();

  // Restore attachments
  if (backupData.data.attachments) {
    for (const [uri, content] of Object.entries(backupData.data.attachments)) {
      try {
        const file = new File(uri);
        file.write(content as string, { encoding: "base64" });
      } catch (error) {
        console.error(`Failed to restore attachment: ${uri}`, error);
      }
    }
  }

  // Restore data
  await bulkInsertAccounts(backupData.data.accounts as Account[]);
  await bulkInsertCategories(backupData.data.categories as Category[]);
  await bulkInsertTransactions(backupData.data.transactions as Transaction[]);
  await setSettings(backupData.data.settings);
}
