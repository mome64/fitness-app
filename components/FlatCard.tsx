import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

interface FlatCardProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: object;
}

const FlatCard: React.FC<FlatCardProps> = ({
  title,
  subtitle,
  onPress,
  children,
  style,
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: onPress ? 0.98 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacityValue, {
        toValue: onPress ? 0.9 : 1,
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
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderRadius: BorderRadius.xxl,
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {title && (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    elevation: 0, // No shadow for flat design
    shadowOpacity: 0, // No shadow for flat design
    shadowRadius: 0,
  },
  touchable: {
    flex: 1,
  },
  title: {
    ...Typography.heading2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    marginBottom: Spacing.sm,
  },
});

export default FlatCard;
