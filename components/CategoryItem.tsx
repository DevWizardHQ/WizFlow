/**
 * CategoryItem - Single category row in list
 */

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Category } from "@/types";

interface CategoryItemProps {
  category: Category;
  onPress?: (category: Category) => void;
}

export function CategoryItem({ category, onPress }: CategoryItemProps) {
  const textColor = useThemeColor({}, "text");
  const isDefault = category.is_custom === 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(category)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#fff"
        />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.name}>{category.name}</ThemedText>
        {isDefault && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>Default</ThemedText>
          </View>
        )}
      </View>

      {!isDefault && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={textColor}
          style={{ opacity: 0.4 }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "rgba(128, 128, 128, 0.15)",
  },
  badgeText: {
    fontSize: 11,
    opacity: 0.6,
  },
});
