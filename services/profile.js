import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the user profile structure
export const UserProfile = {
  height: 0, // in cm
  weight: 0, // in kg
  age: 0,
  bmi: 0
};

// Profile service for handling user data
class ProfileService {
  static STORAGE_KEY = 'fitness_coach_profile';

  // Save user profile to AsyncStorage
  static async saveProfile(profile) {
    try {
      const profileWithBMI = {
        ...profile,
        bmi: this.calculateBMI(profile.weight, profile.height)
      };
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(profileWithBMI));
      return profileWithBMI;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  // Load user profile from AsyncStorage
  static async loadProfile() {
    try {
      const profileData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (profileData) {
        return JSON.parse(profileData);
      }
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      throw error;
    }
  }

  // Clear user profile from AsyncStorage
  static async clearProfile() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing profile:', error);
      throw error;
    }
  }

  // Calculate BMI (Body Mass Index)
  static calculateBMI(weight, height) {
    // weight in kg, height in cm
    if (weight <= 0 || height <= 0) return 0;
    
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  // Get BMI category
  static getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  }
}

export default ProfileService;