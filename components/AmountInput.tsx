/**
 * AmountInput - Currency-aware amount input component
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CURRENCIES } from '@/utils/constants';

interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  currency?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function AmountInput({
  value,
  onChangeText,
  currency = 'USD',
  placeholder = '0.00',
  autoFocus = false,
}: AmountInputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const inputRef = useRef<TextInput>(null);

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '$';

  const handleChangeText = (text: string) => {
    // Remove non-numeric characters except decimal point
    let cleaned = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].slice(0, 2);
    }

    onChangeText(cleaned);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={focusInput} activeOpacity={1}>
      <ThemedText style={styles.currencySymbol}>{currencySymbol}</ThemedText>
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType="decimal-pad"
        autoFocus={autoFocus}
        selectTextOnFocus
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    padding: 0,
  },
});

