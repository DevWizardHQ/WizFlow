/**
 * Add Category Screen
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryIconPicker } from "@/components/CategoryIconPicker";
import { ColorPicker } from "@/components/ColorPicker";
import { ThemedText } from "@/components/themed-text";
import { createCategory } from "@/database";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { CategoryType } from "@/types";
import { DEFAULT_CATEGORY_ICON } from "@/utils/categoryIcons";
import { COLOR_PALETTE } from "@/utils/constants";

export default function AddCategoryScreen() {
  const { type: initialType } = useLocalSearchParams<{ type: string }>();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "tabIconDefault");

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>(
    (initialType as CategoryType) || "expense",
  );
  const [icon, setIcon] = useState(DEFAULT_CATEGORY_ICON);
  const [color, setColor] = useState<string>(COLOR_PALETTE[0]);

  // Modal state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const validateForm = useCallback((): boolean => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter a category name");
      return false;
    }
    return true;
  }, [name]);

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    try {
      createCategory({
        name: name.trim(),
        icon,
        color,
        type,
        sort_order: 50, // Custom categories in the middle
        is_custom: 1,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error("Failed to create category:", error);
      Alert.alert("Error", "Failed to create category. Please try again.");
    }
  }, [validateForm, name, icon, color, type]);

  const handleTypeToggle = (newType: CategoryType) => {
    setType(newType);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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
          <ThemedText type="subtitle">Add Category</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
        >
          {/* Preview */}
          <View style={styles.previewSection}>
            <View style={[styles.previewIcon, { backgroundColor: color }]}>
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={32}
                color="#fff"
              />
            </View>
            <ThemedText style={styles.previewName}>
              {name || "Category Name"}
            </ThemedText>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: isExpense
                    ? "rgba(255, 107, 107, 0.2)"
                    : "rgba(76, 175, 80, 0.2)",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.typeBadgeText,
                  {
                    color: isExpense ? "#FF6B6B" : "#4CAF50",
                  },
                ]}
              >
                {isExpense ? "Expense" : "Income"}
              </ThemedText>
            </View>
          </View>

          {/* Type Toggle */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Category Type</ThemedText>
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  isExpense && styles.typeButtonActive,
                  isExpense && { backgroundColor: "#FF6B6B" },
                ]}
                onPress={() => handleTypeToggle("expense")}
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
                onPress={() => handleTypeToggle("income")}
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
          </View>

          {/* Category Name */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Category Name</ThemedText>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Subscriptions"
              placeholderTextColor={placeholderColor}
              autoFocus
            />
          </View>

          {/* Icon & Color Row */}
          <View style={styles.row}>
            {/* Icon Selector */}
            <View style={[styles.section, styles.halfSection]}>
              <ThemedText style={styles.label}>Icon</ThemedText>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowIconPicker(true)}
              >
                <View style={[styles.selectorIcon, { backgroundColor: color }]}>
                  <Ionicons
                    name={icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color="#fff"
                  />
                </View>
                <ThemedText style={styles.selectorText}>Change</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Color Selector */}
            <View style={[styles.section, styles.halfSection]}>
              <ThemedText style={styles.label}>Color</ThemedText>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowColorPicker(true)}
              >
                <View
                  style={[styles.colorPreview, { backgroundColor: color }]}
                />
                <ThemedText style={styles.selectorText}>Change</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modals */}
        <CategoryIconPicker
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelect={setIcon}
          selectedIcon={icon}
          selectedColor={color}
        />

        <ColorPicker
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          onSelect={setColor}
          selectedColor={color}
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
  previewSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  previewName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
    opacity: 0.8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.6,
    marginBottom: 8,
  },
  textInput: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    fontSize: 16,
  },
  typeToggle: {
    flexDirection: "row",
    gap: 12,
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
  selector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    gap: 10,
  },
  selectorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
