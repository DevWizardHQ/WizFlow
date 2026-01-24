import React from "react";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  loading?: boolean;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  icon,
  loading,
  variant = "primary",
  disabled,
  style,
}: ButtonProps) {
  const backgroundColor = useThemeColor({}, variant);
  const color = useThemeColor({}, "buttonText");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        (pressed || disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={color}
              style={styles.icon}
            />
          )}
          <ThemedText style={[styles.text, { color }]}>{title}</ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.7,
  },
});
