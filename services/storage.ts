// Storage service for handling user profile data with AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the user profile type
export interface UserProfile {
  name?: string;
  height?: number; // in cm
  weight?: number; // in kg
  age?: number;
  bmi?: number;
  goal?: string;
  experienceLevel?: string;
  availableIngredients?: string[];
}

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: "user_profile",
};

// Storage service class
export class StorageService {
  // Save user profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, jsonValue);
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const existingProfile = await this.getUserProfile();
      const updatedProfile = { ...existingProfile, ...updates };

      // Calculate BMI if height and weight are provided
      if (updatedProfile.height && updatedProfile.weight) {
        const heightInMeters = updatedProfile.height / 100;
        updatedProfile.bmi = parseFloat(
          (updatedProfile.weight / (heightInMeters * heightInMeters)).toFixed(1)
        );
      }

      await this.saveUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Clear user profile
  async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error("Error clearing user profile:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
