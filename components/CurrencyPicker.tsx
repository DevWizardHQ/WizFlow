/**
 * CurrencyPicker - Currency selection modal
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CURRENCIES } from '@/utils/constants';

interface CurrencyPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (currencyCode: string) => void;
  selectedCurrency?: string;
}

export function CurrencyPicker({
  visible,
  onClose,
  onSelect,
  selectedCurrency,
}: CurrencyPickerProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
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
          <ThemedText type="subtitle">Select Currency</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {CURRENCIES.map((currency) => (
            <Pressable
              key={currency.code}
              style={[
                styles.currencyItem,
                selectedCurrency === currency.code && styles.selectedItem,
              ]}
              onPress={() => handleSelect(currency.code)}
            >
              <View style={styles.currencyInfo}>
                <ThemedText style={styles.currencySymbol}>
                  {currency.symbol}
                </ThemedText>
                <View style={styles.currencyText}>
                  <ThemedText style={styles.currencyCode}>
                    {currency.code}
                  </ThemedText>
                  <ThemedText style={styles.currencyName}>
                    {currency.name}
                  </ThemedText>
                </View>
              </View>
              {selectedCurrency === currency.code && (
                <Ionicons name="checkmark" size={24} color="#4CAF50" />
              )}
            </Pressable>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
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
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  currencyText: {
    marginLeft: 12,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
});

