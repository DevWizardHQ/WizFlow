/**
 * CategoryPicker - Modal for selecting transaction category
 */

import React, { useState } from 'react';
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
import type { Category, CategoryType } from '@/types';
import { getCategoriesByType } from '@/database';

interface CategoryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  selectedCategory?: string;
  type: CategoryType;
}

export function CategoryPicker({
  visible,
  onClose,
  onSelect,
  selectedCategory,
  type,
}: CategoryPickerProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const categories = getCategoriesByType(type);

  const handleSelect = (category: Category) => {
    onSelect(category);
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
          <ThemedText type="subtitle">
            Select {type === 'income' ? 'Income' : 'Expense'} Category
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.name && styles.selectedItem,
              ]}
              onPress={() => handleSelect(category)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: category.color }]}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color="#fff"
                />
              </View>
              <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              {selectedCategory === category.name && (
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
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
  },
});

