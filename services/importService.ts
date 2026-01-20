/**
 * Service for importing data from a CSV file
 */

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { bulkInsertTransactions, getAllAccounts, getAllCategories } from '@/database/operations';
import type { CreateTransactionInput } from '@/types';

// A simple CSV parser
function parseCSV(csv: string): any[] {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
      const row = headers.reduce((acc, header, index) => {
        acc[header] = values[index];
        return acc;
      }, {} as any);
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Picks a CSV file and returns the parsed data for preview.
 */
export async function previewTransactionsFromCSV() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'text/csv',
    copyToCacheDirectory: true,
  });

  if (result.type !== 'success') {
    return null;
  }

  const csvContent = await FileSystem.readAsStringAsync(result.uri);
  const parsedData = parseCSV(csvContent);

  const accounts = await getAllAccounts();
  const categories = await getAllCategories();
  const accountMap = new Map(accounts.map(acc => [acc.name, acc.id]));
  const categorySet = new Set(categories.map(cat => cat.name));

  const transactionsToInsert: CreateTransactionInput[] = parsedData.map(row => {
    const accountId = accountMap.get(row.Account);
    if (!accountId) {
      console.warn(`Skipping transaction with unknown account: ${row.Account}`);
      return null;
    }

    if (!categorySet.has(row.Category)) {
      console.warn(`Skipping transaction with unknown category: ${row.Category}`);
      return null;
    }

    return {
      title: row.Title,
      amount: parseFloat(row.Amount),
      type: row.Type.toLowerCase(),
      account_id: accountId,
      category: row.Category,
      date: new Date(row.Date).toISOString(),
      note: row.Note,
    } as CreateTransactionInput;
  }).filter(t => t !== null) as CreateTransactionInput[];

  return { transactionsToInsert, parsedData };
}

/**
 * Imports the provided transactions.
 */
export async function importTransactions(transactions: CreateTransactionInput[]) {
  if (transactions.length > 0) {
    await bulkInsertTransactions(transactions);
  }
}
