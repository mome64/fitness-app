import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: object;
  animated?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = 20,
  style,
  animated = true,
}) => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animated) {
      const animate = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animate();

      return () => {
        opacityAnim.stopAnimation();
      };
    }
  }, [animated, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: colors.border,
          borderRadius: BorderRadius.sm,
          opacity: animated ? opacityAnim : 0.5,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: Spacing.xs,
  },
});

export default LoadingSkeleton;
