/**
 * Add Transaction Screen
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from '@/components/themed-view';
import { AmountInput } from "@/components/AmountInput";
import { CategoryPicker } from "@/components/CategoryPicker";
import { AccountPicker } from "@/components/AccountPicker";
import { DatePickerButton } from "@/components/DatePickerButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { createTransaction, getAllAccounts } from "@/database";
import type { Account, Category, TransactionType, CategoryType } from "@/types";

export default function AddTransactionScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "tabIconDefault");

  // Form state
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [account, setAccount] = useState<Account | null>(() => {
    const accounts = getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  });
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");

  // Modal state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const categoryType: CategoryType = type === "income" ? "income" : "expense";

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Reset category when type changes
    if (
      (newType === "income" && category?.type === "expense") ||
      (newType === "expense" && category?.type === "income")
    ) {
      setCategory(null);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const validateForm = useCallback((): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return false;
    }
    if (!category) {
      Alert.alert("Missing Category", "Please select a category");
      return false;
    }
    if (!account) {
      Alert.alert("Missing Account", "Please select an account");
      return false;
    }
    return true;
  }, [amount, category, account]);

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    try {
      createTransaction({
        title: title || category!.name,
        amount: parseFloat(amount),
        type,
        account_id: account!.id,
        to_account_id: null,
        category: category!.name,
        tags: null,
        note: note || null,
        attachment_uri: null,
        location_lat: null,
        location_lng: null,
        date: format(date, "yyyy-MM-dd"),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      Alert.alert("Error", "Failed to save transaction. Please try again.");
    }
  }, [validateForm, amount, title, category, account, date, note, type]);

  const isExpense = type === "expense";
  const isIncome = type === "income";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText type="subtitle">Add Transaction</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
        >
          {/* Type Toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                isExpense && styles.typeButtonActive,
                isExpense && { backgroundColor: "#FF6B6B" },
              ]}
              onPress={() => handleTypeChange("expense")}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={isExpense ? "#fff" : textColor}
              />
              <ThemedText
                style={[
                  styles.typeButtonText,
                  isExpense && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                isIncome && styles.typeButtonActive,
                isIncome && { backgroundColor: "#4CAF50" },
              ]}
              onPress={() => handleTypeChange("income")}
            >
              <Ionicons
                name="arrow-down"
                size={18}
                color={isIncome ? "#fff" : textColor}
              />
              <ThemedText
                style={[
                  styles.typeButtonText,
                  isIncome && styles.typeButtonTextActive,
                ]}
              >
                Income
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Amount</ThemedText>
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              currency={account?.currency || "USD"}
              autoFocus
            />
          </View>

          {/* Category Selector */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowCategoryPicker(true)}
            >
              {category ? (
                <View style={styles.selectorContent}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Ionicons
                      name={category.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <ThemedText style={styles.selectorText}>
                    {category.name}
                  </ThemedText>
                </View>
              ) : (
                <ThemedText
                  style={[styles.selectorText, { color: placeholderColor }]}
                >
                  Select category
                </ThemedText>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={placeholderColor}
              />
            </TouchableOpacity>
          </View>

          {/* Account Selector */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Account</ThemedText>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowAccountPicker(true)}
            >
              {account ? (
                <View style={styles.selectorContent}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: account.color },
                    ]}
                  >
                    <Ionicons
                      name={account.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <ThemedText style={styles.selectorText}>
                    {account.name}
                  </ThemedText>
                </View>
              ) : (
                <ThemedText
                  style={[styles.selectorText, { color: placeholderColor }]}
                >
                  Select account
                </ThemedText>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={placeholderColor}
              />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <DatePickerButton value={date} onChange={setDate} />
          </View>

          {/* Title */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Title (Optional)</ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Coffee at Starbucks"
              placeholderTextColor={placeholderColor}
            />
          </View>

          {/* Note */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Note (Optional)</ThemedText>
            <TextInput
              style={[styles.textInput, styles.noteInput, { color: textColor }]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Category Picker Modal */}
        <CategoryPicker
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          onSelect={setCategory}
          selectedCategory={category?.name}
          type={categoryType}
        />

        {/* Account Picker Modal */}
        <AccountPicker
          visible={showAccountPicker}
          onClose={() => setShowAccountPicker(false)}
          onSelect={setAccount}
          selectedAccountId={account?.id}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.3)",
  },
  backButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  typeToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: "#4CAF50",
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.6,
    marginBottom: 8,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectorText: {
    fontSize: 16,
  },
  textInput: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    fontSize: 16,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
