import FadeIn from "@/components/FadeIn";
import FlatButton from "@/components/FlatButton";
import FlatInput from "@/components/FlatInput";
import SlideIn from "@/components/SlideIn";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { aiService } from "@/services/api";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatScreen = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your AI Fitness Coach. What are your fitness goals today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useState(new Animated.Value(0))[0];

  // Animate typing indicator
  const animateTyping = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    animateTyping();

    try {
      // Call the AI service to get response
      const aiResponseText = await aiService.getAIResponse(inputText);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Fallback response in case of error
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an issue processing your request. Could you please try again?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
      typingAnimation.stopAnimation();

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const TypingIndicator = () => {
    const dot1Opacity = typingAnimation;
    const dot2Opacity = typingAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    });
    const dot3Opacity = typingAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.3, 1],
    });

    return (
      <View style={styles.typingContainer}>
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.typingIndicator}>
            <Animated.View
              style={[
                styles.typingDot,
                {
                  backgroundColor: colors.textSecondary,
                  opacity: dot1Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  backgroundColor: colors.textSecondary,
                  opacity: dot2Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  backgroundColor: colors.textSecondary,
                  opacity: dot3Opacity,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <FadeIn delay={100}>
        <View
          style={[
            styles.messageContainer,
            {
              alignItems: isUser ? "flex-end" : "flex-start",
              marginBottom: Spacing.md,
            },
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isUser
                  ? colors.primary
                  : colors.cardBackground,
                borderBottomLeftRadius: isUser ? BorderRadius.xxl : 0,
                borderBottomRightRadius: isUser ? 0 : BorderRadius.xxl,
              },
            ]}
          >
            {isUser ? (
              <Text style={[styles.messageText, { color: colors.background }]}>
                {item.text}
              </Text>
            ) : (
              <Markdown
                style={{
                  body: {
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 22,
                  },
                  heading1: {
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                  },
                  heading2: {
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 8,
                  },
                  heading3: {
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 6,
                  },
                  em: {
                    fontStyle: "italic",
                  },
                  strong: {
                    fontWeight: "bold",
                  },
                  list_item: {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginVertical: 2,
                  },
                  bullet_list_icon: {
                    marginLeft: 10,
                    marginRight: 10,
                  },
                  ordered_list_icon: {
                    marginLeft: 10,
                    marginRight: 10,
                  },
                  code_inline: {
                    backgroundColor: colors.surface,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontFamily: "monospace",
                  },
                  code_block: {
                    backgroundColor: colors.surface,
                    padding: 10,
                    borderRadius: 8,
                    fontFamily: "monospace",
                    marginVertical: 10,
                  },
                  table: {
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    marginVertical: 10,
                  },
                  tr: {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                  th: {
                    fontWeight: "bold",
                    padding: 8,
                    backgroundColor: colors.surface,
                  },
                  td: {
                    padding: 8,
                  },
                }}
              >
                {item.text}
              </Markdown>
            )}
          </View>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </FadeIn>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <FadeIn delay={200}>
          <TypingIndicator />
        </FadeIn>
      )}

      <SlideIn direction="up" delay={200}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <FlatInput
            placeholder="Ask about workouts, nutrition, or motivation..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            inputStyle={{ marginBottom: 0 }}
          />
          <FlatButton
            title="Send"
            onPress={handleSend}
            disabled={inputText.trim() === "" || isLoading}
            loading={isLoading}
            style={styles.sendButton}
          />
        </View>
      </SlideIn>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add paddingBottom to ensure content doesn't go behind the tab bar
    paddingBottom: 80,
  },
  chatContainer: {
    padding: Spacing.lg,
  },
  messageContainer: {
    maxWidth: "90%",
    marginVertical: Spacing.sm,
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xxl,
    marginVertical: Spacing.xs,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: Spacing.xs,
    marginHorizontal: Spacing.sm,
  },
  typingContainer: {
    alignItems: "flex-start",
    marginVertical: Spacing.sm,
    maxWidth: "90%",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: Spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: Spacing.md,
    minWidth: 80,
  },
});

export default ChatScreen;
