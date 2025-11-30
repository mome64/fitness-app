import FadeIn from "@/components/FadeIn";
import FitnessIcon from "@/components/FitnessIcon";
import FlatButton from "@/components/FlatButton";
import FlatCard from "@/components/FlatCard";
import FlatInput from "@/components/FlatInput";
import SlideIn from "@/components/SlideIn";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { storageService } from "@/services/storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Local interface for form state (strings for input fields)
interface ProfileFormState {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  experienceLevel: string;
  availableIngredients: string[];
}

const ProfileScreen = () => {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<ProfileFormState>({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    experienceLevel: "",
    availableIngredients: [],
  });
  const [bmi, setBmi] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load profile data from storage service on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (profile.weight && profile.height) {
      const weight = parseFloat(profile.weight);
      const height = parseFloat(profile.height) / 100; // Convert cm to meters
      if (weight > 0 && height > 0) {
        const bmiValue = weight / (height * height);
        setBmi(bmiValue.toFixed(1));
      }
    } else {
      setBmi("");
    }
  }, [profile.weight, profile.height]);

  const loadProfile = async () => {
    try {
      const profileData = await storageService.getUserProfile();
      if (profileData) {
        setProfile({
          name: profileData.name || "",
          age: profileData.age?.toString() || "",
          height: profileData.height?.toString() || "",
          weight: profileData.weight?.toString() || "",
          goal: profileData.goal || "",
          experienceLevel: profileData.experienceLevel || "",
          availableIngredients: profileData.availableIngredients || [],
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async () => {
    try {
      // Validate required fields
      if (!profile.name.trim()) {
        Alert.alert("Validation Error", "Please enter your name");
        return;
      }

      if (profile.age && isNaN(parseFloat(profile.age))) {
        Alert.alert("Validation Error", "Please enter a valid age");
        return;
      }

      if (profile.height && isNaN(parseFloat(profile.height))) {
        Alert.alert("Validation Error", "Please enter a valid height");
        return;
      }

      if (profile.weight && isNaN(parseFloat(profile.weight))) {
        Alert.alert("Validation Error", "Please enter a valid weight");
        return;
      }

      await storageService.updateUserProfile({
        name: profile.name,
        age: profile.age ? parseFloat(profile.age) : undefined,
        height: profile.height ? parseFloat(profile.height) : undefined,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        goal: profile.goal,
        experienceLevel: profile.experienceLevel,
        availableIngredients: profile.availableIngredients,
      });

      setIsEditing(false);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <FadeIn delay={100}>
        <View style={styles.header}>
          <FitnessIcon icon="👤" size="lg" />
          <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage your personal information and fitness data
        </Text>
      </FadeIn>

      {/* Avatar Section */}
      <SlideIn direction="up" delay={200}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={[styles.avatarInitials, { color: colors.primary }]}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          </TouchableOpacity>
          {isEditing && (
            <FlatButton
              title="Change Photo"
              variant="outline"
              style={styles.changePhotoButton}
              onPress={() => {}}
            />
          )}
        </View>
      </SlideIn>

      <SlideIn direction="up" delay={300}>
        <FlatCard style={styles.profileCard}>
          <FlatInput
            label="Full Name"
            placeholder="Enter your name"
            value={profile.name}
            onChangeText={(value) => handleInputChange("name", value)}
            editable={isEditing}
            style={styles.inputField}
          />

          <View style={styles.row}>
            <FlatInput
              label="Age"
              placeholder="Age"
              value={profile.age}
              onChangeText={(value) => handleInputChange("age", value)}
              editable={isEditing}
              keyboardType="numeric"
              style={[styles.halfInput, styles.inputField]}
            />

            <FlatInput
              label="Height (cm)"
              placeholder="Height"
              value={profile.height}
              onChangeText={(value) => handleInputChange("height", value)}
              editable={isEditing}
              keyboardType="numeric"
              style={[styles.halfInput, styles.inputField]}
            />
          </View>

          <FlatInput
            label="Weight (kg)"
            placeholder="Weight"
            value={profile.weight}
            onChangeText={(value) => handleInputChange("weight", value)}
            editable={isEditing}
            keyboardType="numeric"
            style={styles.inputField}
          />

          {bmi ? (
            <SlideIn direction="up" delay={400}>
              <View
                style={[styles.bmiCard, { backgroundColor: colors.surface }]}
              >
                <Text
                  style={[styles.bmiLabel, { color: colors.textSecondary }]}
                >
                  Your BMI
                </Text>
                <Text style={[styles.bmiValue, { color: colors.text }]}>
                  {bmi}
                </Text>
                <Text
                  style={[styles.bmiCategory, { color: colors.textSecondary }]}
                >
                  {getBMICategory(parseFloat(bmi))}
                </Text>
              </View>
            </SlideIn>
          ) : null}

          {isEditing && (
            <>
              <FlatInput
                label="Fitness Goal"
                placeholder="Select your goal"
                value={profile.goal}
                onChangeText={(value) => handleInputChange("goal", value)}
                editable={isEditing}
                style={styles.inputField}
              />

              <FlatInput
                label="Experience Level"
                placeholder="Select your experience level"
                value={profile.experienceLevel}
                onChangeText={(value) =>
                  handleInputChange("experienceLevel", value)
                }
                editable={isEditing}
                style={styles.inputField}
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <FlatButton
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    loadProfile(); // Revert to saved data
                  }}
                  variant="outline"
                  style={styles.button}
                />
                <FlatButton
                  title="Save"
                  onPress={saveProfile}
                  style={styles.button}
                />
              </>
            ) : (
              <FlatButton
                title="Edit Profile"
                onPress={() => setIsEditing(true)}
                style={styles.singleButton}
              />
            )}
          </View>
        </FlatCard>
      </SlideIn>

      <SlideIn direction="up" delay={500}>
        <FlatCard style={styles.settingsCard}>
          <View style={styles.sectionHeader}>
            <FitnessIcon icon="⚙️" size="md" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Account Settings
            </Text>
          </View>

          {/* Theme Toggle Button */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Theme: {theme === "light" ? "Light" : "Dark"}
            </Text>
            <FlatButton
              title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
              onPress={toggleTheme}
              variant="outline"
              style={styles.themeToggleButton}
            />
          </View>

          {/* AI Settings Button */}
          <FlatButton
            title="AI Settings"
            variant="outline"
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          />

          <FlatButton
            title="Change Password"
            variant="outline"
            style={styles.settingsButton}
            onPress={() => {}}
          />
          <FlatButton
            title="Notification Preferences"
            variant="outline"
            style={styles.settingsButton}
            onPress={() => {}}
          />
          <FlatButton
            title="Privacy Settings"
            variant="outline"
            style={styles.settingsButton}
            onPress={() => {}}
          />
        </FlatCard>
      </SlideIn>
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
  avatarContainer: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarInitials: {
    ...Typography.heading1,
    fontWeight: "700",
  },
  changePhotoButton: {
    minWidth: 120,
  },
  profileCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  inputField: {
    marginBottom: Spacing.md,
  },
  bmiCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  bmiLabel: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  bmiValue: {
    ...Typography.heading2,
    marginBottom: Spacing.xs,
  },
  bmiCategory: {
    ...Typography.bodySmall,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  singleButton: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading2,
    marginLeft: Spacing.sm,
  },
  settingsCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  settingLabel: {
    ...Typography.body,
    flex: 1,
  },
  themeToggleButton: {
    minWidth: 120,
  },
  settingsButton: {
    marginBottom: Spacing.sm,
  },
});

export default ProfileScreen;
