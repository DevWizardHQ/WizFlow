import { useState, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TransactionList } from "@/components/TransactionList";
import { useSettings } from "@/contexts/SettingsContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getTransactions, getTotalBalance } from "@/database";
import type { Transaction } from "@/types";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useSettings();

  const loadData = useCallback(async () => {
    const txns = await getTransactions({ limit: 50 });
    setTransactions(txns);
    const balance = await getTotalBalance();
    setTotalBalance(balance);
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleTransactionPress = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  const handleAddTransaction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/transaction/add");
  };

  const formatBalance = (balance: number) => {
    const prefix = balance >= 0 ? "" : "-";
    return `${prefix}${settings.currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <View>
          <ThemedText type="title">WizFlow</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your Personal Finance Tracker
          </ThemedText>
        </View>
      </ThemedView>

      {/* Balance Card */}
      <ThemedView style={styles.balanceCard}>
        <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
        <ThemedText
          style={[
            styles.balanceAmount,
            { color: totalBalance >= 0 ? "#4CAF50" : "#FF6B6B" },
          ]}
        >
          {formatBalance(totalBalance)}
        </ThemedText>
      </ThemedView>

      {/* Transactions Section */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          <ThemedText style={styles.transactionCount}>
            {transactions.length}{" "}
            {transactions.length === 1 ? "transaction" : "transactions"}
          </ThemedText>
        </View>

        <TransactionList
          transactions={transactions}
          onTransactionPress={handleTransactionPress}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTransaction}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 44,
    textAlign: "center",
  },
  transactionsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  transactionCount: {
    fontSize: 13,
    opacity: 0.5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
