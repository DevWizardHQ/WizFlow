/**
 * DatePickerButton - Date selection component using native date picker
 */

import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface DatePickerButtonProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export function DatePickerButton({
  value,
  onChange,
  label = "Date",
}: DatePickerButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleConfirm = () => {
    setShowPicker(false);
  };

  const formattedDate = format(value, "MMM dd, yyyy");
  const isToday =
    format(value, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={textColor}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <ThemedText style={styles.value}>
            {isToday ? "Today" : formattedDate}
          </ThemedText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={textColor}
          style={{ opacity: 0.5 }}
        />
      </TouchableOpacity>

      {showPicker && Platform.OS === "ios" && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={[styles.modalContent, { backgroundColor }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle">Select Date</ThemedText>
                <TouchableOpacity onPress={handleConfirm}>
                  <ThemedText style={styles.doneButton}>Done</ThemedText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={new Date()}
              />
            </ThemedView>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  icon: {
    marginRight: 12,
    opacity: 0.7,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.3)",
  },
  cancelButton: {
    color: "#FF6B6B",
    fontSize: 16,
  },
  doneButton: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
});
