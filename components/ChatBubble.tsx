import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ChatBubbleProps {
  text: string;
  isUser?: boolean;
  timestamp?: string;
  style?: object;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  isUser = false,
  timestamp,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: isUser ? "flex-end" : "flex-start",
        },
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.primary : colors.cardBackground,
            borderBottomLeftRadius: isUser ? BorderRadius.lg : 0,
            borderBottomRightRadius: isUser ? 0 : BorderRadius.lg,
            borderColor: colors.border,
            borderWidth: isUser ? 0 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isUser ? colors.background : colors.text,
            },
          ]}
        >
          {text}
        </Text>
      </View>
      {timestamp && (
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {timestamp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  bubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    maxWidth: "80%",
  },
  text: {
    ...Typography.body,
  },
  timestamp: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});

export default ChatBubble;
