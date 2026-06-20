/**
 * Export screen
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/Button";
import { PeriodSelector } from "@/components/PeriodSelector";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getDateRange, type Period } from "@/utils/dateUtils";
import {
  exportTransactionsCSV,
  exportAccountsCSV,
} from "@/services/exportService";

export default function ExportScreen() {
  const [period, setPeriod] = useState<Period>("thisMonth");

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleExportTransactions = async () => {
    try {
      const { start, end } = getDateRange(period);
      await exportTransactionsCSV(start, end);
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(
        "Export Failed",
        "Could not export your transactions to a CSV file.",
      );
    }
  };

  const handleExportAccounts = async () => {
    try {
      await exportAccountsCSV();
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(
        "Export Failed",
        "Could not export your accounts to a CSV file.",
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Export Data
        </ThemedText>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Hero Header */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroIconBackground,
              { backgroundColor: "rgba(10, 126, 164, 0.1)" },
            ]}
          >
            <MaterialCommunityIcons
              name="file-chart-outline"
              size={54}
              color={tintColor}
            />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.heroTitle}>
            Data Export
          </ThemedText>
          <ThemedText style={styles.heroDescription}>
            Save your financial logs to your local storage. Exported files are
            standard CSVs, compatible with Excel and Google Sheets.
          </ThemedText>
        </View>

        {/* Export Transactions Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "rgba(76, 175, 80, 0.12)" },
              ]}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={22}
                color="#4CAF50"
              />
            </View>
            <View style={styles.cardTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Transactions CSV
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.description}>
            Export your transaction ledger. Select the reporting period to
            filter your transaction records before exporting.
          </ThemedText>

          <ThemedText style={styles.label}>Select Reporting Period</ThemedText>
          <PeriodSelector selected={period} onSelect={setPeriod} />

          <Button
            title="Export Transactions"
            onPress={handleExportTransactions}
            icon="file-document-outline"
            style={styles.button}
          />
        </View>

        {/* Export Accounts Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "rgba(10, 126, 164, 0.12)" },
              ]}
            >
              <MaterialCommunityIcons
                name="wallet-outline"
                size={22}
                color={tintColor}
              />
            </View>
            <View style={styles.cardTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Accounts Summary CSV
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.description}>
            Export details of your current active financial accounts, including
            their types, names, balances, and configured currencies.
          </ThemedText>

          <Button
            title="Export Account Balances"
            onPress={handleExportAccounts}
            icon="wallet-outline"
            variant="secondary"
            style={styles.button}
          />
        </View>

        {/* Information Grid */}
        <View style={styles.infoSection}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            Tips & Guide
          </ThemedText>
          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={tintColor}
            />
            <ThemedText style={styles.infoText}>
              The CSV format uses comma-separated values. Open with Microsoft
              Excel, Google Sheets, or Apple Numbers.
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="options-outline" size={20} color="#4CAF50" />
            <ThemedText style={styles.infoText}>
              Transactions sheet includes details such as Date, Type, Account
              Name, Category Name, Amount, and Notes.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerPlaceholder: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroIconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.6,
    paddingHorizontal: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.12)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
    marginBottom: 16,
  },
  button: {
    width: "100%",
  },
  infoSection: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.1)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
    marginLeft: 12,
  },
});
