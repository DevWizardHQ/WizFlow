/**
 * AccountPicker - Dropdown/Modal for selecting account
 */

import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Account } from "@/types";
import { getAllAccounts } from "@/database";

interface AccountPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  selectedAccountId?: number;
  excludeAccountId?: number; // For transfers, exclude source account
}

export function AccountPicker({
  visible,
  onClose,
  onSelect,
  selectedAccountId,
  excludeAccountId,
}: AccountPickerProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const accounts = getAllAccounts().filter((a) => a.id !== excludeAccountId);

  const handleSelect = (account: Account) => {
    onSelect(account);
    onClose();
  };

  const formatBalance = (balance: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency;
    return `${symbol}${balance.toFixed(2)}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Select Account</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
        >
          {accounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="wallet-outline"
                size={48}
                color={textColor}
                style={{ opacity: 0.5 }}
              />
              <ThemedText style={styles.emptyText}>
                No accounts available
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Create an account first to add transactions
              </ThemedText>
            </View>
          ) : (
            accounts.map((account) => (
              <Pressable
                key={account.id}
                style={[
                  styles.accountItem,
                  selectedAccountId === account.id && styles.selectedItem,
                ]}
                onPress={() => handleSelect(account)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: account.color },
                  ]}
                >
                  <Ionicons
                    name={account.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color="#fff"
                  />
                </View>
                <View style={styles.accountInfo}>
                  <ThemedText style={styles.accountName}>
                    {account.name}
                  </ThemedText>
                  <ThemedText style={styles.accountBalance}>
                    {formatBalance(account.balance, account.currency)}
                  </ThemedText>
                </View>
                {selectedAccountId === account.id && (
                  <Ionicons name="checkmark" size={24} color="#4CAF50" />
                )}
              </Pressable>
            ))
          )}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.3)",
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
  },
  accountBalance: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.7,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.5,
    textAlign: "center",
  },
});
