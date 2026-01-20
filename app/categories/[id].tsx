/**
 * Edit Category Screen
 */

import React, { useState, useCallback, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryIconPicker } from '@/components/CategoryIconPicker';
import { ColorPicker } from '@/components/ColorPicker';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesByType,
  getTransactionCount,
} from '@/database';
import type { Category, CategoryType } from '@/types';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [icon, setIcon] = useState('folder');
  const [color, setColor] = useState('#FF6B6B');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load category data
  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    const category = getCategoryById(parseInt(id, 10));
    if (!category) {
      Alert.alert('Error', 'Category not found');
      router.back();
      return;
    }

    // Prevent editing default categories
    if (category.is_custom === 0) {
      Alert.alert('Cannot Edit', 'Default categories cannot be edited');
      router.back();
      return;
    }

    setName(category.name);
    setType(category.type);
    setIcon(category.icon);
    setColor(category.color);
    setLoading(false);
  }, [id]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a category name');
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validateForm() || !id) return;

    try {
      updateCategory(parseInt(id, 10), {
        name: name.trim(),
        icon,
        color,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to update category:', error);
      Alert.alert('Error', 'Failed to update category. Please try again.');
    }
  }, [id, name, icon, color]);

  const handleDelete = useCallback(() => {
    if (!id) return;

    // Check if any transactions use this category
    const txnCount = getTransactionCount({ category: name });

    if (txnCount > 0) {
      // Show reassignment dialog
      const alternativeCategories = getCategoriesByType(type).filter(
        (c) => c.id !== parseInt(id, 10)
      );

      Alert.alert(
        'Category In Use',
        `This category is used by ${txnCount} transaction(s). Please reassign them to another category before deleting, or delete anyway to leave those transactions with this category name.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Anyway',
            style: 'destructive',
            onPress: () => performDelete(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Delete Category',
        'Are you sure you want to delete this category?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => performDelete(),
          },
        ]
      );
    }
  }, [id, name, type]);

  const performDelete = () => {
    try {
      deleteCategory(parseInt(id!, 10));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to delete category:', error);
      Alert.alert('Error', 'Failed to delete category.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const isExpense = type === 'expense';

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
          <ThemedText type="subtitle">Edit Category</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* Preview */}
          <View style={styles.previewSection}>
            <View style={[styles.previewIcon, { backgroundColor: color }]}>
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={32}
                color="#fff"
              />
            </View>
            <ThemedText style={styles.previewName}>
              {name || 'Category Name'}
            </ThemedText>
            <View style={[styles.typeBadge, {
              backgroundColor: isExpense ? 'rgba(255, 107, 107, 0.2)' : 'rgba(76, 175, 80, 0.2)'
            }]}>
              <ThemedText style={[styles.typeBadgeText, {
                color: isExpense ? '#FF6B6B' : '#4CAF50'
              }]}>
                {isExpense ? 'Expense' : 'Income'}
              </ThemedText>
            </View>
          </View>

          {/* Category Name */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Category Name</ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Subscriptions"
              placeholderTextColor={placeholderColor}
            />
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
                <View style={[styles.selectorIcon, { backgroundColor: color }]}>
                  <Ionicons
                    name={icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color="#fff"
                  />
                </View>
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

          {/* Type Info (read-only) */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Category Type</ThemedText>
            <View style={styles.readOnlyField}>
              <Ionicons
                name={isExpense ? 'arrow-up' : 'arrow-down'}
                size={18}
                color={isExpense ? '#FF6B6B' : '#4CAF50'}
              />
              <ThemedText style={styles.readOnlyText}>
                {isExpense ? 'Expense' : 'Income'}
              </ThemedText>
              <ThemedText style={styles.readOnlyNote}>
                (cannot be changed)
              </ThemedText>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.deleteButtonText}>Delete Category</ThemedText>
          </TouchableOpacity>
        </ScrollView>

        {/* Modals */}
        <CategoryIconPicker
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    opacity: 0.8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 10,
  },
  selectorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    gap: 8,
  },
  readOnlyText: {
    fontSize: 16,
  },
  readOnlyNote: {
    fontSize: 13,
    opacity: 0.5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 8,
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
});

