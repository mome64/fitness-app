// Mock AI service for demonstration purposes
// In a real application, you would replace these with actual API calls to OpenAI, Google Gemini, or Groq

// Define TypeScript-like interfaces for our data structures
const WorkoutPlan = {};
const Exercise = {};
const MealPlan = {};
const Meal = {};
const UserProfile = {};

class AIService {
  // Generate workout plan based on user goals and experience level
  static async generateWorkoutPlan(goal, experience) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock workout plan based on inputs
    const mockPlans = {
      weight_loss: {
        id: "1",
        title: "Fat Burning Circuit",
        description:
          "High intensity circuit training to burn fat and improve cardiovascular health",
        duration: 45,
        exercises: [
          { name: "Jumping Jacks", sets: 3, reps: 20, rest: 30 },
          { name: "Burpees", sets: 3, reps: 10, rest: 30 },
          { name: "Mountain Climbers", sets: 3, reps: 20, rest: 30 },
          { name: "Squats", sets: 3, reps: 15, rest: 30 },
          { name: "Plank", sets: 3, reps: 1, rest: 30 },
        ],
      },
      muscle_gain: {
        id: "2",
        title: "Muscle Building Routine",
        description:
          "Strength training focused on muscle growth and definition",
        duration: 60,
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8, rest: 90 },
          { name: "Deadlift", sets: 4, reps: 6, rest: 120 },
          { name: "Squats", sets: 4, reps: 8, rest: 90 },
          { name: "Pull-ups", sets: 3, reps: 10, rest: 60 },
          { name: "Barbell Rows", sets: 3, reps: 10, rest: 60 },
        ],
      },
      maintenance: {
        id: "3",
        title: "Balanced Fitness",
        description:
          "Balanced workout for overall fitness and health maintenance",
        duration: 50,
        exercises: [
          { name: "Warm-up Jog", sets: 1, reps: 1, rest: 0 },
          { name: "Push-ups", sets: 3, reps: 15, rest: 45 },
          { name: "Lunges", sets: 3, reps: 12, rest: 45 },
          { name: "Dumbbell Shoulders", sets: 3, reps: 12, rest: 45 },
          { name: "Plank", sets: 3, reps: 1, rest: 45 },
        ],
      },
    };

    // Return appropriate plan or default
    return (
      mockPlans[goal] || {
        id: "default",
        title: "Custom Workout Plan",
        description: "A personalized workout plan based on your goals",
        duration: 45,
        exercises: [{ name: "Exercise 1", sets: 3, reps: 10, rest: 60 }],
      }
    );
  }

  // Generate meal plan based on available ingredients
  static async generateMealPlan(ingredients) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock meal plan
    return {
      id: "1",
      title: "Healthy Balanced Diet",
      description: "Nutritious meals based on your available ingredients",
      calories: 1800,
      meals: [
        {
          name: "Protein-Packed Breakfast",
          ingredients: [
            "eggs",
            "oats",
            "berries",
            ...ingredients.filter(
              (i) => !["eggs", "oats", "berries"].includes(i)
            ),
          ],
          calories: 450,
          protein: 25,
        },
        {
          name: "Veggie Power Lunch",
          ingredients: [
            "chicken",
            "quinoa",
            "broccoli",
            ...ingredients.filter(
              (i) => !["chicken", "quinoa", "broccoli"].includes(i)
            ),
          ],
          calories: 600,
          protein: 35,
        },
        {
          name: "Light Dinner",
          ingredients: [
            "salmon",
            "sweet potato",
            "spinach",
            ...ingredients.filter(
              (i) => !["salmon", "sweet potato", "spinach"].includes(i)
            ),
          ],
          calories: 550,
          protein: 30,
        },
        {
          name: "Healthy Snack",
          ingredients: [
            "nuts",
            "yogurt",
            ...ingredients.filter((i) => !["nuts", "yogurt"].includes(i)),
          ],
          calories: 200,
          protein: 10,
        },
      ],
    };
  }

  // Get AI fitness coach response
  static async getAIResponse(message) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock responses based on message content
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return "Here's a great workout for you: Start with a 5-minute warmup, then do 3 sets of 10 push-ups, 15 squats, and 20 lunges. Finish with a 5-minute cooldown stretch.";
    } else if (lowerMessage.includes("diet") || lowerMessage.includes("meal")) {
      return "For a healthy meal, try grilled chicken with quinoa and steamed vegetables. This provides lean protein, complex carbs, and essential nutrients.";
    } else if (lowerMessage.includes("motivat")) {
      return "Remember, every expert was once a beginner. You're making progress every day, even when it doesn't feel like it. Keep going!";
    } else {
      return "That's a great question! As your AI fitness coach, I recommend focusing on consistency and listening to your body. What specific aspect would you like more guidance on?";
    }
  }

  // Get daily motivation message
  static async getDailyMotivation() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const messages = [
      "You're doing great! Keep pushing forward!",
      "Every workout brings you closer to your goals!",
      "Consistency is the key to success!",
      "Believe in yourself and your abilities!",
      "Small progress is still progress!",
      "You've got this! One day at a time!",
      "Your hard work is paying off!",
      "Stay focused and never give up!",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Export individual functions for easier importing
export const generateWorkoutPlan = AIService.generateWorkoutPlan;
export const generateMealPlan = AIService.generateMealPlan;
export const getAIResponse = AIService.getAIResponse;
export const getDailyMotivation = AIService.getDailyMotivation;

export default AIService;
