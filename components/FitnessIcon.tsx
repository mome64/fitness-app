import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FitnessIconProps {
  icon: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const FitnessIcon: React.FC<FitnessIconProps> = ({
  icon,
  label,
  size = "md",
  color,
}) => {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case "sm":
        return { iconSize: 24, textSize: Typography.bodySmall.fontSize };
      case "lg":
        return { iconSize: 48, textSize: Typography.body.fontSize };
      default:
        return { iconSize: 32, textSize: Typography.body.fontSize };
    }
  };

  const { iconSize, textSize } = getSize();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            width: iconSize,
            height: iconSize,
            backgroundColor: colors.primaryLight,
            borderRadius: iconSize / 2,
          },
        ]}
      >
        <Text
          style={[
            styles.icon,
            {
              fontSize: iconSize * 0.6,
              color: color || colors.primary,
              lineHeight: iconSize * 0.6,
            },
          ]}
        >
          {icon}
        </Text>
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: textSize,
              marginTop: Spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontWeight: "bold",
  },
  label: {
    ...Typography.bodySmall,
  },
});

export default FitnessIcon;
