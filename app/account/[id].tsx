/**
 * Edit Account Screen
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
import { AccountIcon } from '@/components/AccountIcon';
import { IconPicker } from '@/components/IconPicker';
import { ColorPicker } from '@/components/ColorPicker';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getAccountById, updateAccount, archiveAccount } from '@/database';
import { ACCOUNT_TYPES } from '@/utils/constants';
import type { AccountType } from '@/types';

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  // Form state
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('general');
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState('#36A2EB');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load account data
  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    const account = getAccountById(parseInt(id, 10));
    if (!account) {
      Alert.alert('Error', 'Account not found');
      router.back();
      return;
    }

    setName(account.name);
    setAccountType(account.type);
    setIcon(account.icon);
    setColor(account.color);
    setLoading(false);
  }, [id]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter an account name');
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validateForm() || !id) return;

    try {
      updateAccount(parseInt(id, 10), {
        name: name.trim(),
        icon,
        color,
        type: accountType,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to update account:', error);
      Alert.alert('Error', 'Failed to update account. Please try again.');
    }
  }, [id, name, accountType, icon, color]);

  const handleArchive = useCallback(() => {
    Alert.alert(
      'Archive Account',
      'Are you sure you want to archive this account? It will be hidden from your accounts list but transactions will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => {
            try {
              archiveAccount(parseInt(id!, 10));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (error) {
              console.error('Failed to archive account:', error);
              Alert.alert('Error', 'Failed to archive account.');
            }
          },
        },
      ]
    );
  }, [id]);

  const handleTypeSelect = (type: AccountType) => {
    setAccountType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          <ThemedText type="subtitle">Edit Account</ThemedText>
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

          {/* Archive Button */}
          <TouchableOpacity style={styles.archiveButton} onPress={handleArchive}>
            <Ionicons name="archive-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.archiveButtonText}>Archive Account</ThemedText>
          </TouchableOpacity>
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
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 8,
  },
  archiveButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
});

