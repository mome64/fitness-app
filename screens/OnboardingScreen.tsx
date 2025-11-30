import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import OnboardingIllustration from "@/components/OnboardingIllustration";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  illustrationType: "welcome" | "workout" | "nutrition";
}

const OnboardingScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: "Welcome to AI Fitness Coach",
      description:
        "Your personal AI-powered fitness companion that creates customized workout and nutrition plans.",
      illustrationType: "welcome",
    },
    {
      id: 2,
      title: "Personalized Workouts",
      description:
        "Get workout plans tailored to your fitness level, goals, and available equipment.",
      illustrationType: "workout",
    },
    {
      id: 3,
      title: "Smart Nutrition",
      description:
        "Receive meal plans based on your dietary preferences and ingredients you have at home.",
      illustrationType: "nutrition",
    },
  ];

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      // Animate transition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentSlide(currentSlide + 1);
        slideAnim.setValue(width);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Complete onboarding and navigate to the main app
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <FlatButton
        title="Skip"
        onPress={handleSkip}
        variant="secondary"
        style={styles.skipButton}
      />

      {/* Slides */}
      <View style={styles.slidesContainer}>
        <Animated.View
          style={[
            styles.slide,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <OnboardingIllustration
            type={slides[currentSlide].illustrationType}
          />
          <FlatCard style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>
              {slides[currentSlide].title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {slides[currentSlide].description}
            </Text>
          </FlatCard>
        </Animated.View>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentSlide ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Continue button */}
      <View style={styles.buttonContainer}>
        <FlatButton
          title={
            currentSlide === slides.length - 1 ? "Get Started" : "Continue"
          }
          onPress={handleContinue}
          fullWidth={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xxl,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginRight: Spacing.md,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    alignItems: "center",
    width: width * 0.8,
  },
  card: {
    width: "100%",
    alignItems: "center",
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.heading2,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: Spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});

export default OnboardingScreen;
