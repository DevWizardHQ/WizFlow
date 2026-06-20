/**
 * Backup & Restore main screen
 */

import { Button } from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { useSettings } from "@/contexts/SettingsContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { packageAndShareBackup } from "@/services/backupService";
import { pickBackupFile, restoreBackup } from "@/services/restoreService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BackupScreen() {
  const [isRestoring, setIsRestoring] = useState(false);
  const { settings, updateSetting } = useSettings();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

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
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Backup & Restore
        </ThemedText>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Hero Header */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroIconBackground,
              { backgroundColor: "rgba(10, 126, 164, 0.1)" },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud-sync"
              size={54}
              color={tintColor}
            />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.heroTitle}>
            Data Portability
          </ThemedText>
          <ThemedText style={styles.heroDescription}>
            Keep your financial logs safe. Export backups locally or restore
            files from your cloud storage.
          </ThemedText>
        </View>

        {/* Create Backup Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "rgba(76, 175, 80, 0.12)" },
              ]}
            >
              <MaterialCommunityIcons
                name="database-export"
                size={22}
                color="#4CAF50"
              />
            </View>
            <View style={styles.cardTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Backup Data
              </ThemedText>
              {settings.lastBackupDate ? (
                <ThemedText style={styles.lastBackupText}>
                  Last saved:{" "}
                  {format(new Date(settings.lastBackupDate), "PPpp")}
                </ThemedText>
              ) : (
                <ThemedText style={styles.lastBackupText}>
                  No backups saved yet
                </ThemedText>
              )}
            </View>
          </View>

          <ThemedText style={styles.description}>
            Creates a secure archive of all your accounts, transactions, and
            preferences. You can share this file or store it anywhere.
          </ThemedText>

          <Button
            title="Create Backup File"
            onPress={handleBackup}
            icon="archive-arrow-down"
            style={styles.button}
          />
        </View>

        {/* Restore Backup Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "rgba(244, 67, 54, 0.12)" },
              ]}
            >
              <MaterialCommunityIcons
                name="database-import"
                size={22}
                color="#F44336"
              />
            </View>
            <View style={styles.cardTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Restore Data
              </ThemedText>
              <ThemedText
                style={[styles.lastBackupText, styles.destructiveText]}
              >
                Replaces current data
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.description}>
            Import and restore your database from a previously generated backup
            file. This will permanently overwrite current records.
          </ThemedText>

          <View style={styles.warningContainer}>
            <Ionicons
              name="warning"
              size={16}
              color="#FF9800"
              style={styles.warningIcon}
            />
            <ThemedText style={styles.warningText}>
              Warning: This action is destructive and cannot be undone.
            </ThemedText>
          </View>

          <Button
            title="Restore from File"
            onPress={handleRestore}
            icon="archive-arrow-up"
            loading={isRestoring}
            variant="secondary"
            style={styles.button}
          />
        </View>

        {/* Information Grid */}
        <View style={styles.infoSection}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            Privacy & Security
          </ThemedText>
          <View style={styles.infoRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#4CAF50"
            />
            <ThemedText style={styles.infoText}>
              WizFlow operates entirely locally. Your data and backups are never
              sent to external servers.
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="extension-puzzle-outline"
              size={20}
              color={tintColor}
            />
            <ThemedText style={styles.infoText}>
              Backups include custom categories, icons, colors, account details,
              and full transaction history.
            </ThemedText>
          </View>
        </View>
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
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerPlaceholder: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroIconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.6,
    paddingHorizontal: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(128, 128, 128, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.12)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  lastBackupText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  destructiveText: {
    color: "#F44336",
    fontWeight: "600",
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
    marginBottom: 16,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 152, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.15)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#E67E22",
    fontWeight: "500",
    lineHeight: 16,
  },
  button: {
    width: "100%",
  },
  infoSection: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.1)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
    marginLeft: 12,
  },
});
