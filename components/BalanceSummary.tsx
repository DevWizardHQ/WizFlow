/**
 * BalanceSummary - Total balance display component
 */

import React from "react";
import { StyleSheet } from "react-native";
import { useSettings } from "@/contexts/SettingsContext";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CURRENCIES } from "@/utils/constants";

interface BalanceSummaryProps {
  totalBalance: number;
  currency?: string;
  accountCount?: number;
}

export function BalanceSummary({
  totalBalance,
  currency = "USD",
  accountCount,
}: BalanceSummaryProps) {
  const { settings } = useSettings();
  const formatBalance = (balance: number) => {
    const prefix = balance < 0 ? "-" : "";
    return `${prefix}${settings.currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Total Balance</ThemedText>
      <ThemedText
        style={[
          styles.balance,
          { color: totalBalance >= 0 ? "#4CAF50" : "#FF6B6B" },
        ]}
      >
        {formatBalance(totalBalance)}
      </ThemedText>
      {accountCount !== undefined && (
        <ThemedText style={styles.accountCount}>
          {accountCount} {accountCount === 1 ? "account" : "accounts"}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  balance: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 44,
    textAlign: "center",
  },
  accountCount: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 8,
  },
});
