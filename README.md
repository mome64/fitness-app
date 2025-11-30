# AI Fitness Coach - Modern React Native App

A beautifully designed, fully functional AI-powered fitness coaching mobile application built with React Native and Expo.

## 🏋️‍♀️ Features

### Core Functionality

- **AI-Powered Personalization**: Custom workout plans and meal suggestions based on user goals
- **Fitness Tracking**: Steps, calories, and workout progress monitoring
- **Nutrition Planning**: AI-generated meal plans with macro tracking
- **Progress Analytics**: BMI calculation and fitness insights
- **Motivational Support**: AI coach with encouragement and tips

### UI/UX Highlights

- **Modern Flat Design**: Clean, minimalist interface with smooth rounded corners (16-24px)
- **Professional Color System**: Vibrant accent colors with layered neutrals for backgrounds
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Micro-Interactions**: Tap animations, fade/slide transitions, and ripple effects
- **Beautiful Typography**: Medium sizes (14, 16, 18, 24, 28) with consistent hierarchy
- **Iconography**: Fitness and food-themed icons for all major actions

## 📱 Screens

### 1. Onboarding Flow

- Full-width illustrations
- Simple fitness icons (dumbbell, heart rate, fire)
- Progress dots indicator
- "Get Started" button with smooth animation

### 2. Home Dashboard

- Personalized welcome banner
- Fitness stats cards with iconography (steps, calories, goals)
- Daily goals progress bars with animations
- Quick action buttons for workouts and meals

### 3. AI Fitness Coach Chat

- Bubble-based conversation UI
- Clean formatting for workout tables and bullet points
- Animated typing indicator
- Message input with send button

### 4. Workout Generator

- Goal and experience level selection
- Professional fitness card layout for AI output
- Exercise details with sets, reps, and rest periods
- Pro tips section

### 5. Meal Plan Generator

- Ingredient input with chips
- Recipe cards with prep time and calorie info
- Nutrition facts display (protein, carbs, fat)
- Step-by-step instructions

### 6. Profile Screen

- User avatar with edit functionality
- Biometric inputs (height, weight, age)
- Auto-calculated BMI with category
- Account settings section

## 🎨 Design System

### Color Palette

- **Primary**: Vibrant blue (#007AFF in light, #4CC9F0 in dark)
- **Secondary**: Success green (#34C759 / #30D158)
- **Accent**: Warm orange (#FF9500 / #FF9F0A)
- **Backgrounds**: Pure white to deep black transition
- **Text**: High-contrast with soft secondary colors

### Typography

- **Heading 1**: 28px, bold
- **Heading 2**: 24px, semi-bold
- **Heading 3**: 18px, semi-bold
- **Body**: 16px, regular
- **Caption**: 14px, regular
- **Overline**: 12px, semi-bold

### Components

- **Cards**: Soft rounded corners (24px), subtle shadows
- **Buttons**: Ripple effects, scale animations
- **Inputs**: Focus animations, clean separators
- **Chips**: Tag-style elements for ingredients and metadata

## 🧠 AI Capabilities

### Personalization Engine

- Custom workout creation based on goals and experience
- Diet generation with macro and calorie calculations
- Ingredient-based meal planning
- Weekly fitness summaries
- Motivational quotes and progress analysis

### Data Persistence

- User profile stored with AsyncStorage
- AI remembers user preferences and history
- Offline support for basic functionality

## 🚀 Technical Stack

### Frontend

- **React Native**: Cross-platform mobile development
- **Expo**: Development toolkit and platform services
- **TypeScript**: Type safety and better developer experience
- **React Navigation**: File-based routing with bottom tabs

### UI Libraries

- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Enhanced touch interactions
- **Expo Vector Icons**: Icon components

### State Management

- **Context API**: Theme and user state management
- **AsyncStorage**: Local data persistence

### Architecture

- **Modular Component System**: Reusable UI components
- **Service Layer**: API integration abstraction
- **Theme System**: Consistent design tokens

## 📁 Project Structure

```
app/
  ├── (tabs)/           # Tab navigator screens
  ├── _layout.tsx       # Root layout configuration
  └── modal.tsx         # Modal screen

components/
  ├── ui/               # Core UI components
  ├── FitnessIcon.tsx   # Custom fitness icons
  ├── FlatButton.tsx    # Animated button component
  ├── FlatCard.tsx      # Card container with animations
  ├── FlatInput.tsx     # Enhanced input field
  └── ...               # Other UI components

constants/
  └── theme.ts          # Design tokens and styling system

context/
  └── ThemeContext.tsx  # Theme management

hooks/
  ├── use-color-scheme.ts
  └── use-theme-color.ts

screens/
  ├── HomeScreen.tsx
  ├── ChatScreen.tsx
  ├── WorkoutGeneratorScreen.tsx
  ├── MealPlanScreen.tsx
  ├── ProfileScreen.tsx
  └── OnboardingScreen.tsx

services/
  ├── api.ts            # AI service integration
  └── storage.ts        # Data persistence
```

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run in web browser
- `npm run lint`: Run ESLint

## 🎯 Future Enhancements

### Planned Features

1. Social sharing of workouts and meals
2. Integration with health apps (Apple Health, Google Fit)
3. Video exercise demonstrations
4. Community challenges and leaderboards
5. Advanced analytics dashboard
6. Wearable device synchronization

### Technical Improvements

1. Real AI API integration (OpenAI, Gemini)
2. Enhanced offline capabilities
3. Push notification system
4. Cloud sync for user data
5. Performance optimizations
6. Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React Native and Expo
- Inspired by modern fitness app design principles
- Icons from Expo Vector Icons
- Animations powered by React Native Reanimated
