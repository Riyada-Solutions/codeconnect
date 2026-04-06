import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AlertCard from "@/components/ui/AlertCard";
import { alertsList } from "@/constants/mockData";
import { useApp } from "@/contexts/AppContext";

const FILTER_KEYS = ["all", "codeRed", "codeBlue", "pending", "resolved"] as const;

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState("all");
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  const filterLabels: Record<string, string> = {
    all: t("alerts.all"),
    codeRed: "Code Red",
    codeBlue: "Code Blue",
    pending: t("alerts.pending"),
    resolved: t("alerts.resolved"),
  };

  const filtered = alertsList.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return a.status === "pending";
    if (activeFilter === "resolved") return a.status === "resolved";
    if (activeFilter === "codeRed") return a.type === "Code Red";
    if (activeFilter === "codeBlue") return a.type === "Code Blue";
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("alerts.title")}</Text>
        <Pressable style={styles.filterIcon}>
          <Feather name="sliders" size={18} color={colors.heroText} />
        </Pressable>
      </View>

      <View style={[styles.filtersRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          data={FILTER_KEYS as unknown as string[]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                activeFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.textSecondary },
                  activeFilter === item && styles.filterTextActive,
                ]}
              >
                {filterLabels[item] || item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        renderItem={({ item }) => (
          <AlertCard
            title={item.title}
            location={item.location}
            color={item.color}
            status={item.status}
            responders={item.responders}
            timestamp={item.timestamp}
            onPress={() => router.push(`/alert/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("alerts.noAlerts")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  filterIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  filtersRow: {
    borderBottomWidth: 0.5,
  },
  filtersContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  filterChipActive: {
    backgroundColor: "#2daaae",
    borderColor: "#2daaae",
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  list: {
    padding: 14,
    gap: 10,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
