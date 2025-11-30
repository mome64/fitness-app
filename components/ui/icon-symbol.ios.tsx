import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color = "#000000", // Added default color value
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Ensure color is always defined
  const iconColor = color !== undefined ? color : "#000000";

  return (
    <SymbolView
      weight={weight}
      tintColor={iconColor}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
