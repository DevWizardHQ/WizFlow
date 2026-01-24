/**
 * AccountCard - Card component displaying account info and balance
 */

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AccountIcon } from "@/components/AccountIcon";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Account } from "@/types";
import { CURRENCIES } from "@/utils/constants";

interface AccountCardProps {
  account: Account;
  onPress?: (account: Account) => void;
  onLongPress?: (account: Account) => void;
}

export function AccountCard({
  account,
  onPress,
  onLongPress,
}: AccountCardProps) {
  const textColor = useThemeColor({}, "text");

  const currencySymbol =
    CURRENCIES.find((c) => c.code === account.currency)?.symbol || "$";

  const formatBalance = (balance: number) => {
    const prefix = balance < 0 ? "-" : "";
    return `${prefix}${currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      general: "General",
      cash: "Cash",
      bank: "Bank Account",
      credit: "Credit Card",
      investment: "Investment",
    };
    return labels[type] || type;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(account)}
      onLongPress={() => onLongPress?.(account)}
    >
      <ThemedView style={styles.card}>
        <View style={styles.leftSection}>
          <AccountIcon
            icon={account.icon}
            color={account.color}
            size="medium"
          />
          <View style={styles.info}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {account.name}
            </ThemedText>
            <ThemedText style={styles.type}>
              {getAccountTypeLabel(account.type)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <ThemedText
            style={[
              styles.balance,
              { color: account.balance >= 0 ? "#4CAF50" : "#FF6B6B" },
            ]}
          >
            {formatBalance(account.balance)}
          </ThemedText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={textColor}
            style={{ opacity: 0.4 }}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  type: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balance: {
    fontSize: 16,
    fontWeight: "600",
  },
});
