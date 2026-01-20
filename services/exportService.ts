/**
 * Service for exporting data to CSV format
 */

import { getAllTransactions, getAllAccounts } from '@/database/operations';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Converts an array of objects to a CSV string.
 * @param data The array of objects to convert.
 * @returns A CSV string.
 */
function toCSV(data: any[]): string {
  if (data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Exports all transactions to a CSV file and shares it.
 */
export async function exportTransactionsCSV(startDate?: Date, endDate?: Date) {
  const transactions = await getAllTransactions({ startDate: startDate?.toISOString(), endDate: endDate?.toISOString() });
  const accounts = await getAllAccounts();
  const accountMap = new Map(accounts.map(acc => [acc.id, acc.name]));

  const csvData = transactions.map(t => ({
    Date: t.date,
    Title: t.title,
    Type: t.type,
    Account: accountMap.get(t.account_id) || 'N/A',
    Category: t.category,
    Amount: t.amount,
    Note: t.note || '',
  }));

  const csvString = toCSV(csvData);
  const filePath = `${FileSystem.documentDirectory}WizFlow_Transactions_${new Date().toISOString().split('T')[0]}.csv`;

  await FileSystem.writeAsStringAsync(filePath, csvString);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Transactions as CSV',
    });
  }
}

/**
 * Exports all accounts to a CSV file and shares it.
 */
export async function exportAccountsCSV() {
  const accounts = await getAllAccounts();

  const csvData = accounts.map(acc => ({
    Name: acc.name,
    Balance: acc.balance,
    Currency: acc.currency,
    Type: acc.type,
  }));

  const csvString = toCSV(csvData);
  const filePath = `${FileSystem.documentDirectory}WizFlow_Accounts_${new Date().toISOString().split('T')[0]}.csv`;

  await FileSystem.writeAsStringAsync(filePath, csvString);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Accounts as CSV',
    });
  }
}
