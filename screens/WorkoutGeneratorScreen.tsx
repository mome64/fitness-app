import FadeIn from "@/components/FadeIn";
import FitnessIcon from "@/components/FitnessIcon";
import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import FlatDropdown from "@/components/FlatDropdown";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SlideIn from "@/components/SlideIn";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { aiService } from "@/services/api";
import { storageService, UserProfile } from "@/services/storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const WorkoutGeneratorScreen = () => {
  const { colors } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      setUserProfile(profile);
      // Pre-fill form with user's existing preferences if available
      if (profile?.goal) setGoal(profile.goal);
      if (profile?.experienceLevel) setExperience(profile.experienceLevel);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const goals = [
    { label: "Weight Loss", value: "weight_loss" },
    { label: "Muscle Gain", value: "muscle_gain" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Endurance", value: "endurance" },
    { label: "Strength", value: "strength" },
  ];

  const experienceLevels = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  const handleGeneratePlan = async () => {
    if (!goal || !experience) {
      setError("Please select both a goal and experience level");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save user preferences
      await storageService.updateUserProfile({
        goal,
        experienceLevel: experience,
      });

      // Call the AI service to generate workout plan
      const plan = await aiService.generateWorkoutPlan(goal, experience);

      setWorkoutPlan({
        ...plan,
        goal: goals.find((g) => g.value === goal)?.label,
        experience: experienceLevels.find((e) => e.value === experience)?.label,
      });
    } catch (error) {
      console.error("Error generating workout plan:", error);
      setError("Failed to generate workout plan. Please try again.");
      // Fallback to sample plan in case of error
      const samplePlan = {
        title: "3-Day Full Body Workout",
        goal: goals.find((g) => g.value === goal)?.label,
        experience: experienceLevels.find((e) => e.value === experience)?.label,
        days: [
          {
            day: "Monday - Full Body Strength",
            exercises: [
              { name: "Push-ups", sets: 3, reps: "10-15", rest: "60s" },
              {
                name: "Bodyweight Squats",
                sets: 3,
                reps: "15-20",
                rest: "60s",
              },
              { name: "Plank", sets: 3, duration: "30-60s", rest: "60s" },
              { name: "Lunges", sets: 3, reps: "10 each leg", rest: "60s" },
            ],
          },
          {
            day: "Wednesday - Cardio & Core",
            exercises: [
              {
                name: "Jumping Jacks",
                sets: 3,
                duration: "1 min",
                rest: "30s",
              },
              {
                name: "Mountain Climbers",
                sets: 3,
                duration: "30s",
                rest: "30s",
              },
              { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "30s" },
              { name: "Russian Twists", sets: 3, reps: "20", rest: "30s" },
              { name: "20-min Walk/Jog", sets: 1, duration: "20 minutes" },
            ],
          },
          {
            day: "Friday - Upper/Lower Split",
            exercises: [
              { name: "Tricep Dips", sets: 3, reps: "8-12", rest: "60s" },
              { name: "Glute Bridges", sets: 3, reps: "15-20", rest: "60s" },
              { name: "Superman", sets: 3, reps: "15", rest: "60s" },
              {
                name: "Side Planks",
                sets: 2,
                duration: "30s each side",
                rest: "60s",
              },
            ],
          },
        ],
        tips: [
          "Warm up for 5-10 minutes before each workout",
          "Stay hydrated throughout your training session",
          "Focus on proper form over speed or quantity",
          "Rest at least one day between strength workouts",
        ],
      };
      setWorkoutPlan(samplePlan);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutPlan = () => {
    if (!workoutPlan) return null;

    return (
      <FadeIn delay={300}>
        <FlatCard style={styles.planCard}>
          <Text style={[styles.planTitle, { color: colors.text }]}>
            {workoutPlan.title}
          </Text>
          <Text style={[styles.planSubtitle, { color: colors.textSecondary }]}>
            Goal: {workoutPlan.goal} | Level: {workoutPlan.experience}
          </Text>

          {workoutPlan.days.map((day: any, index: number) => (
            <SlideIn key={index} direction="up" delay={400 + index * 100}>
              <View style={styles.daySection}>
                <Text style={[styles.dayTitle, { color: colors.text }]}>
                  {day.day}
                </Text>
                {day.exercises.map((exercise: any, exIndex: number) => (
                  <View
                    key={exIndex}
                    style={[
                      styles.exerciseCard,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <View style={styles.exerciseHeader}>
                      <Text
                        style={[styles.exerciseName, { color: colors.text }]}
                      >
                        {exercise.name}
                      </Text>
                      <View
                        style={[
                          styles.chip,
                          { backgroundColor: colors.primaryLight },
                        ]}
                      >
                        <Text
                          style={[styles.chipText, { color: colors.primary }]}
                        >
                          {exercise.sets} sets
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.exerciseDetails,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {exercise.reps || exercise.duration}{" "}
                      {exercise.rest ? `| Rest: ${exercise.rest}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            </SlideIn>
          ))}

          <View style={[styles.tipsSection, { borderColor: colors.border }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              Pro Tips
            </Text>
            {workoutPlan.tips &&
              workoutPlan.tips.map((tip: string, index: number) => (
                <View key={index} style={styles.tipItem}>
                  <Text
                    style={[styles.tipText, { color: colors.textSecondary }]}
                  >
                    • {tip}
                  </Text>
                </View>
              ))}
          </View>
        </FlatCard>
      </FadeIn>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <FadeIn delay={100}>
        <View style={styles.header}>
          <FitnessIcon icon="💪" size="lg" />
          <Text style={[styles.title, { color: colors.text }]}>
            Workout Generator
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create a personalized workout plan based on your goals
        </Text>
      </FadeIn>

      <SlideIn direction="up" delay={200}>
        <FlatCard style={styles.inputCard}>
          <FlatDropdown
            label="Fitness Goal"
            placeholder="Select your goal"
            value={goal}
            onValueChange={setGoal}
            items={goals}
          />

          <FlatDropdown
            label="Experience Level"
            placeholder="Select your experience level"
            value={experience}
            onValueChange={setExperience}
            items={experienceLevels}
          />

          {error ? (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {error}
            </Text>
          ) : null}

          <FlatButton
            title="Generate My Plan"
            onPress={handleGeneratePlan}
            disabled={!goal || !experience || loading}
            loading={loading}
            style={styles.generateButton}
          />
        </FlatCard>
      </SlideIn>

      {loading ? (
        <SlideIn direction="up" delay={300}>
          <FlatCard>
            <LoadingSkeleton height={20} style={{ marginBottom: Spacing.sm }} />
            <LoadingSkeleton height={20} style={{ marginBottom: Spacing.sm }} />
            <LoadingSkeleton height={20} style={{ marginBottom: Spacing.sm }} />
            <LoadingSkeleton height={100} />
          </FlatCard>
        </SlideIn>
      ) : (
        renderWorkoutPlan()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    // Add paddingBottom to ensure content doesn't go behind the tab bar
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.heading1,
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  inputCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  generateButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.bodySmall,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  planCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  planTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.xs,
  },
  planSubtitle: {
    ...Typography.bodySmall,
    marginBottom: Spacing.lg,
  },
  daySection: {
    marginBottom: Spacing.lg,
  },
  dayTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  exerciseCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  exerciseName: {
    ...Typography.body,
    fontWeight: "600",
  },
  chip: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chipText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  exerciseDetails: {
    ...Typography.bodySmall,
  },
  tipsSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  tipsTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  tipItem: {
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...Typography.bodySmall,
  },
});

export default WorkoutGeneratorScreen;
