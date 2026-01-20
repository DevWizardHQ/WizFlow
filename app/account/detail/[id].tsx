/**
 * Account Detail Screen - Shows account info and filtered transactions
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccountIcon } from '@/components/AccountIcon';
import { TransactionList } from '@/components/TransactionList';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getAccountById, getTransactions } from '@/database';
import { CURRENCIES } from '@/utils/constants';
import type { Account, Transaction } from '@/types';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!id) return;

    const acct = getAccountById(parseInt(id, 10));
    if (!acct) {
      Alert.alert('Error', 'Account not found');
      router.back();
      return;
    }

    setAccount(acct);
    const txns = getTransactions({ accountId: parseInt(id, 10), limit: 100 });
    setTransactions(txns);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        loadData();
      }
    }, [loadData, loading])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleEditAccount = () => {
    router.push(`/account/${id}`);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  const handleAddTransaction = () => {
    router.push('/transaction/add');
  };

  if (loading || !account) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const currencySymbol = CURRENCIES.find((c) => c.code === account.currency)?.symbol || '$';
  const formatBalance = (balance: number) => {
    const prefix = balance < 0 ? '-' : '';
    return `${prefix}${currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle" numberOfLines={1} style={styles.headerTitle}>
          {account.name}
        </ThemedText>
        <TouchableOpacity onPress={handleEditAccount} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Account Info Card */}
      <ThemedView style={styles.accountCard}>
        <AccountIcon icon={account.icon} color={account.color} size="large" />
        <ThemedText style={styles.accountName}>{account.name}</ThemedText>
        <ThemedText
          style={[
            styles.accountBalance,
            { color: account.balance >= 0 ? '#4CAF50' : '#FF6B6B' },
          ]}
        >
          {formatBalance(account.balance)}
        </ThemedText>
        <ThemedText style={styles.transactionCount}>
          {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
        </ThemedText>
      </ThemedView>

      {/* Transactions Section */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Transactions</ThemedText>
        </View>

        <TransactionList
          transactions={transactions}
          onTransactionPress={handleTransactionPress}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>

      {/* FAB for adding transaction */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: account.color }]}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  accountCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  accountBalance: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  transactionCount: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 8,
  },
  transactionsSection: {
    flex: 1,
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

