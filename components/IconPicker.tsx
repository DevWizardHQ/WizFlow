/**
 * IconPicker - Icon selection grid modal
 */

import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

// Curated list of icons for accounts
const ACCOUNT_ICONS = [
  // Money & Finance
  "wallet",
  "cash",
  "card",
  "business",
  "briefcase",
  // Banks & Institutions
  "home",
  "storefront",
  "globe",
  "server",
  // Investment & Growth
  "trending-up",
  "bar-chart",
  "stats-chart",
  "pie-chart",
  // Savings & Goals
  "shield-checkmark",
  "diamond",
  "star",
  "trophy",
  // Digital & Crypto
  "logo-bitcoin",
  "phone-portrait",
  "laptop",
  "desktop",
  // Travel & Transport
  "airplane",
  "car",
  "boat",
  "train",
  // Shopping
  "cart",
  "bag",
  "gift",
  "pricetag",
  // Other
  "people",
  "person",
  "heart",
  "cube",
];

interface IconPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  selectedIcon?: string;
  selectedColor?: string;
}

export function IconPicker({
  visible,
  onClose,
  onSelect,
  selectedIcon,
  selectedColor = "#4CAF50",
}: IconPickerProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleSelect = (icon: string) => {
    onSelect(icon);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Select Icon</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.grid}>
          {ACCOUNT_ICONS.map((icon) => (
            <Pressable
              key={icon}
              style={[
                styles.iconItem,
                selectedIcon === icon && styles.selectedItem,
              ]}
              onPress={() => handleSelect(icon)}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      selectedIcon === icon
                        ? selectedColor
                        : "rgba(128, 128, 128, 0.1)",
                  },
                ]}
              >
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={selectedIcon === icon ? "#fff" : textColor}
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.3)",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "flex-start",
  },
  iconItem: {
    width: "20%",
    aspectRatio: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedItem: {
    // Selected styling handled by iconContainer
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
