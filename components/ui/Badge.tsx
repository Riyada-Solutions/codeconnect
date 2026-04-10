import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeVariant = "urgent" | "pending" | "transit" | "active" | "resolved" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  urgent: { bg: "#fef2f2", text: "#ef4444" },
  pending: { bg: "#fffbeb", text: "#f59e0b" },
  transit: { bg: "#f0fdf4", text: "#10b981" },
  active: { bg: "#eff6ff", text: "#3b82f6" },
  resolved: { bg: "#f0f5f5", text: "#93b5b6" },
  info: { bg: "#e4f7f7", text: "#2daaae" },
};

export default function Badge({ label, variant = "info" }: BadgeProps) {
  const colors = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
