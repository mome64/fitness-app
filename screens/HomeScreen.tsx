import FitnessIcon from "@/components/FitnessIcon";
import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { aiService } from "@/services/api";
import { storageService, UserProfile } from "@/services/storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserProfile();
    loadMotivationalMessage();

    // Animate progress bars
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMotivationalMessage = async () => {
    try {
      // Get personalized message based on user profile
      const message = await aiService.getMotivationalMessage();
      setMotivationalMessage(message);
    } catch (error) {
      console.error("Error loading motivational message:", error);
      // Generate a personalized fallback message
      const hour = new Date().getHours();
      let timeGreeting = "";
      if (hour < 12) timeGreeting = "Good morning";
      else if (hour < 18) timeGreeting = "Good afternoon";
      else timeGreeting = "Good evening";

      const name = userProfile?.name || "Fitness Enthusiast";
      setMotivationalMessage(
        `${timeGreeting}, ${name}! Ready to crush your fitness goals today?`
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Animated progress bar component
  const ProgressBar = ({
    progress,
    color,
  }: {
    progress: number;
    color: string;
  }) => {
    const width = progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", `${progress}%`],
    });

    return (
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width,
              backgroundColor: color,
              borderRadius: BorderRadius.lg,
            },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSkeleton
          width="60%"
          height={30}
          style={{ marginBottom: Spacing.lg }}
        />
        <LoadingSkeleton
          width="90%"
          height={100}
          style={{ marginBottom: Spacing.lg }}
        />
        <LoadingSkeleton
          width="90%"
          height={80}
          style={{ marginBottom: Spacing.lg }}
        />
        <LoadingSkeleton
          width="90%"
          height={80}
          style={{ marginBottom: Spacing.lg }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {/* Welcome section */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          {getGreeting()}, {userProfile?.name || "there"}!
        </Text>
        <Text style={[styles.welcomeMessage, { color: colors.textSecondary }]}>
          {motivationalMessage}
        </Text>
      </View>

      {/* Stats cards */}
      <FlatCard title="Today's Progress" style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <FitnessIcon icon="👣" label="Steps" size="lg" />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              2,847
            </Text>
          </View>
          <View style={styles.statCard}>
            <FitnessIcon icon="🔥" label="Calories" size="lg" />
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              426
            </Text>
          </View>
          <View style={styles.statCard}>
            <FitnessIcon icon="🎯" label="Goals" size="lg" />
            <Text style={[styles.statValue, { color: colors.accent }]}>
              1/3
            </Text>
          </View>
        </View>
      </FlatCard>

      {/* Daily Goals */}
      <FlatCard title="Daily Goals" style={styles.goalsCard}>
        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>
              Steps
            </Text>
            <Text style={[styles.goalValue, { color: colors.textSecondary }]}>
              2,847 / 8,000
            </Text>
          </View>
          <ProgressBar progress={35.6} color={colors.primary} />
        </View>

        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>
              Calories Burned
            </Text>
            <Text style={[styles.goalValue, { color: colors.textSecondary }]}>
              426 / 600
            </Text>
          </View>
          <ProgressBar progress={71} color={colors.secondary} />
        </View>

        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>
              Workouts
            </Text>
            <Text style={[styles.goalValue, { color: colors.textSecondary }]}>
              1 / 1
            </Text>
          </View>
          <ProgressBar progress={100} color={colors.accent} />
        </View>
      </FlatCard>

      {/* Quick actions */}
      <View style={styles.actionsContainer}>
        <FlatCard title="Quick Actions">
          <View style={styles.actionsRow}>
            <FlatButton
              title="Workout Plan"
              onPress={() => router.push("/workout")}
              style={styles.actionButton}
            />
            <FlatButton
              title="Meal Plan"
              onPress={() => router.push("/meals")}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </FlatCard>
      </View>

      {/* Recent workouts */}
      <FlatCard title="Recent Workouts">
        <Text style={[styles.noData, { color: colors.textSecondary }]}>
          No workouts yet. Generate your first plan!
        </Text>
      </FlatCard>

      {/* Recent meals */}
      <FlatCard title="Recent Meals">
        <Text style={[styles.noData, { color: colors.textSecondary }]}>
          No meals yet. Generate your first meal plan!
        </Text>
      </FlatCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add paddingBottom to ensure content doesn't go behind the tab bar
    paddingBottom: 80,
  },
  welcomeContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  greeting: {
    ...Typography.heading1,
    marginBottom: Spacing.xs,
  },
  welcomeMessage: {
    ...Typography.body,
  },
  statsCard: {
    marginHorizontal: Spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    alignItems: "center",
    padding: Spacing.md,
    flex: 1,
  },
  statValue: {
    ...Typography.heading2,
    marginTop: Spacing.sm,
  },
  statLabel: {
    ...Typography.bodySmall,
  },
  goalsCard: {
    margin: Spacing.md,
  },
  goalItem: {
    marginBottom: Spacing.lg,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  goalTitle: {
    ...Typography.body,
    fontWeight: "500",
  },
  goalValue: {
    ...Typography.bodySmall,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  actionsContainer: {
    marginVertical: Spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  noData: {
    ...Typography.body,
    textAlign: "center",
    padding: Spacing.lg,
  },
});

export default HomeScreen;
