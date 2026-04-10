import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "@/contexts/AppContext";
import Badge from "./Badge";

interface AlertCardProps {
  title: string;
  location: string;
  color: string;
  status: "active" | "pending" | "resolved";
  responders: number;
  timestamp: string;
  onPress: () => void;
}

export default function AlertCard({
  title,
  location,
  color,
  status,
  responders,
  timestamp,
  onPress,
}: AlertCardProps) {
  const { colors, t } = useApp();
  const statusVariant = status === "active" ? "urgent" : status === "pending" ? "pending" : "resolved";

  return (
    <Pressable style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
      <View style={[styles.leftBorder, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={11} color={colors.textMuted} />
          <Text style={[styles.location, { color: colors.textMuted }]}>{location}</Text>
        </View>
        <View style={styles.footer}>
          <Badge label={status} variant={statusVariant} />
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>{timestamp}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.respondersText, { color: colors.textSecondary }]}>{responders} {t("alerts.responding")}</Text>
        <View style={[styles.arrowBtn, { backgroundColor: colors.primaryLight }]}>
          <Feather name="chevron-right" size={14} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  leftBorder: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 16,
  },
  location: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 16,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  right: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 14,
    gap: 6,
  },
  respondersText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  arrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
