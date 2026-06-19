/**
 * Service for creating and managing backups
 */

import {
  getAllAccounts,
  getAllCategories,
  getAllTransactions,
} from "@/database/operations";
import { getSettings } from "@/database/operations/settings";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";

const BACKUP_VERSION = 1;

/**
 * Creates a JSON backup of the entire database, including attachments.
 */
export async function createBackup() {
  const accounts = await getAllAccounts();
  const categories = await getAllCategories();
  const transactions = await getAllTransactions();
  const settings = await getSettings();

  const attachments = {};
  for (const transaction of transactions) {
    if (transaction.attachment_uri) {
      try {
        const file = new File(transaction.attachment_uri);
        const content = await file.base64();
        attachments[transaction.attachment_uri] = content;
      } catch (error) {
        console.error(
          `Failed to read attachment: ${transaction.attachment_uri}`,
          error,
        );
      }
    }
  }

  const backupData = {
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    data: {
      accounts,
      categories,
      transactions,
      settings,
      attachments,
    },
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * Packages the backup data into a file and shares it.
 */
export async function packageAndShareBackup() {
  const backupJson = await createBackup();
  const backupFile = new File(
    Paths.document,
    `WizFlow_Backup_${new Date().toISOString().split("T")[0]}.json`,
  );

  backupFile.write(backupJson);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(backupFile.uri, {
      mimeType: "application/json",
      dialogTitle: "Share your backup file",
    });
  }
}
