/**
 * Service for importing data from a CSV file
 */

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { createTransaction, getAllAccounts, getAllCategories } from '@/database/operations';
import type { CreateTransactionInput } from '@/types';

// RFC 4180-compliant CSV parser (handles quoted fields containing commas or newlines)
function parseCSV(csv: string): any[] {
  const lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return [];

  function parseRow(line: string): string[] {
    const fields: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        // Quoted field
        let value = '';
        i++; // skip opening quote
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            value += '"';
            i += 2;
          } else if (line[i] === '"') {
            i++; // skip closing quote
            break;
          } else {
            value += line[i++];
          }
        }
        fields.push(value);
        if (line[i] === ',') i++;
      } else {
        // Unquoted field
        const end = line.indexOf(',', i);
        if (end === -1) {
          fields.push(line.slice(i).trim());
          break;
        } else {
          fields.push(line.slice(i, end).trim());
          i = end + 1;
        }
      }
    }
    return fields;
  }

  const headers = parseRow(lines[0]);
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseRow(lines[i]);
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

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const csvContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
  const parsedData = parseCSV(csvContent);

  const accounts = getAllAccounts();
  const categories = getAllCategories();
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

    const amount = parseFloat(row.Amount);
    if (isNaN(amount)) {
      console.warn(`Skipping transaction with invalid amount: ${row.Amount}`);
      return null;
    }

    const date = new Date(row.Date);
    if (isNaN(date.getTime())) {
      console.warn(`Skipping transaction with invalid date: ${row.Date}`);
      return null;
    }

    return {
      title: row.Title,
      amount,
      type: row.Type.toLowerCase(),
      account_id: accountId,
      to_account_id: null,
      category: row.Category,
      tags: null,
      date: date.toISOString(),
      note: row.Note || null,
      attachment_uri: null,
      location_lat: null,
      location_lng: null,
    } as CreateTransactionInput;
  }).filter(t => t !== null) as CreateTransactionInput[];

  return { transactionsToInsert, parsedData };
}

/**
 * Imports the provided transactions, updating account balances for each.
 */
export async function importTransactions(transactions: CreateTransactionInput[]) {
  for (const tx of transactions) {
    await createTransaction(tx);
  }
}
