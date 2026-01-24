/**
 * Backup & Restore main screen
 */

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/Button";
import { packageAndShareBackup } from "@/services/backupService";
import { pickBackupFile, restoreBackup } from "@/services/restoreService";
import { useSettings } from "@/contexts/SettingsContext";
import { format } from "date-fns";

export default function BackupScreen() {
  const [isRestoring, setIsRestoring] = useState(false);
  const { settings, updateSetting } = useSettings();

  const handleBackup = async () => {
    try {
      await packageAndShareBackup();
      updateSetting("lastBackupDate", new Date().toISOString());
    } catch (error) {
      console.error("Backup failed:", error);
      Alert.alert(
        "Backup Failed",
        "Could not create or share the backup file.",
      );
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      "Confirm Restore",
      "Restoring from a backup will delete all your current data. Are you sure you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: async () => {
            setIsRestoring(true);
            try {
              const backupUri = await pickBackupFile();
              if (backupUri) {
                await restoreBackup(backupUri);
                Alert.alert(
                  "Restore Complete",
                  "Your data has been successfully restored.",
                );
              }
            } catch (error) {
              console.error("Restore failed:", error);
              Alert.alert(
                "Restore Failed",
                "Could not restore data from the selected file.",
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Backup & Restore
      </ThemedText>
      <View style={styles.card}>
        <View style={styles.backupInfo}>
          <ThemedText type="subtitle">Create a Backup</ThemedText>
          {settings.lastBackupDate && (
            <ThemedText style={styles.lastBackupText}>
              Last backup: {format(new Date(settings.lastBackupDate), "PPpp")}
            </ThemedText>
          )}
        </View>
        <ThemedText style={styles.description}>
          Create a full backup of your data, including accounts, transactions,
          and settings. You can use this file to restore your data on any
          device.
        </ThemedText>
        <Button
          title="Create Backup"
          onPress={handleBackup}
          icon="archive-box-arrow-down"
        />
      </View>

      <View style={[styles.card, styles.restoreCard]}>
        <ThemedText type="subtitle">Restore from Backup</ThemedText>
        <ThemedText style={styles.description}>
          Restore your data from a previously created backup file. This will
          overwrite all existing data.
        </ThemedText>
        <Button
          title="Restore from Backup"
          onPress={handleRestore}
          icon="archive-box-arrow-up"
          loading={isRestoring}
          variant="secondary"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.8,
  },
  restoreCard: {
    marginTop: 20,
  },
  backupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  lastBackupText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
