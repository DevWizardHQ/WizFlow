/**
 * Service for creating and managing backups
 */

import { getAllAccounts, getAllCategories, getAllTransactions } from '@/database/operations';
import { getSettings } from '@/database/operations/settings';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
        const content = await FileSystem.readAsStringAsync(transaction.attachment_uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        attachments[transaction.attachment_uri] = content;
      } catch (error) {
        console.error(`Failed to read attachment: ${transaction.attachment_uri}`, error);
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
  const backupFilePath = `${FileSystem.documentDirectory}WizFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;

  await FileSystem.writeAsStringAsync(backupFilePath, backupJson);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(backupFilePath, {
      mimeType: 'application/json',
      dialogTitle: 'Share your backup file',
    });
  }
}
