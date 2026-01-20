/**
 * BarChart component for time-based trends
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { TimeSeriesPoint } from '@/services/analyticsService';
import { formatShortDate } from '@/utils/dateUtils';

interface BarChartProps {
  data: TimeSeriesPoint[];
  width?: number;
  height?: number;
  onBarPress?: (point: TimeSeriesPoint) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function BarChart({ 
  data, 
  width = screenWidth - 32,
  height = 220,
  onBarPress 
}: BarChartProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Prepare data for react-native-chart-kit
  const chartData = {
    labels: data.map(point => {
      const date = new Date(point.label);
      return formatShortDate(date);
    }),
    datasets: [
      {
        data: data.map(point => point.income),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        label: 'Income'
      },
      {
        data: data.map(point => point.expenses),
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        label: 'Expenses'
      }
    ]
  };

  const handleBarPress = (event: any) => {
    if (onBarPress && event && event !== '') {
      const index = parseInt(event, 10);
      const point = data[index];
      if (point) {
        onBarPress(point);
      }
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <RNBarChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={{
          backgroundColor: backgroundColor,
          backgroundGradientFrom: backgroundColor,
          backgroundGradientTo: backgroundColor,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: textColor,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: textColor
          },
          propsForLabels: {
            fontSize: 10
          }
        } as any}
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={false}
        withHorizontalLabels={true}
        fromZero={true}
      />

      {/* Summary below chart */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 16,
        paddingHorizontal: 16
      }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 12, 
            height: 12, 
            borderRadius: 6, 
            backgroundColor: '#4CAF50',
            marginBottom: 4
          }} />
          <ThemedText style={{ fontSize: 12, color: '#4CAF50' }}>
            Income
          </ThemedText>
          <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
            ${data.reduce((sum, point) => sum + point.income, 0).toFixed(2)}
          </ThemedText>
        </View>
        
        <View style={{ alignItems: 'center' }}>
          <View style={{ 
            width: 12, 
            height: 12, 
            borderRadius: 6, 
            backgroundColor: '#FF6B6B',
            marginBottom: 4
          }} />
          <ThemedText style={{ fontSize: 12, color: '#FF6B6B' }}>
            Expenses
          </ThemedText>
          <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
            ${data.reduce((sum, point) => sum + point.expenses, 0).toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}