/**
 * CategorySection - Section with header and list of categories
 */

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { CategoryItem } from "@/components/CategoryItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { Category, CategoryType } from "@/types";

interface CategorySectionProps {
  title: string;
  type: CategoryType;
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  onAddPress?: (type: CategoryType) => void;
}

export function CategorySection({
  title,
  type,
  categories,
  onCategoryPress,
  onAddPress,
}: CategorySectionProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddPress?.(type)}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onPress={onCategoryPress}
          />
        ))}
        {categories.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No categories</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(128, 128, 128, 0.03)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  list: {
    // List container
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
  },
});
