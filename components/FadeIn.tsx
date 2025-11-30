import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  style?: object;
  spring?: boolean;
  duration?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  style,
  spring = false,
  duration = 500,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (spring) {
        opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      } else {
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.exp),
        });
        translateY.value = withTiming(0, {
          duration,
          easing: Easing.out(Easing.exp),
        });
        scale.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.exp),
        });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export default FadeIn;
