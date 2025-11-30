import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Typography } from '@/constants/theme';

interface FlatHeaderProps {
  title: string;
  subtitle?: string;
  style?: object;
}

const FlatHeader: React.FC<FlatHeaderProps> = ({ title, subtitle, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
  },
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.xs,
  },
});

export default FlatHeader;