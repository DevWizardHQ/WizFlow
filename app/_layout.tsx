import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, useColorScheme as useSystemColorScheme } from "react-native";
import "react-native-reanimated";
import * as SQLite from "expo-sqlite";

import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { runMigrations, seedDatabase } from "@/database";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { settings, loading } = useSettings();
  const systemColorScheme = useSystemColorScheme();

  if (loading) {
    return null;
  }

  const effectiveTheme =
    settings.theme === "system" ? systemColorScheme : settings.theme;

  const isDark = effectiveTheme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Pre-open database asynchronously on web to warm up worker and compile WASM
        if (Platform.OS === "web") {
          await SQLite.openDatabaseAsync("wizflow.db");
        }
        // Initialize database
        runMigrations();
        seedDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  // Don't render until database is ready
  if (!isDbReady) {
    return null;
  }

  return (
    <SettingsProvider>
      <RootLayoutNav />
    </SettingsProvider>
  );
}
