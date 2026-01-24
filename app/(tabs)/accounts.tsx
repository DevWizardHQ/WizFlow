import { useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AccountList } from "@/components/AccountList";
import { BalanceSummary } from "@/components/BalanceSummary";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllAccounts, getTotalBalance } from "@/database";
import type { Account } from "@/types";

export default function AccountsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    const accts = getAllAccounts();
    setAccounts(accts);
    setTotalBalance(getTotalBalance());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleAccountPress = (account: Account) => {
    router.push(`/account/detail/${account.id}`);
  };

  const handleAddAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/account/add");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Accounts</ThemedText>
      </ThemedView>

      {/* Account List */}
      <AccountList
        accounts={accounts}
        onAccountPress={handleAccountPress}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <BalanceSummary
            totalBalance={totalBalance}
            accountCount={accounts.length}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddAccount}
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#36A2EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
