/**
 * TransactionItem - Single transaction row component
 */

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from 'date-fns';

import { ThemedText } from "@/components/themed-text";
import { useSettings } from "@/contexts/SettingsContext";
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Transaction } from "@/types";
import { getCategoryByName } from "@/database";
import { CURRENCIES } from '@/utils/constants';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
    const textColor = useThemeColor({}, 'text');
    const { settings } = useSettings();

  const category = getCategoryByName(transaction.category);

  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";
  const amountColor = isIncome ? "#4CAF50" : isTransfer ? "#36A2EB" : "#FF6B6B";
  const amountPrefix = isIncome ? "+" : isTransfer ? "" : "-";

  const formatAmount = (amount: number) => {
    return `${amountPrefix}${settings.currencySymbol}${Math.abs(amount).toFixed(2)}`;
  };

  const categoryIcon = category?.icon || "help-circle";
  const categoryColor = category?.color || "#607D8B";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(transaction)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: categoryColor }]}>
        <Ionicons
          name={categoryIcon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#fff"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.mainRow}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {transaction.title || transaction.category}
          </ThemedText>
          <ThemedText style={[styles.amount, { color: amountColor }]}>
            {formatAmount(transaction.amount)}
          </ThemedText>
        </View>
        <View style={styles.subRow}>
          <ThemedText style={styles.category}>
            {transaction.category}
          </ThemedText>
          {transaction.note && (
            <ThemedText style={styles.note} numberOfLines={1}>
              {transaction.note}
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  category: {
    fontSize: 13,
    opacity: 0.6,
  },
  note: {
    fontSize: 13,
    opacity: 0.5,
    marginLeft: 8,
    flex: 1,
  },
});
