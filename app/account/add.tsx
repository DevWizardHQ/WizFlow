/**
 * Add Account Screen
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountIcon } from '@/components/AccountIcon';
import { AmountInput } from '@/components/AmountInput';
import { ColorPicker } from '@/components/ColorPicker';
import { CurrencyPicker } from '@/components/CurrencyPicker';
import { IconPicker } from '@/components/IconPicker';
import { ThemedText } from '@/components/themed-text';
import { createAccount } from '@/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { AccountType } from '@/types';
import { ACCOUNT_TYPES, COLOR_PALETTE, DEFAULT_CURRENCY } from '@/utils/constants';

export default function AddAccountScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  // Form state
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('general');
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState<string>(COLOR_PALETTE[4]); // Blue
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [initialBalance, setInitialBalance] = useState('');

  // Modal state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter an account name');
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    try {
      const balance = initialBalance ? parseFloat(initialBalance) : 0;

      createAccount({
        name: name.trim(),
        balance,
        currency,
        icon,
        color,
        type: accountType,
        is_archived: 0,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to create account:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  }, [name, accountType, icon, color, currency, initialBalance]);

  const handleTypeSelect = (type: AccountType) => {
    setAccountType(type);
    // Update icon based on type
    const typeConfig = ACCOUNT_TYPES.find((t) => t.value === type);
    if (typeConfig) {
      setIcon(typeConfig.icon);
    }
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
          <ThemedText type="subtitle">Add Account</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* Preview */}
          <View style={styles.previewSection}>
            <AccountIcon icon={icon} color={color} size="large" />
            <ThemedText style={styles.previewName}>
              {name || 'Account Name'}
            </ThemedText>
          </View>

          {/* Account Name */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Account Name</ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., My Savings"
              placeholderTextColor={placeholderColor}
              autoFocus
            />
          </View>

          {/* Account Type */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Account Type</ThemedText>
            <View style={styles.typeGrid}>
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    accountType === type.value && styles.typeButtonActive,
                    accountType === type.value && { borderColor: color },
                  ]}
                  onPress={() => handleTypeSelect(type.value)}
                >
                  <Ionicons
                    name={type.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={accountType === type.value ? color : textColor}
                  />
                  <ThemedText
                    style={[
                      styles.typeButtonText,
                      accountType === type.value && { color },
                    ]}
                  >
                    {type.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon & Color Row */}
          <View style={styles.row}>
            {/* Icon Selector */}
            <View style={[styles.section, styles.halfSection]}>
              <ThemedText style={styles.label}>Icon</ThemedText>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowIconPicker(true)}
              >
                <AccountIcon icon={icon} color={color} size="small" />
                <ThemedText style={styles.selectorText}>Change</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Color Selector */}
            <View style={[styles.section, styles.halfSection]}>
              <ThemedText style={styles.label}>Color</ThemedText>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowColorPicker(true)}
              >
                <View style={[styles.colorPreview, { backgroundColor: color }]} />
                <ThemedText style={styles.selectorText}>Change</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Currency */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Currency</ThemedText>
            <TouchableOpacity
              style={styles.fullSelector}
              onPress={() => setShowCurrencyPicker(true)}
            >
              <ThemedText style={styles.currencyText}>{currency}</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={placeholderColor} />
            </TouchableOpacity>
          </View>

          {/* Initial Balance */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Initial Balance (Optional)</ThemedText>
            <AmountInput
              value={initialBalance}
              onChangeText={setInitialBalance}
              currency={currency}
              placeholder="0.00"
            />
          </View>
        </ScrollView>

        {/* Modals */}
        <IconPicker
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelect={setIcon}
          selectedIcon={icon}
          selectedColor={color}
        />

        <ColorPicker
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          onSelect={setColor}
          selectedColor={color}
        />

        <CurrencyPicker
          visible={showCurrencyPicker}
          onClose={() => setShowCurrencyPicker(false)}
          onSelect={setCurrency}
          selectedCurrency={currency}
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
  previewSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    opacity: 0.8,
  },
  section: {
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 10,
  },
  selectorText: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  fullSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

