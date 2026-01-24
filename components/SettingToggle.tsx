import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Switch } from "react-native";
import { SettingItem } from "./SettingItem";

interface SettingToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function SettingToggle({
  label,
  value,
  onValueChange,
  icon,
}: SettingToggleProps) {
  const activeColor = useThemeColor({}, "tint");

  return (
    <SettingItem
      label={label}
      icon={icon}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: activeColor }}
          thumbColor={
            Platform.OS === "ios" ? "#fff" : value ? "#fff" : "#f4f3f4"
          }
        />
      }
    />
  );
}
