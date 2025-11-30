import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FlatDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  items: { label: string; value: string }[];
  style?: object;
}

const FlatDropdown: React.FC<FlatDropdownProps> = ({
  label,
  placeholder = "Select an option",
  value,
  onValueChange,
  items,
  style,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    items.find((item) => item.value === value)?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            borderRadius: BorderRadius.md,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownText,
            { color: value ? colors.text : colors.textSecondary },
          ]}
        >
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderRadius: BorderRadius.lg,
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.modalItem,
                    {
                      borderBottomWidth: index < items.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
    fontWeight: "600",
  },
  dropdown: {
    borderWidth: 1,
    padding: Spacing.md,
    minHeight: 50,
    justifyContent: "center",
  },
  dropdownText: {
    ...Typography.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    borderWidth: 1,
    width: "100%",
    maxHeight: 300,
  },
  modalItem: {
    padding: Spacing.md,
  },
  modalItemText: {
    ...Typography.body,
  },
});

export default FlatDropdown;
