// API service for integrating with AI providers
// This service handles communication with OpenAI, Google Gemini, and Groq APIs

// Try to import OpenAI SDK, but provide fallback if not available
let OpenAI: any;
let openaiAvailable = false;

try {
  OpenAI = require("openai").default;
  openaiAvailable = true;
} catch (error) {
  console.warn("OpenAI SDK not available, using mock mode only");
  OpenAI = null;
}

// Mock API delay for demonstration purposes
const MOCK_DELAY = 1000;

// Mock responses for different AI features
const MOCK_RESPONSES = {
  workoutPlan: `## Your Personalized Workout Plan
  
1. **Warm-up (5 minutes)**
   - Jumping jacks: 2 minutes
   - Arm circles: 1 minute
   - Leg swings: 2 minutes

2. **Main Workout (20 minutes)**
   - Push-ups: 3 sets of 10-15 reps
   - Squats: 3 sets of 15-20 reps
   - Plank: 3 sets of 30-60 seconds
   - Mountain climbers: 3 sets of 20 reps

3. **Cool-down (5 minutes)**
   - Stretching: 5 minutes focusing on major muscle groups`,

  mealPlan: `## Your Personalized Meal Plan
  
**Breakfast:**
- Oatmeal with berries and nuts (350 calories)
- Green tea

**Lunch:**
- Grilled chicken salad with mixed vegetables (420 calories)
- Olive oil dressing

**Snack:**
- Greek yogurt with honey (150 calories)

**Dinner:**
- Baked salmon with quinoa and steamed broccoli (480 calories)
- Small portion of fruit for dessert

**Total Calories: ~1400**`,

  motivation:
    "Remember, consistency is key! You're doing great, and every small step counts toward your goals.",

  goalTracking:
    "To track your progress effectively, log your workouts daily and monitor how you feel after each session. Adjust intensity based on your energy levels.",
};

// Simulate API call with delay
const simulateApiCall = async <T>(response: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, MOCK_DELAY);
  });
};

// AI Service class
export class AIService {
  private apiKey: string | null = null;
  private provider: "openai" | "gemini" | "groq" | "mock" = "mock";
  private openai: any | null = null;

  // Set API key and provider
  setApiKey(key: string, provider: "openai" | "gemini" | "groq") {
    this.apiKey = key;
    this.provider = provider;

    if (provider === "openai" && key && openaiAvailable && OpenAI) {
      try {
        this.openai = new OpenAI({
          apiKey: key,
          dangerouslyAllowBrowser: true, // Only for development, use secure backend in production
        });
      } catch (error) {
        console.error("Failed to initialize OpenAI client:", error);
        this.openai = null;
      }
    }
  }

  // Generate workout plan using OpenAI
  async generateWorkoutPlan(
    goal: string,
    experienceLevel: string
  ): Promise<any> {
    if (this.provider === "openai" && this.openai) {
      try {
        const prompt = `Create a personalized workout plan for someone with the following details:
        Goal: ${goal}
        Experience Level: ${experienceLevel}
        
        Please provide:
        1. A 3-day workout plan with specific exercises
        2. Number of sets and reps for each exercise
        3. Rest periods between sets
        4. Warm-up and cool-down routines
        5. Pro tips for form and progression
        
        Format the response as a JSON object with the following structure:
        {
          "title": "Workout Plan Title",
          "days": [
            {
              "day": "Day Name",
              "exercises": [
                {
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": "10-12",
                  "rest": "60s"
                }
              ]
            }
          ],
          "tips": ["Tip 1", "Tip 2", "Tip 3"]
        }`;

        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const content = response.choices[0].message.content || "";
        // Try to parse JSON from response
        try {
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
          }
          return JSON.parse(content);
        } catch (parseError) {
          // If JSON parsing fails, return a structured response
          return {
            title: "Your Personalized Workout Plan",
            days: [
              {
                day: "Sample Day",
                exercises: [
                  { name: "Sample Exercise", sets: 3, reps: "10", rest: "60s" },
                ],
              },
            ],
            tips: [
              "This is a sample workout plan",
              "In a real implementation with a valid API key, this would be personalized for you",
            ],
          };
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback to mock response
      }
    }

    // Return mock response as fallback
    return simulateApiCall({
      title: "Your Personalized Workout Plan",
      days: [
        {
          day: "Day 1: Upper Body Focus",
          exercises: [
            { name: "Push-ups", sets: 3, reps: "10-15", rest: "60s" },
            { name: "Pull-ups or Rows", sets: 3, reps: "8-12", rest: "90s" },
            { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Plank", sets: 3, duration: "30-60s", rest: "60s" },
          ],
        },
        {
          day: "Day 2: Lower Body Focus",
          exercises: [
            { name: "Squats", sets: 4, reps: "12-15", rest: "90s" },
            { name: "Lunges", sets: 3, reps: "10 each leg", rest: "60s" },
            { name: "Deadlifts", sets: 3, reps: "8-10", rest: "120s" },
            { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60s" },
          ],
        },
        {
          day: "Day 3: Core and Cardio",
          exercises: [
            {
              name: "Mountain Climbers",
              sets: 3,
              duration: "30s",
              rest: "30s",
            },
            { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "30s" },
            { name: "Russian Twists", sets: 3, reps: "20", rest: "30s" },
            { name: "20-min Jog or Bike", sets: 1, duration: "20 minutes" },
          ],
        },
      ],
      tips: [
        "Always warm up for 5-10 minutes before starting your workout",
        "Stay hydrated throughout your training session",
        "Listen to your body and rest if you feel any pain",
        "Progressive overload: gradually increase weights or reps over time",
      ],
    });
  }

  // Generate meal plan using OpenAI
  async generateMealPlan(ingredients: string[]): Promise<any> {
    if (this.provider === "openai" && this.openai) {
      try {
        const prompt = `Create a personalized meal plan based on the following ingredients:
        Available Ingredients: ${ingredients.join(", ")}
        
        Please provide:
        1. 3 meals (breakfast, lunch, dinner) with recipes
        2. Calorie counts for each meal
        3. Preparation time
        4. Detailed ingredients list
        5. Step-by-step instructions
        6. Total calories and macronutrient breakdown
        7. Nutrition tips
        
        Format the response as a JSON object with the following structure:
        {
          "ingredients": ["ingredient1", "ingredient2"],
          "meals": [
            {
              "name": "Meal Name",
              "calories": 400,
              "prepTime": "15 mins",
              "ingredients": ["ingredient1", "ingredient2"],
              "instructions": "Step-by-step instructions"
            }
          ],
          "totalCalories": 1200,
          "nutritionFacts": {
            "protein": "50g",
            "carbs": "100g",
            "fat": "30g"
          },
          "tips": ["Tip 1", "Tip 2"]
        }`;

        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1200,
        });

        const content = response.choices[0].message.content || "";
        // Try to parse JSON from response
        try {
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
          }
          return JSON.parse(content);
        } catch (parseError) {
          // If JSON parsing fails, return a structured response
          return {
            ingredients: ingredients,
            meals: [
              {
                name: "Sample Meal",
                calories: 300,
                prepTime: "10 mins",
                ingredients: ["Sample ingredients"],
                instructions: "Sample instructions",
              },
            ],
            totalCalories: 300,
            nutritionFacts: {
              protein: "20g",
              carbs: "30g",
              fat: "10g",
            },
            tips: [
              "This is a sample meal plan",
              "In a real implementation with a valid API key, this would be personalized for you",
            ],
          };
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback to mock response
      }
    }

    // Return mock response as fallback
    return simulateApiCall({
      ingredients: ingredients,
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
          name: "Post-Workout Shake",
          calories: 250,
          prepTime: "5 mins",
          ingredients: [
            "Banana",
            "Greek yogurt",
            "Spinach",
            "Protein powder",
            "Almond milk",
          ],
          instructions:
            "Blend all ingredients until smooth. Adjust consistency with more almond milk if needed.",
        },
      ],
      totalCalories: 1120,
      nutritionFacts: {
        protein: "65g",
        carbs: "85g",
        fat: "35g",
      },
      tips: [
        "Aim to eat protein with each meal to support muscle recovery",
        "Include a variety of colorful vegetables for micronutrients",
        "Stay hydrated throughout the day, especially around workouts",
      ],
    });
  }

  // Get motivational message using OpenAI
  async getMotivationalMessage(): Promise<string> {
    if (this.provider === "openai" && this.openai) {
      try {
        const prompt =
          "Generate a short, motivational fitness message (1 sentence) to encourage someone in their fitness journey.";

        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 100,
        });

        return response.choices[0].message.content || MOCK_RESPONSES.motivation;
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback to mock response
      }
    }

    // Return mock response as fallback
    return simulateApiCall(MOCK_RESPONSES.motivation);
  }

  // Get goal tracking tips using OpenAI
  async getGoalTrackingTips(currentGoal: string): Promise<string> {
    if (this.provider === "openai" && this.openai) {
      try {
        const prompt = `Provide tips for tracking progress toward the fitness goal: ${currentGoal}. Keep it concise (2-3 sentences).`;

        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 150,
        });

        return (
          response.choices[0].message.content || MOCK_RESPONSES.goalTracking
        );
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback to mock response
      }
    }

    // Return mock response as fallback
    return simulateApiCall(MOCK_RESPONSES.goalTracking);
  }

  // Get AI response for chat using OpenAI
  async getAIResponse(prompt: string): Promise<string> {
    if (this.provider === "openai" && this.openai) {
      try {
        const systemPrompt = `You are an AI Fitness Coach. Provide helpful, encouraging responses about workouts, nutrition, and motivation. 
        Keep responses concise but informative. Format with markdown when appropriate for lists and headings.`;

        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        return (
          response.choices[0].message.content ||
          "I'm here to help with your fitness journey!"
        );
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fallback to mock response
      }
    }

    // Simple logic to determine response based on prompt content
    if (
      prompt.toLowerCase().includes("workout") ||
      prompt.toLowerCase().includes("exercise")
    ) {
      return simulateApiCall(MOCK_RESPONSES.workoutPlan);
    } else if (
      prompt.toLowerCase().includes("meal") ||
      prompt.toLowerCase().includes("food")
    ) {
      return simulateApiCall(MOCK_RESPONSES.mealPlan);
    } else if (prompt.toLowerCase().includes("motiv")) {
      return simulateApiCall(MOCK_RESPONSES.motivation);
    } else {
      return simulateApiCall(
        "I'm your AI Fitness Coach. I can help you with workout plans, meal suggestions, and motivation. What would you like to focus on today?"
      );
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
