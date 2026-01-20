/**
 * CategoryIconPicker - Icon selection grid for categories
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
import { CATEGORY_ICON_GROUPS } from '@/utils/categoryIcons';

interface CategoryIconPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  selectedIcon?: string;
  selectedColor?: string;
}

export function CategoryIconPicker({
  visible,
  onClose,
  onSelect,
  selectedIcon,
  selectedColor = '#4CAF50',
}: CategoryIconPickerProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleSelect = (icon: string) => {
    onSelect(icon);
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
          <ThemedText type="subtitle">Select Icon</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {CATEGORY_ICON_GROUPS.map((group) => (
            <View key={group.name} style={styles.group}>
              <ThemedText style={styles.groupTitle}>{group.name}</ThemedText>
              <View style={styles.iconGrid}>
                {group.icons.map((icon) => (
                  <Pressable
                    key={icon}
                    style={styles.iconItem}
                    onPress={() => handleSelect(icon)}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            selectedIcon === icon
                              ? selectedColor
                              : 'rgba(128, 128, 128, 0.1)',
                        },
                      ]}
                    >
                      <Ionicons
                        name={icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={selectedIcon === icon ? '#fff' : textColor}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconItem: {
    width: '16.66%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

