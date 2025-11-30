import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

interface OnboardingIllustrationProps {
  type: "welcome" | "workout" | "nutrition";
}

const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  type,
}) => {
  const { colors } = useTheme();

  const renderIllustration = () => {
    switch (type) {
      case "welcome":
        return (
          <View
            style={[
              styles.illustrationContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <View
              style={[styles.circle, { backgroundColor: colors.primary }]}
            />
            <View
              style={[styles.rectangle, { backgroundColor: colors.secondary }]}
            />
            <View
              style={[styles.triangle, { borderBottomColor: colors.accent }]}
            />
          </View>
        );
      case "workout":
        return (
          <View
            style={[
              styles.illustrationContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <View
              style={[styles.dumbbell, { backgroundColor: colors.primary }]}
            />
            <View
              style={[
                styles.dumbbell,
                {
                  backgroundColor: colors.secondary,
                  transform: [{ rotate: "45deg" }],
                },
              ]}
            />
            <View style={[styles.person, { backgroundColor: colors.accent }]} />
          </View>
        );
      case "nutrition":
        return (
          <View
            style={[
              styles.illustrationContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <View style={[styles.apple, { backgroundColor: colors.primary }]} />
            <View
              style={[styles.leaf, { backgroundColor: colors.secondary }]}
            />
            <View style={[styles.plate, { backgroundColor: colors.accent }]} />
          </View>
        );
      default:
        return null;
    }
  };

  return renderIllustration();
};

const styles = StyleSheet.create({
  illustrationContainer: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.xxl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
  },
  rectangle: {
    width: 100,
    height: 40,
    position: "absolute",
    top: 30,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 50,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    position: "absolute",
    bottom: 30,
  },
  dumbbell: {
    width: 100,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    top: 60,
  },
  person: {
    width: 60,
    height: 80,
    borderRadius: 30,
    position: "absolute",
    bottom: 40,
  },
  apple: {
    width: 60,
    height: 70,
    borderRadius: 30,
    position: "absolute",
    top: 40,
  },
  leaf: {
    width: 30,
    height: 40,
    borderRadius: 15,
    position: "absolute",
    top: 20,
    right: 40,
    transform: [{ rotate: "30deg" }],
  },
  plate: {
    width: 100,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 50,
  },
});

export default OnboardingIllustration;
