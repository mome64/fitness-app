import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import FlatDropdown from "@/components/FlatDropdown";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { aiService } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SettingsScreen = () => {
  const { colors } = useTheme();
  const [provider, setProvider] = useState<
    "openai" | "gemini" | "groq" | "mock"
  >("mock");
  const [apiKey, setApiKey] = useState("");
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedProvider = await AsyncStorage.getItem("ai_provider");
      const savedApiKey = await AsyncStorage.getItem("ai_api_key");

      if (savedProvider) {
        setProvider(savedProvider as "openai" | "gemini" | "groq" | "mock");
      }

      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("ai_provider", provider);
      await AsyncStorage.setItem("ai_api_key", apiKey);

      // Configure the AI service
      if (provider !== "mock" && apiKey) {
        aiService.setApiKey(apiKey, provider);
      }

      Alert.alert(
        "Success",
        "Settings saved successfully! The app will now use real AI responses when available."
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const testConnection = async () => {
    if (provider === "mock") {
      Alert.alert("Test Result", "Mock provider is always available.");
      return;
    }

    if (!apiKey) {
      Alert.alert(
        "Validation Error",
        "Please enter an API key to test the connection."
      );
      return;
    }

    setTestStatus("testing");

    try {
      // Configure the AI service temporarily for testing
      aiService.setApiKey(apiKey, provider);

      // Test with a simple request
      const testMessage = await aiService.getMotivationalMessage();

      if (testMessage) {
        setTestStatus("success");
        Alert.alert(
          "Test Successful",
          "Connection to the AI provider is working! Real AI responses will now be used."
        );
      } else {
        setTestStatus("error");
        Alert.alert(
          "Test Failed",
          "Unable to get a response from the AI provider."
        );
      }
    } catch (error) {
      setTestStatus("error");
      console.error("Test connection error:", error);
      Alert.alert(
        "Test Failed",
        "Failed to connect to the AI provider. Please check your API key and network connection."
      );
    }
  };

  const providers = [
    { label: "Mock (Demo Mode)", value: "mock" },
    { label: "OpenAI (GPT)", value: "openai" },
    { label: "Google Gemini", value: "gemini" },
    { label: "Groq", value: "groq" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AI Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Configure your AI provider and API key
        </Text>
      </View>

      <FlatCard style={styles.card}>
        <FlatDropdown
          label="AI Provider"
          placeholder="Select AI provider"
          value={provider}
          onValueChange={(value) =>
            setProvider(value as "openai" | "gemini" | "groq" | "mock")
          }
          items={providers}
        />

        {provider !== "mock" && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>API Key</Text>
            <View
              style={[
                styles.apiKeyInputContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderRadius: BorderRadius.xxl,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <TextInput
                style={[styles.apiKeyInput, { color: colors.text }]}
                placeholder={`Enter your ${providers.find((p) => p.value === provider)?.label.split(" ")[0]} API key`}
                placeholderTextColor={colors.textSecondary}
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry={true}
              />
            </View>
          </View>
        )}

        {provider !== "mock" && (
          <View style={styles.testContainer}>
            <FlatButton
              title="Test Connection"
              onPress={testConnection}
              disabled={testStatus === "testing"}
              loading={testStatus === "testing"}
              variant="outline"
              style={styles.testButton}
            />
            {testStatus === "success" && (
              <Text style={[styles.successText, { color: colors.success }]}>
                ✓ Connection successful
              </Text>
            )}
            {testStatus === "error" && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                ✗ Connection failed
              </Text>
            )}
          </View>
        )}

        <FlatButton
          title="Save Settings"
          onPress={saveSettings}
          style={styles.saveButton}
        />
      </FlatCard>

      <FlatCard style={styles.infoCard}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Information
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {provider === "mock"
            ? "In mock mode, the app uses sample data for demonstration purposes."
            : "Enter your API key to enable real AI-powered features. Your key is stored securely on your device."}
        </Text>

        {provider !== "mock" && (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              Tips:
            </Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>
              • Never share your API keys with others
            </Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>
              • Keep your API keys secure and private
            </Text>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>
              • Monitor your API usage to avoid unexpected charges
            </Text>
          </View>
        )}
      </FlatCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
  },
  card: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  inputContainer: {
    marginVertical: Spacing.sm,
  },
  label: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  apiKeyInputContainer: {
    borderWidth: 1,
  },
  apiKeyInput: {
    padding: Spacing.md,
    fontSize: Typography.body.fontSize,
    minHeight: 50,
  },
  testContainer: {
    marginVertical: Spacing.md,
    alignItems: "center",
  },
  testButton: {
    minWidth: 150,
  },
  successText: {
    ...Typography.body,
    marginTop: Spacing.sm,
    fontWeight: "600",
  },
  errorText: {
    ...Typography.body,
    marginTop: Spacing.sm,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: Spacing.md,
  },
  infoCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.md,
  },
  infoText: {
    ...Typography.body,
  },
  tipsContainer: {
    marginTop: Spacing.lg,
  },
  tipsTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.sm,
  },
  tip: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
});

export default SettingsScreen;
