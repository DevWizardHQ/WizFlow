import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSettings } from "@/contexts/SettingsContext";
import { resetDatabase, runMigrations, seedDatabase } from "@/database";
import { getAllAccounts } from "@/database/operations/accounts";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Account } from "@/types";
import { APP_NAME, APP_VERSION } from "@/utils/constants";

import { SettingItem } from "@/components/SettingItem";
import { SettingLink } from "@/components/SettingLink";
import { PickerOption, SettingPicker } from "@/components/SettingPicker";

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { settings, updateSetting, resetSettings } = useSettings();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      try {
        setAccounts(getAllAccounts());
      } catch (e) {
        console.error("Failed to fetch accounts:", e);
      }
    }, []),
  );

  const themeOptions: PickerOption[] = [
    { label: "System Default", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  const currencyOptions: PickerOption[] = [
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
    { label: "CAD ($)", value: "CAD" },
    { label: "AUD ($)", value: "AUD" },
    { label: "BDT (৳)", value: "BDT" },
    { label: "CNY (¥)", value: "CNY" },
    { label: "INR (₹)", value: "INR" }
  ];

  const dateFormatOptions: PickerOption[] = [
    { label: "MM/DD/YYYY", value: "MM/dd/yyyy" },
    { label: "DD/MM/YYYY", value: "dd/MM/yyyy" },
    { label: "YYYY-MM-DD", value: "yyyy-MM-dd" },
  ];

  const weekStartOptions: PickerOption[] = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
  ];

  // Currency to symbol mapping
  const currencySymbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
    AUD: "$",
    BDT: "৳",
    CNY: "¥",
    INR: "₹",
  };

  const accountOptions: PickerOption[] = [
    { label: "None", value: -1 },
    ...accounts.map((acc) => ({ label: acc.name, value: acc.id })),
  ];

  // Handle default account value
  const defaultAccountValue = settings.defaultAccountId ?? -1;
  const updateDefaultAccount = (val: number) => {
    updateSetting("defaultAccountId", val === -1 ? null : val);
  };

  // Handle currency change - also update currency symbol
  const handleCurrencyChange = (currency: string) => {
    updateSetting("currency", currency);
    const symbol = currencySymbolMap[currency] || "৳";
    updateSetting("currencySymbol", symbol);
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to delete all data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              resetDatabase(); // drops tables
              runMigrations(); // recreates tables
              seedDatabase(); // seeds data
              resetSettings(); // resets settings
              setAccounts(getAllAccounts()); // refresh accounts
              Alert.alert("Success", "All data has been reset.");
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Failed to reset data");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Appearance Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
          <SettingPicker
            label="Theme"
            value={settings.theme}
            options={themeOptions}
            onValueChange={(val) => updateSetting("theme", val)}
            icon="color-palette"
          />
        </ThemedView>

        {/* Customization Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Customization
          </ThemedText>
          <SettingLink
            label="Manage Categories"
            href="/categories"
            icon="list"
          />
        </ThemedView>

        {/* Defaults Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Defaults
          </ThemedText>
          <SettingPicker
            label="Currency"
            value={settings.currency}
            options={currencyOptions}
            onValueChange={handleCurrencyChange}
            icon="cash"
          />
          <SettingPicker
            label="Default Account"
            value={defaultAccountValue}
            options={accountOptions}
            onValueChange={updateDefaultAccount}
            icon="wallet"
          />
        </ThemedView>

        {/* Preferences Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preferences
          </ThemedText>
          <SettingPicker
            label="Date Format"
            value={settings.dateFormat}
            options={dateFormatOptions}
            onValueeChange={(val) => updateSetting("dateFormat", val)}
            icon="calendar"
          />
          <SettingPicker
            label="First Day of Week"
            value={settings.firstDayOfWeek}
            options={weekStartOptions}
            onValueChange={(val) => updateSetting("firstDayOfWeek", val)}
            icon="calendar-number"
          />
        </ThemedView>

        {/* Data Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data
          </ThemedText>
          <SettingLink
            label="Backup & Restore"
            href="/backup"
            icon="cloud-upload"
          />
          <SettingLink
            label="Export to CSV"
            href="/export"
            icon="document-text"
          />
          <SettingLink
            label="Import from CSV"
            href="/import"
            icon="document-text-outline"
          />
          <SettingItem
            label="Reset All Data"
            onPress={handleResetData}
            icon="trash"
            style={{ borderBottomWidth: 0 }}
          />
        </ThemedView>

        {/* About Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            About
          </ThemedText>
          <SettingItem
            label="App Version"
            value={APP_VERSION}
            icon="information-circle"
          />

          <ThemedView style={styles.aboutInfo}>
            <ThemedText type="default" style={styles.appName}>
              {APP_NAME}
            </ThemedText>
            <ThemedText type="default" style={styles.tagline}>
              Your Personal Finance Tracker
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    opacity: 0.7,
    paddingHorizontal: 4,
  },
  aboutInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
  },
  tagline: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
});
