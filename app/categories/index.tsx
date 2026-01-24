/**
 * Categories Management Screen
 */

import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from '@/components/themed-view';
import { CategorySection } from "@/components/CategorySection";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getCategoriesByType } from "@/database";
import type { Category, CategoryType } from "@/types";

export default function CategoriesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(() => {
    setExpenseCategories(getCategoriesByType("expense"));
    setIncomeCategories(getCategoriesByType("income"));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const handleCategoryPress = (category: Category) => {
    // Only allow editing custom categories
    if (category.is_custom === 1) {
      router.push(`/categories/${category.id}`);
    }
  };

  const handleAddCategory = (type: CategoryType) => {
    router.push(`/categories/add?type=${type}`);
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
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle">Categories</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedText style={styles.description}>
          Manage your transaction categories. Default categories cannot be
          edited or deleted.
        </ThemedText>

        <CategorySection
          title="Expense Categories"
          type="expense"
          categories={expenseCategories}
          onCategoryPress={handleCategoryPress}
          onAddPress={handleAddCategory}
        />

        <CategorySection
          title="Income Categories"
          type="income"
          categories={incomeCategories}
          onCategoryPress={handleCategoryPress}
          onAddPress={handleAddCategory}
        />
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
    borderBottomColor: "rgba(128, 128, 128, 0.3)",
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 20,
    lineHeight: 20,
  },
});
