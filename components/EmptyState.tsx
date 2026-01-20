/**
 * EmptyState - Placeholder component for empty lists
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={64}
        color={textColor}
        style={styles.icon}
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
      {subtitle && (
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    opacity: 0.3,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  action: {
    marginTop: 20,
  },
});

