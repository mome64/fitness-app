import FadeIn from "@/components/FadeIn";
import FitnessIcon from "@/components/FitnessIcon";
import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import FlatInput from "@/components/FlatInput";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SlideIn from "@/components/SlideIn";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { aiService } from "@/services/api";
import { storageService, UserProfile } from "@/services/storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const MealPlanScreen = () => {
  const { colors } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      setUserProfile(profile);
      // Pre-fill with user's existing ingredients if available
      if (profile?.availableIngredients) {
        setIngredients(profile.availableIngredients.join(", "));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const dietaryOptions = [
    { label: "No Preference", value: "" },
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Keto", value: "keto" },
    { label: "Gluten-Free", value: "gluten_free" },
    { label: "Low-Carb", value: "low_carb" },
  ];

  const handleGeneratePlan = async () => {
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save user ingredients
      const ingredientList = ingredients.split(",").map((item) => item.trim());
      await storageService.updateUserProfile({
        availableIngredients: ingredientList,
      });

      // Call the AI service to generate meal plan
      const plan = await aiService.generateMealPlan(ingredientList);

      setMealPlan({
        ...plan,
        ingredients: ingredientList,
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setError("Failed to generate meal plan. Please try again.");
      // Fallback to sample plan in case of error
      const samplePlan = {
        ingredients: ingredients.split(",").map((item) => item.trim()),
        meals: [
          {
            name: "Protein-Packed Breakfast",
            calories: 420,
            prepTime: "10 mins",
            ingredients: [
              "Oatmeal",
              "Protein powder",
              "Berries",
              "Almond butter",
            ],
            instructions:
              "Cook oatmeal according to package directions. Stir in protein powder while cooking. Top with berries and a spoonful of almond butter.",
          },
          {
            name: "Grilled Chicken Salad",
            calories: 450,
            prepTime: "15 mins",
            ingredients: [
              "Chicken breast",
              "Mixed greens",
              "Cherry tomatoes",
              "Cucumber",
              "Olive oil",
              "Lemon",
            ],
            instructions:
              "Season chicken breast and grill until cooked through. Slice and serve over mixed greens with tomatoes and cucumber. Drizzle with olive oil and lemon juice.",
          },
          {
            name: "Quinoa & Veggie Bowl",
            calories: 380,
            prepTime: "20 mins",
            ingredients: [
              "Quinoa",
              "Broccoli",
              "Bell peppers",
              "Carrots",
              "Tahini",
              "Lemon",
            ],
            instructions:
              "Cook quinoa according to package directions. Steam broccoli, bell peppers, and carrots. Mix tahini with lemon juice and pour over the bowl.",
          },
        ],
        totalCalories: 1250,
        nutritionFacts: {
          protein: "65g",
          carbs: "85g",
          fat: "35g",
        },
        tips: [
          "Aim to eat protein with each meal to support muscle recovery",
          "Include a variety of colorful vegetables for micronutrients",
          "Stay hydrated throughout the day, especially around workouts",
          "Prep ingredients in advance to save time during the week",
        ],
      };
      setMealPlan(samplePlan);
    } finally {
      setLoading(false);
    }
  };

  const renderMealPlan = () => {
    if (!mealPlan) return null;

    return (
      <>
        <FadeIn delay={300}>
          <FlatCard style={styles.summaryCard}>
            <View style={styles.header}>
              <FitnessIcon icon="🥗" size="lg" />
              <Text style={[styles.planTitle, { color: colors.text }]}>
                Your Personalized Meal Plan
              </Text>
            </View>
            <Text
              style={[styles.planSubtitle, { color: colors.textSecondary }]}
            >
              Based on: {mealPlan.ingredients.join(", ")}
            </Text>

            <View style={styles.nutritionSummary}>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: colors.text }]}>
                  {mealPlan.totalCalories}
                </Text>
                <Text
                  style={[
                    styles.nutritionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Calories
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: colors.text }]}>
                  {mealPlan.nutritionFacts.protein}
                </Text>
                <Text
                  style={[
                    styles.nutritionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Protein
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: colors.text }]}>
                  {mealPlan.nutritionFacts.carbs}
                </Text>
                <Text
                  style={[
                    styles.nutritionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Carbs
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: colors.text }]}>
                  {mealPlan.nutritionFacts.fat}
                </Text>
                <Text
                  style={[
                    styles.nutritionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Fat
                </Text>
              </View>
            </View>
          </FlatCard>
        </FadeIn>

        {mealPlan.meals &&
          mealPlan.meals.map((meal: any, index: number) => (
            <SlideIn key={index} direction="up" delay={400 + index * 100}>
              <FlatCard style={styles.mealCard}>
                <Text style={[styles.mealTitle, { color: colors.text }]}>
                  {meal.name}
                </Text>
                <View style={styles.mealInfo}>
                  <View
                    style={[
                      styles.infoChip,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[styles.infoChipText, { color: colors.primary }]}
                    >
                      🕒 {meal.prepTime}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.infoChip,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[styles.infoChipText, { color: colors.primary }]}
                    >
                      🔥 {meal.calories} cal
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Ingredients
                </Text>
                <View style={styles.ingredientsContainer}>
                  {meal.ingredients &&
                    meal.ingredients.map(
                      (ingredient: string, ingIndex: number) => (
                        <View
                          key={ingIndex}
                          style={[
                            styles.ingredientChip,
                            { backgroundColor: colors.surface },
                          ]}
                        >
                          <Text
                            style={[
                              styles.ingredientText,
                              { color: colors.text },
                            ]}
                          >
                            {ingredient}
                          </Text>
                        </View>
                      )
                    )}
                </View>

                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text, marginTop: Spacing.md },
                  ]}
                >
                  Instructions
                </Text>
                <Text style={[styles.instructions, { color: colors.text }]}>
                  {meal.instructions}
                </Text>
              </FlatCard>
            </SlideIn>
          ))}

        {mealPlan.tips && mealPlan.tips.length > 0 && (
          <SlideIn direction="up" delay={700}>
            <FlatCard style={styles.tipsCard}>
              <Text style={[styles.tipsTitle, { color: colors.text }]}>
                Nutrition Tips
              </Text>
              {mealPlan.tips.map((tip: string, index: number) => (
                <View key={index} style={styles.tipItem}>
                  <Text
                    style={[styles.tipText, { color: colors.textSecondary }]}
                  >
                    • {tip}
                  </Text>
                </View>
              ))}
            </FlatCard>
          </SlideIn>
        )}
      </>
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
          <FitnessIcon icon="🍎" size="lg" />
          <Text style={[styles.title, { color: colors.text }]}>
            Meal Plan Generator
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter ingredients you have and get personalized meal suggestions
        </Text>
      </FadeIn>

      <SlideIn direction="up" delay={200}>
        <FlatCard style={styles.inputCard}>
          <FlatInput
            label="Available Ingredients"
            placeholder="e.g., chicken, rice, broccoli, tomatoes"
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={3}
          />

          <FlatInput
            label="Dietary Preferences (Optional)"
            placeholder="e.g., vegetarian, vegan, keto"
            value={dietaryPreferences}
            onChangeText={setDietaryPreferences}
            multiline
            numberOfLines={2}
          />

          {error ? (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {error}
            </Text>
          ) : null}

          <FlatButton
            title="Generate Meal Plan"
            onPress={handleGeneratePlan}
            disabled={!ingredients.trim() || loading}
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
            <LoadingSkeleton height={100} />
          </FlatCard>
        </SlideIn>
      ) : (
        renderMealPlan()
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
  summaryCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  planTitle: {
    ...Typography.heading2,
    marginTop: Spacing.sm,
  },
  planSubtitle: {
    ...Typography.bodySmall,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  nutritionSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    ...Typography.heading2,
  },
  nutritionLabel: {
    ...Typography.bodySmall,
  },
  mealCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  mealTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  mealInfo: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
    flexWrap: "wrap",
  },
  infoChip: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoChipText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  sectionTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.md,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.lg,
  },
  ingredientChip: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ingredientText: {
    ...Typography.bodySmall,
  },
  instructions: {
    ...Typography.bodySmall,
    lineHeight: 20,
  },
  tipsCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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

export default MealPlanScreen;
