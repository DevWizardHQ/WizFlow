/**
 * TransactionGroup - Date-grouped transactions with header
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { format, isToday, isYesterday } from "date-fns";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TransactionItem } from "@/components/TransactionItem";
import { useSettings } from "@/contexts/SettingsContext";
import type { Transaction } from "@/types";

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
}

export function TransactionGroup({
  date,
  transactions,
  onTransactionPress,
}: TransactionGroupProps) {
  const dateObj = new Date(date);
  const { settings } = useSettings();

  const getDateLabel = () => {
    if (isToday(dateObj)) return "Today";
    if (isYesterday(dateObj)) return "Yesterday";
    return format(dateObj, "EEEE, MMM d");
  };

  const getDayTotal = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  };

  const { income, expense } = getDayTotal();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.dateLabel}>{getDateLabel()}</ThemedText>
        <View style={styles.totals}>
          {income > 0 && (
            <ThemedText style={styles.incomeTotal}>
              +{settings.currencySymbol}{income.toFixed(2)}
            </ThemedText>
          )}
          {expense > 0 && (
            <ThemedText style={styles.expenseTotal}>
              -{settings.currencySymbol}{expense.toFixed(2)}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.transactions}>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={onTransactionPress}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  totals: {
    flexDirection: "row",
    gap: 12,
  },
  incomeTotal: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4CAF50",
  },
  expenseTotal: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FF6B6B",
  },
  transactions: {
    backgroundColor: "rgba(128, 128, 128, 0.02)",
  },
});
