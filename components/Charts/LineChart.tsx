/**
 * LineChart component for balance trends
 */

import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart as RNLineChart } from "react-native-chart-kit";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { TimeSeriesPoint } from "@/services/analyticsService";
import { formatShortDate } from "@/utils/dateUtils";

interface LineChartProps {
  data: TimeSeriesPoint[];
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get("window");

export function LineChart({
  data,
  width = screenWidth - 32,
  height = 200,
}: LineChartProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  if (!data || data.length === 0) {
    return (
      <View style={{ width, height, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(128,128,128,0.1)", borderRadius: 16 }}>
        <ThemedText style={{ opacity: 0.5 }}>No trend data available</ThemedText>
      </View>
    );
  }

  // If only 1 data point, duplicate it so the chart can draw a line instead of crashing (division by zero)
  const safeData = data.length === 1 ? [data[0], data[0]] : data;

  // Calculate balance (income - expenses) for each point
  const balanceData = safeData.map((point) => point.income - point.expenses);

  // Prepare data for react-native-chart-kit
  const chartData = {
    labels: safeData.map((point) => {
      const date = new Date(point.label);
      return formatShortDate(date);
    }),
    datasets: [
      {
        data: balanceData,
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        label: "Balance",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={{ alignItems: "center" }}>
      <RNLineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={
          {
            backgroundColor: backgroundColor,
            backgroundGradientFrom: backgroundColor,
            backgroundGradientTo: backgroundColor,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
            // react-native-chart-kit expects labelColor to be a function (opacity)=>string
            labelColor: (opacity = 1) => textColor,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#36A2EB",
            },
            propsForLabels: {
              fontSize: 10,
            },
          } as any
        }
        withInnerLines={false}
        withShadow={false}
        withDots={true}
        bezier={safeData.length >= 3}
        yAxisLabel=""
        yAxisSuffix=""
      />

      {/* Current balance indicator */}
      {balanceData.length > 0 && (
        <View
          style={{
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
            Current Balance
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "600",
              color:
                balanceData[balanceData.length - 1] >= 0
                  ? "#4CAF50"
                  : "#FF6B6B",
            }}
          >
            ${balanceData[balanceData.length - 1].toFixed(2)}
          </ThemedText>
        </View>
      )}
    </View>
  );
}
