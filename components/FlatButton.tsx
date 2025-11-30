import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FlatButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  fullWidth?: boolean;
}

const FlatButton: React.FC<FlatButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.secondary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case "primary":
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return {
          color: colors.primary,
        };
      default:
        return {
          color: colors.background,
        };
    }
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.button,
        getButtonStyle(),
        {
          borderRadius: BorderRadius.xxl,
          opacity: disabled || loading ? 0.5 : opacityValue,
          transform: [{ scale: scaleValue }],
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              color={variant === "outline" ? colors.primary : colors.background}
              size="small"
            />
          </View>
        ) : (
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0, // No shadow for flat design
    shadowOpacity: 0, // No shadow for flat design
    shadowRadius: 0,
    minHeight: 50,
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    ...Typography.button,
  },
  loadingContainer: {
    paddingVertical: Spacing.xs,
  },
});

export default FlatButton;
