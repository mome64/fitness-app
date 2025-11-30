import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";

interface FlatInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  inputStyle?: object;
  editable?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const FlatInput: React.FC<FlatInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  editable = true,
  keyboardType = "default",
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useState(new Animated.Value(0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
            backgroundColor: colors.cardBackground,
            borderRadius: BorderRadius.xxl,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    borderWidth: 1,
  },
  input: {
    padding: Spacing.md,
    fontSize: Typography.body.fontSize,
    minHeight: 50,
  },
});

export default FlatInput;
