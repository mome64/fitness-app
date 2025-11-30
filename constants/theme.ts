import { Platform } from "react-native";

// Modern vibrant color palette
const tintColorLight = "#007AFF"; // Bright blue accent
const tintColorDark = "#4CC9F0"; // Neon blue for dark mode

// Enhanced light theme with soft gradients and high contrast
const lightColors = {
  primary: "#007AFF", // Vibrant blue
  primaryLight: "#E6F2FF", // Light blue for backgrounds
  secondary: "#34C759", // Success green
  accent: "#FF9500", // Warm orange
  background: "#FFFFFF", // Pure white background
  cardBackground: "#FAFAFA", // Soft off-white for cards
  surface: "#F2F2F7", // Light gray surface
  text: "#1C1C1E", // Nearly black text
  textSecondary: "#8E8E93", // Medium gray text
  border: "#E5E5EA", // Light border
  success: "#34C759", // Green for success
  warning: "#FF9500", // Orange for warnings
  danger: "#FF3B30", // Red for errors
  tint: tintColorLight,
  icon: "#8E8E93", // Gray icons
  tabIconDefault: "#C7C7CC", // Light gray for unselected tabs
  tabIconSelected: tintColorLight, // Blue for selected tabs
  // Gradient colors
  gradientStart: "#007AFF",
  gradientEnd: "#0A84FF",
};

// Enhanced dark theme with deep blues and purples
const darkColors = {
  primary: "#4CC9F0", // Bright neon blue
  primaryLight: "#0A1E3F", // Deep blue background
  secondary: "#30D158", // Bright green
  accent: "#FF9F0A", // Vibrant orange
  background: "#000000", // Pure black background
  cardBackground: "#1C1C1E", // Dark card background
  surface: "#2C2C2E", // Slightly lighter surface
  text: "#FFFFFF", // White text
  textSecondary: "#EBEBF5", // Light gray text
  border: "#48484A", // Dark border
  success: "#30D158", // Green for success
  warning: "#FF9F0A", // Orange for warnings
  danger: "#FF453A", // Red for errors
  tint: tintColorDark,
  icon: "#EBEBF5", // Light gray icons
  tabIconDefault: "#8E8E93", // Gray for unselected tabs
  tabIconSelected: tintColorDark, // Neon blue for selected tabs
  // Gradient colors
  gradientStart: "#4CC9F0",
  gradientEnd: "#4361EE",
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Typography system for consistent font sizes
// Modern typography system with medium sizes (14, 16, 18, 24, 28)
export const Typography = {
  heading1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  heading2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 30,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  overline: {
    fontSize: 10,
    fontWeight: "600" as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
};

// Enhanced spacing system with medium spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12, // Reduced from 16 to create more compact layouts
  lg: 16, // Reduced from 24
  xl: 24, // Reduced from 32
  xxl: 32, // Reduced from 48
  xxxl: 48,
};

// Updated border radius for smooth rounded corners (16-24)
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "Roboto, system-ui, sans-serif",
    serif: "Georgia, serif",
    rounded: "system-ui, sans-serif",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
