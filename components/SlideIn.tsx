import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  delay?: number;
  style?: object;
  spring?: boolean;
}

const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  distance = 20,
  delay = 0,
  style,
  spring = true,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Set initial position based on direction
    switch (direction) {
      case "up":
        translateY.value = distance;
        break;
      case "down":
        translateY.value = -distance;
        break;
      case "left":
        translateX.value = distance;
        break;
      case "right":
        translateX.value = -distance;
        break;
    }

    // Animate in after delay
    const timeout = setTimeout(() => {
      if (spring) {
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
        scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      } else {
        translateX.value = withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
        translateY.value = withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
        opacity.value = withTiming(1, { duration: 300 });
        scale.value = withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export default SlideIn;
