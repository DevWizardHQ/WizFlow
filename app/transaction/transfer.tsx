/**
 * Transfer Screen - Transfer funds between accounts
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AmountInput } from '@/components/AmountInput';
import { AccountPicker } from '@/components/AccountPicker';
import { AccountIcon } from '@/components/AccountIcon';
import { DatePickerButton } from '@/components/DatePickerButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createTransaction, getAllAccounts } from '@/database';
import type { Account } from '@/types';

export default function TransferScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const accounts = getAllAccounts();

  // Form state
  const [fromAccount, setFromAccount] = useState<Account | null>(
    accounts.length > 0 ? accounts[0] : null
  );
  const [toAccount, setToAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');

  // Modal state
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const validateForm = (): boolean => {
    if (!fromAccount) {
      Alert.alert('Missing Account', 'Please select a source account');
      return false;
    }
    if (!toAccount) {
      Alert.alert('Missing Account', 'Please select a destination account');
      return false;
    }
    if (fromAccount.id === toAccount.id) {
      Alert.alert('Invalid Transfer', 'Source and destination accounts must be different');
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return false;
    }
    if (parseFloat(amount) > fromAccount.balance && fromAccount.type !== 'credit') {
      Alert.alert(
        'Insufficient Balance',
        `The source account only has ${fromAccount.currency} ${fromAccount.balance.toFixed(2)}`
      );
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    try {
      createTransaction({
        title: `Transfer to ${toAccount!.name}`,
        amount: parseFloat(amount),
        type: 'transfer',
        account_id: fromAccount!.id,
        to_account_id: toAccount!.id,
        category: 'Transfer',
        tags: null,
        note: note || null,
        attachment_uri: null,
        location_lat: null,
        location_lng: null,
        date: format(date, 'yyyy-MM-dd'),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to create transfer:', error);
      Alert.alert('Error', 'Failed to complete transfer. Please try again.');
    }
  }, [fromAccount, toAccount, amount, date, note]);

  const swapAccounts = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText type="subtitle">Transfer</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Done</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* Amount */}
          <View style={styles.amountSection}>
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              currency={fromAccount?.currency || 'USD'}
              autoFocus
            />
          </View>

          {/* Account Selection */}
          <View style={styles.accountsSection}>
            {/* From Account */}
            <View style={styles.accountRow}>
              <ThemedText style={styles.accountLabel}>From</ThemedText>
              <TouchableOpacity
                style={styles.accountSelector}
                onPress={() => setShowFromPicker(true)}
              >
                {fromAccount ? (
                  <>
                    <AccountIcon
                      icon={fromAccount.icon}
                      color={fromAccount.color}
                      size="small"
                    />
                    <View style={styles.accountInfo}>
                      <ThemedText style={styles.accountName}>
                        {fromAccount.name}
                      </ThemedText>
                      <ThemedText style={styles.accountBalance}>
                        Balance: ${fromAccount.balance.toFixed(2)}
                      </ThemedText>
                    </View>
                  </>
                ) : (
                  <ThemedText style={[styles.placeholderText, { color: placeholderColor }]}>
                    Select source account
                  </ThemedText>
                )}
                <Ionicons name="chevron-forward" size={20} color={placeholderColor} />
              </TouchableOpacity>
            </View>

            {/* Swap Button */}
            <TouchableOpacity style={styles.swapButton} onPress={swapAccounts}>
              <Ionicons name="swap-vertical" size={24} color={textColor} />
            </TouchableOpacity>

            {/* To Account */}
            <View style={styles.accountRow}>
              <ThemedText style={styles.accountLabel}>To</ThemedText>
              <TouchableOpacity
                style={styles.accountSelector}
                onPress={() => setShowToPicker(true)}
              >
                {toAccount ? (
                  <>
                    <AccountIcon
                      icon={toAccount.icon}
                      color={toAccount.color}
                      size="small"
                    />
                    <View style={styles.accountInfo}>
                      <ThemedText style={styles.accountName}>
                        {toAccount.name}
                      </ThemedText>
                      <ThemedText style={styles.accountBalance}>
                        Balance: ${toAccount.balance.toFixed(2)}
                      </ThemedText>
                    </View>
                  </>
                ) : (
                  <ThemedText style={[styles.placeholderText, { color: placeholderColor }]}>
                    Select destination account
                  </ThemedText>
                )}
                <Ionicons name="chevron-forward" size={20} color={placeholderColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <DatePickerButton value={date} onChange={setDate} />
          </View>

          {/* Note */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Note (Optional)</ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={placeholderColor}
              multiline
            />
          </View>
        </ScrollView>

        {/* Account Pickers */}
        <AccountPicker
          visible={showFromPicker}
          onClose={() => setShowFromPicker(false)}
          onSelect={setFromAccount}
          selectedAccountId={fromAccount?.id}
          excludeAccountId={toAccount?.id}
        />

        <AccountPicker
          visible={showToPicker}
          onClose={() => setShowToPicker(false)}
          onSelect={setToAccount}
          selectedAccountId={toAccount?.id}
          excludeAccountId={fromAccount?.id}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
  },
  backButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  amountSection: {
    marginBottom: 24,
  },
  accountsSection: {
    marginBottom: 24,
  },
  accountRow: {
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 8,
  },
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  accountInfo: {
    flex: 1,
    marginLeft: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountBalance: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 8,
    marginVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 8,
  },
  textInput: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    fontSize: 16,
    minHeight: 60,
  },
});

