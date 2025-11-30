import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

import { ThemeProvider as CustomThemeProvider } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { aiService } from "@/services/api";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check onboarding status
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      setShowOnboarding(!hasOnboarded);

      // Initialize AI service with saved settings
      const savedProvider = await AsyncStorage.getItem("ai_provider");
      const savedApiKey = await AsyncStorage.getItem("ai_api_key");

      if (savedProvider && savedProvider !== "mock" && savedApiKey) {
        aiService.setApiKey(
          savedApiKey,
          savedProvider as "openai" | "gemini" | "groq"
        );
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  return (
    <CustomThemeProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {showOnboarding ? (
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          )}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: "modal",
              title: "AI Settings",
              headerShown: true,
              headerBackTitle: "Back",
            }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </CustomThemeProvider>
  );
}
