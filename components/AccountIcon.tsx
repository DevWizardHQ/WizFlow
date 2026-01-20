/**
 * AccountIcon - Icon with colored background for accounts
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccountIconProps {
  icon: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const SIZES = {
  small: { container: 32, icon: 16 },
  medium: { container: 44, icon: 22 },
  large: { container: 56, icon: 28 },
};

export function AccountIcon({
  icon,
  color,
  size = 'medium',
  style,
}: AccountIconProps) {
  const dimensions = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 2,
        },
        style,
      ]}
    >
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={dimensions.icon}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

