import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { notifications } from "@/constants/mockData";
import { useApp } from "@/contexts/AppContext";

const typeIcons: Record<string, string> = {
  urgent: "alert-circle",
  info: "info",
  success: "check-circle",
};

const typeColors: Record<string, string> = {
  urgent: "#ef4444",
  info: "#3b82f6",
  success: "#10b981",
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("notifications.title")}</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconName = typeIcons[item.type] || "info";
          const iconColor = typeColors[item.type] || "#3b82f6";

          return (
            <View style={[styles.notifCard, { backgroundColor: colors.card }, !item.read && { borderLeftWidth: 3, borderLeftColor: colors.primary }]}>
              <View style={[styles.notifIcon, { backgroundColor: iconColor + "15" }]}>
                <Feather name={iconName as any} size={18} color={iconColor} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={[styles.notifTitle, { color: colors.text }]}>{item.title}</Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>{item.message}</Text>
                <Text style={[styles.notifTime, { color: colors.textMuted }]}>{item.time}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("notifications.empty")}</Text>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  list: {
    padding: 14,
    gap: 8,
  },
  notifCard: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifTitle: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notifMessage: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  notifTime: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
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
