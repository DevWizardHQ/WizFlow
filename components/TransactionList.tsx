/**
 * TransactionList - Scrollable list with date-grouped transactions
 */

import React, { useMemo } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { format } from "date-fns";

import { TransactionGroup } from "@/components/TransactionGroup";
import { EmptyState } from "@/components/EmptyState";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions?: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function TransactionList({
  transactions,
  onTransactionPress,
  refreshing = false,
  onRefresh,
}: TransactionListProps) {
  const safeTransactions = transactions || [];

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    safeTransactions.forEach((transaction) => {
      const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    // Sort dates descending
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, txns]) => ({ date, transactions: txns }));
  }, [safeTransactions]);

  if (safeTransactions.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <EmptyState
          icon="receipt-outline"
          title="No transactions yet"
          subtitle="Add your first transaction to start tracking your finances"
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {groupedTransactions.map(({ date, transactions }) => (
        <TransactionGroup
          key={date}
          date={date}
          transactions={transactions}
          onTransactionPress={onTransactionPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
