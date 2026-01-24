/**
 * Export screen
 */

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/Button";
import {
  exportTransactionsCSV,
  exportAccountsCSV,
} from "@/services/exportService";
import { PeriodSelector } from "@/components/PeriodSelector";
import { getDateRange, type Period } from "@/utils/dateUtils";

export default function ExportScreen() {
  const [period, setPeriod] = useState<Period>("allTime");

  const handleExportTransactions = async () => {
    try {
      const { start, end } = getDateRange(period);
      await exportTransactionsCSV(start, end);
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(
        "Export Failed",
        "Could not export your transactions to a CSV file.",
      );
    }
  };

  const handleExportAccounts = async () => {
    try {
      await exportAccountsCSV();
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(
        "Export Failed",
        "Could not export your accounts to a CSV file.",
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Export Data
      </ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">Export Transactions</ThemedText>
        <ThemedText style={styles.description}>
          Export all your transactions to a CSV file. This file can be opened in
          any spreadsheet software.
        </ThemedText>
        <PeriodSelector selected={period} onSelect={setPeriod} />
        <Button
          title="Export Transactions as CSV"
          onPress={handleExportTransactions}
          icon="document-text-outline"
          style={{ marginTop: 10 }}
        />
      </View>
      <View style={[styles.card, { marginTop: 20 }]}>
        <ThemedText type="subtitle">Export Accounts</ThemedText>
        <ThemedText style={styles.description}>
          Export all your accounts to a CSV file.
        </ThemedText>
        <Button
          title="Export Accounts as CSV"
          onPress={handleExportAccounts}
          icon="document-text-outline"
          variant="secondary"
        />
      </View>
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
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.8,
  },
});
