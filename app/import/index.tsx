/**
 * Import screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/Button';
import { previewTransactionsFromCSV, importTransactions } from '@/services/importService';
import type { CreateTransactionInput } from '@/types';

export default function ImportScreen() {
  const [isImporting, setIsImporting] = useState(false);
  const [preview, setPreview] = useState<{ transactionsToInsert: CreateTransactionInput[], parsedData: any[] } | null>(null);

  const handlePreview = async () => {
    setIsImporting(true);
    try {
      const previewData = await previewTransactionsFromCSV();
      setPreview(previewData);
    } catch (error) {
      console.error('Preview failed:', error);
      Alert.alert('Preview Failed', 'Could not preview the selected file.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!preview) return;

    setIsImporting(true);
    try {
      await importTransactions(preview.transactionsToInsert);
      Alert.alert('Import Complete', 'Your transactions have been successfully imported.');
      setPreview(null);
    } catch (error) {
      console.error('Import failed:', error);
      Alert.alert('Import Failed', 'Could not import transactions from the selected file.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Import Data</ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">Import Transactions from CSV</ThemedText>
        <ThemedText style={styles.description}>
          Import transactions from a CSV file. Make sure the file is formatted correctly.
        </ThemedText>
        <Button
          title="Select CSV for Preview"
          onPress={handlePreview}
          icon="document-text-outline"
          loading={isImporting}
        />
      </View>

      {preview && (
        <View style={[styles.card, { marginTop: 20 }]}>
          <ThemedText type="subtitle">Preview</ThemedText>
          <ThemedText style={{ marginBottom: 10 }}>{`Found ${preview.transactionsToInsert.length} valid transactions to import.`}</ThemedText>
          <ScrollView style={{ maxHeight: 300 }}>
            {preview.parsedData.slice(0, 5).map((row, index) => (
              <View key={index} style={styles.previewRow}>
                <ThemedText>{row.Date}</ThemedText>
                <ThemedText>{row.Title}</ThemedText>
                <ThemedText>{row.Amount}</ThemedText>
              </View>
            ))}
          </ScrollView>
          <Button
            title="Confirm Import"
            onPress={handleImport}
            loading={isImporting}
            style={{ marginTop: 20 }}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
});
