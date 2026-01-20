/**
 * PeriodSelector component for filtering analytics by time period
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Period } from '@/utils/dateUtils';
import { PERIODS } from '@/utils/dateUtils';

interface PeriodSelectorProps {
  selected: Period;
  onSelect: (period: Period) => void;
}

export function PeriodSelector({ selected, onSelect }: PeriodSelectorProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      {PERIODS.map((period) => (
        <TouchableOpacity
          key={period.value}
          style={[
            styles.button,
            {
              backgroundColor: selected === period.value ? '#36A2EB' : 'rgba(128, 128, 128, 0.1)',
            }
          ]}
          onPress={() => onSelect(period.value)}
        >
          <ThemedText
            style={[
              styles.buttonText,
              {
                color: selected === period.value ? '#fff' : textColor,
              }
            ]}
          >
            {period.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center' as const,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
};