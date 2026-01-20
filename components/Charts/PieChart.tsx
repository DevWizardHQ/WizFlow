/**
 * PieChart component for category breakdown
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { CategoryBreakdown } from '@/services/analyticsService';
import { formatShortDate } from '@/utils/dateUtils';

interface PieChartProps {
  data: CategoryBreakdown[];
  width?: number;
  height?: number;
  onSlicePress?: (item: CategoryBreakdown) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function PieChart({ 
  data, 
  width = screenWidth - 32,
  height = 200,
  onSlicePress 
}: PieChartProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Prepare data for react-native-chart-kit
  const chartData = data.map((item, index) => ({
    name: item.category,
    population: item.amount,
    color: item.color || '#FF6B6B',
    legendFontColor: textColor,
    legendFontSize: 12
  }));

  const handleSlicePress = (event: any) => {
    if (onSlicePress && event && event !== '') {
      const index = parseInt(event, 10);
      const item = data[index];
      if (item) {
        onSlicePress(item);
      }
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <RNPieChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: textColor,
        } as any}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
        hasLegend={false}

      />
      
      {/* Custom Legend */}
      <View style={{ marginTop: 16 }}>
        {data.map((item, index) => (
          <View key={index} style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 8,
            paddingHorizontal: 16
          }}>
            <View style={{ 
              width: 12, 
              height: 12, 
              borderRadius: 6, 
              backgroundColor: item.color || '#FF6B6B',
              marginRight: 8
            }} />
            <ThemedText style={{ flex: 1, fontSize: 14 }}>
              {item.category} ({item.percentage}%)
            </ThemedText>
            <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
              ${item.amount.toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}