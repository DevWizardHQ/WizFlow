import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSettings } from "@/contexts/SettingsContext";
import { SummaryCard } from "@/components/SummaryCard";
import { PeriodSelector } from "@/components/PeriodSelector";
import { PieChart } from "@/components/Charts/PieChart";
import { BarChart } from "@/components/Charts/BarChart";
import { LineChart } from "@/components/Charts/LineChart";

import {
  getIncomeExpenseSummary,
  getCategoryBreakdown,
  getDailyTotals,
  getWeeklyTotals,
  getMonthlyTotals,
  getTopCategories,
  type IncomeExpenseSummary,
  type CategoryBreakdown,
  type TimeSeriesPoint,
} from "@/services/analyticsService";

import type { Period } from "@/utils/dateUtils";
import { getCategoriesByType } from "@/database";
import { EmptyState } from "@/components/EmptyState";

export default function StatsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { settings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [summary, setSummary] = useState<IncomeExpenseSummary | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [timeData, setTimeData] = useState<TimeSeriesPoint[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryBreakdown[]>([]);
  const [selectedSlice, setSelectedSlice] = useState<CategoryBreakdown | null>(
    null,
  );

  const formatBalance = (balance: number) => {
    const prefix = balance >= 0 ? "" : "-";
    return `${prefix}${settings.currencySymbol}${Math.abs(balance).toFixed(2)}`;
  };

  const loadAnalyticsData = useCallback(
    async (selectedPeriod: Period) => {
      setLoading(true);

      const summaryData = await getIncomeExpenseSummary(selectedPeriod);
      setSummary(summaryData);

      const expenseBreakdown = await getCategoryBreakdown(
        "expense",
        selectedPeriod,
      );
      const expenseWithColors = expenseBreakdown.map((item) => {
        const category = getCategoriesByType("expense").find(
          (c) => c.name === item.category,
        );
        return {
          ...item,
          color: category?.color,
          icon: category?.icon,
        };
      });

      setCategoryBreakdown(expenseWithColors);
      setTopCategories(await getTopCategories(selectedPeriod));

      let timeSeriesData: TimeSeriesPoint[] = [];
      switch (selectedPeriod) {
        case "today":
        case "thisWeek":
          timeSeriesData = await getDailyTotals(selectedPeriod);
          break;
        case "thisMonth":
          timeSeriesData = await getWeeklyTotals(selectedPeriod);
          break;
        case "thisYear":
          timeSeriesData = await getMonthlyTotals();
          break;
      }

      setTimeData(timeSeriesData);
      setLoading(false);
    },
    [], // safe: only uses imported functions + setState
  );

  // Load data when period changes
  useEffect(() => {
    loadAnalyticsData(period);
  }, [period, loadAnalyticsData]);

  const hasData =
    !loading && summary && (summary.income > 0 || summary.expenses > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Statistics</ThemedText>
      </ThemedView>

      {/* Period Navigation Bar */}
      <ThemedView style={styles.navBar}>
        <PeriodSelector selected={period} onSelect={setPeriod} />
      </ThemedView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : !hasData ? (
          <EmptyState
            icon="bar-chart"
            title="No Data Available"
            subtitle="Start adding transactions to see your financial analytics"
          />
        ) : (
          <>
            {/* Summary Cards */}
            <ThemedView style={styles.summaryRow}>
              <SummaryCard
                label="Total Income"
                amount={summary!.income}
                type="income"
              />
              <SummaryCard
                label="Total Expenses"
                amount={summary!.expenses}
                type="expense"
              />
              <SummaryCard
                label="Net Balance"
                amount={summary!.net}
                type="net"
              />
            </ThemedView>

            {/* Category Breakdown */}
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Spending by Category
              </ThemedText>
              <PieChart
                data={categoryBreakdown}
                onSlicePress={setSelectedSlice}
              />

              {/* Top Categories List */}
              <ThemedView style={styles.topCategories}>
                <ThemedText type="default" style={styles.listTitle}>
                  Top Categories
                </ThemedText>
                {topCategories.map((item, index) => (
                  <ThemedView key={index} style={styles.topCategoryItem}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: item.color || "#FF6B6B" },
                      ]}
                    >
                      <ThemedText style={styles.categoryIconText}>
                        {item.category.charAt(0)}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.categoryName}>
                      {item.category}
                    </ThemedText>
                    <ThemedText style={styles.categoryAmount}>
                      {formatBalance(item.amount)}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Time Trend Chart */}
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {period === "thisYear"
                  ? "Monthly Trend"
                  : period === "thisMonth"
                    ? "Weekly Trend"
                    : "Daily Trend"}
              </ThemedText>
              {period === "thisYear" ? (
                <BarChart data={timeData} height={180} />
              ) : (
                <LineChart data={timeData} height={180} />
              )}
            </ThemedView>

            {/* Selected Slice Detail */}
            {selectedSlice && (
              <ThemedView style={styles.selectedSlice}>
                <ThemedText type="default" style={styles.selectedLabel}>
                  {selectedSlice.category}
                </ThemedText>
                <ThemedText type="subtitle" style={styles.selectedAmount}>
                  {formatBalance(selectedSlice.amount)}
                </ThemedText>
                <ThemedText type="default" style={styles.selectedPercentage}>
                  {selectedSlice.percentage}% of total spending
                </ThemedText>
              </ThemedView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  topCategories: {
    marginTop: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  topCategoryItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedSlice: {
    backgroundColor: "rgba(54, 162, 235, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  selectedLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedAmount: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedPercentage: {
    fontSize: 14,
    opacity: 0.7,
  },
});
