/**
 * Import screen
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
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  previewTransactionsFromCSV,
  importTransactions,
} from "@/services/importService";
import type { CreateTransactionInput } from "@/types";

export default function ImportScreen() {
  const [isImporting, setIsImporting] = useState(false);
  const [preview, setPreview] = useState<{
    transactionsToInsert: CreateTransactionInput[];
    parsedData: any[];
  } | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handlePreview = async () => {
    setIsImporting(true);
    try {
      const previewData = await previewTransactionsFromCSV();
      setPreview(previewData);
    } catch (error) {
      console.error("Preview failed:", error);
      Alert.alert("Preview Failed", "Could not preview the selected file.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!preview) return;

    setIsImporting(true);
    try {
      await importTransactions(preview.transactionsToInsert);
      Alert.alert(
        "Import Complete",
        "Your transactions have been successfully imported.",
      );
      setPreview(null);
    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert(
        "Import Failed",
        "Could not import transactions from the selected file.",
      );
    } finally {
      setIsImporting(false);
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
          Import Data
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
              name="file-import"
              size={54}
              color={tintColor}
            />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.heroTitle}>
            Transaction Import
          </ThemedText>
          <ThemedText style={styles.heroDescription}>
            Import record logs from other services. WizFlow supports standard
            CSV file inputs with date, description, and amount data fields.
          </ThemedText>
        </View>

        {/* Import Selector Card */}
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
                CSV Transaction Spreadsheet
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.description}>
            Load a CSV table. You will be shown a structured preview of parsed
            rows before any database operations are executed.
          </ThemedText>

          <Button
            title="Select CSV for Preview"
            onPress={handlePreview}
            icon="file-document-outline"
            loading={isImporting}
            style={styles.button}
          />
        </View>

        {/* Conditional Preview Card */}
        {preview && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: "rgba(255, 152, 0, 0.12)" },
                ]}
              >
                <Ionicons name="eye-outline" size={20} color="#FF9800" />
              </View>
              <View style={styles.cardTitleContainer}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  Parsed Preview
                </ThemedText>
                <ThemedText style={styles.subtitleText}>
                  {preview.transactionsToInsert.length} transactions found
                </ThemedText>
              </View>
            </View>

            <View style={styles.previewTable}>
              <View style={styles.tableHeader}>
                <ThemedText style={[styles.columnHeader, styles.dateCol]}>
                  Date
                </ThemedText>
                <ThemedText style={[styles.columnHeader, styles.titleCol]}>
                  Title
                </ThemedText>
                <ThemedText style={[styles.columnHeader, styles.amountCol]}>
                  Amount
                </ThemedText>
              </View>

              <ScrollView style={styles.tableBodyScroll}>
                {preview.parsedData.slice(0, 5).map((row, index) => (
                  <View key={index} style={styles.previewRow}>
                    <ThemedText
                      style={[styles.rowText, styles.dateCol]}
                      numberOfLines={1}
                    >
                      {row.Date}
                    </ThemedText>
                    <ThemedText
                      style={[styles.rowText, styles.titleCol]}
                      numberOfLines={1}
                    >
                      {row.Title}
                    </ThemedText>
                    <ThemedText
                      style={[styles.rowText, styles.amountCol]}
                      numberOfLines={1}
                    >
                      {row.Amount}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            </View>

            {preview.parsedData.length > 5 && (
              <ThemedText style={styles.tableSummaryText}>
                Showing top 5 of {preview.parsedData.length} records.
              </ThemedText>
            )}

            <Button
              title="Confirm Import"
              onPress={handleImport}
              loading={isImporting}
              icon="check"
              style={[styles.button, { marginTop: 16 }]}
            />
          </View>
        )}

        {/* Guide Card */}
        <View style={styles.infoSection}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            CSV Template Structure
          </ThemedText>
          <View style={styles.infoRow}>
            <Ionicons name="list-circle-outline" size={20} color={tintColor} />
            <ThemedText style={styles.infoText}>
              Ensure headers exactly include:{" "}
              <ThemedText type="defaultSemiBold">Date</ThemedText>,{" "}
              <ThemedText type="defaultSemiBold">Title</ThemedText>, and{" "}
              <ThemedText type="defaultSemiBold">Amount</ThemedText> fields.
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
            <ThemedText style={styles.infoText}>
              Dates must follow standard formats (e.g. YYYY-MM-DD or
              MM/DD/YYYY).
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
  subtitleText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
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
  previewTable: {
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.15)",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.15)",
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.6,
  },
  tableBodyScroll: {
    maxHeight: 200,
  },
  previewRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  rowText: {
    fontSize: 13,
  },
  dateCol: {
    flex: 3,
  },
  titleCol: {
    flex: 5,
    paddingHorizontal: 6,
  },
  amountCol: {
    flex: 2,
    textAlign: "right",
  },
  tableSummaryText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
    textAlign: "center",
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
