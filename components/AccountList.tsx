/**
 * AccountList - Scrollable list of account cards
 */

import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { AccountCard } from '@/components/AccountCard';
import { EmptyState } from '@/components/EmptyState';
import type { Account } from '@/types';

interface AccountListProps {
  accounts: Account[];
  onAccountPress?: (account: Account) => void;
  onAccountLongPress?: (account: Account) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement;
}

export function AccountList({
  accounts,
  onAccountPress,
  onAccountLongPress,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
}: AccountListProps) {
  if (accounts.length === 0) {
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
        {ListHeaderComponent}
        <EmptyState
          icon="wallet-outline"
          title="No accounts yet"
          subtitle="Create your first account to start tracking your finances"
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
      {ListHeaderComponent}
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onPress={onAccountPress}
          onLongPress={onAccountLongPress}
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
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

