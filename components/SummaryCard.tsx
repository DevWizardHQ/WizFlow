/**
 * SummaryCard component for displaying income/expense totals
 */

import React from "react";
import { View } from "react-native";
import { useSettings } from "@/contexts/SettingsContext";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

interface SummaryCardProps {
  label: string;
  amount: number;
  type: "income" | "expense" | "net";
  trend?: number; // percentage change
}

export function SummaryCard({ label, amount, type, trend }: SummaryCardProps) {
  const textColor = useThemeColor({}, "text");
  const { settings } = useSettings();

  const getColor = () => {
    if (type === "income") return "#4CAF50";
    if (type === "expense") return "#FF6B6B";
    if (type === "net") return amount >= 0 ? "#4CAF50" : "#FF6B6B";
    return textColor;
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return "↑";
    if (trend < 0) return "↓";
    return null;
  };

  const formatBalance = (balance: number) => {
    const prefix = balance >= 0 ? "" : "-";
    return `${prefix}${settings.currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={[styles.amount, { color: getColor() }]}>
        {formatBalance(amount)}
      </ThemedText>

      {trend !== undefined && (
        <View style={styles.trend}>
          <ThemedText
            style={[
              styles.trendText,
              { color: trend >= 0 ? "#4CAF50" : "#FF6B6B" },
            ]}
          >
            {getTrendIcon()} {Math.abs(trend).toFixed(1)}%
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: "start" as const,
  },
  amount: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  trend: {
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
};
