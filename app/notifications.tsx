import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NotificationsSkeleton from "@/components/ui/skeletons/NotificationsSkeleton";
import { useApp } from "@/contexts/AppContext";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import type { ThemeColors } from "@/constants/theme";
import type { AppNotification } from "@/types/notification";

const TYPE_ICON: Record<string, string> = {
  emergency: "alert-circle",
  info:      "bell",
  warning:   "alert-triangle",
  success:   "check-circle",
};

const TYPE_COLOR: Record<string, string> = {
  emergency: "#ef4444",
  info:      "#3b82f6",
  warning:   "#f59e0b",
  success:   "#10b981",
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface RowProps {
  item: AppNotification;
  onPress: (id: number) => void;
  borderColor: string;
  colors: ThemeColors;
  isLast: boolean;
}

function NotifRow({ item, onPress, borderColor, colors, isLast }: RowProps) {
  const iconColor = item.type === "emergency" && item.code_color
    ? item.code_color
    : TYPE_COLOR[item.type] ?? TYPE_COLOR.info;
  const iconName = TYPE_ICON[item.type] ?? "bell";
  const iconBg   = iconColor + "18";

  return (
    <Pressable
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}
      onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(item.id); }}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Feather name={iconName as any} size={18} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
        </View>
        <Text style={[styles.rowMsg, { color: colors.textSecondary }]} numberOfLines={2}>{item.message}</Text>
        {item.location ? (
          <Text style={[styles.rowMeta, { color: iconColor }]} numberOfLines={1}>
            <Feather name="map-pin" size={10} color={iconColor} /> {item.location}
          </Text>
        ) : null}
        <Text style={[styles.rowTime, { color: colors.textMuted }]}>{timeAgo(item.timestamp)}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets  = useSafeAreaInsets();
  const { colors, t } = useApp();

  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead }    = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const sections = useMemo(() => {
    const list = notifications ?? [];
    const unread = list.filter((n) => !n.read);
    const read   = list.filter((n) => n.read);
    return [
      ...(unread.length ? [{ title: t("notifications.unread"), data: unread }] : []),
      ...(read.length   ? [{ title: t("notifications.earlier"), data: read }]  : []),
    ];
  }, [notifications, t]);

  const hasUnread = (notifications ?? []).some((n) => !n.read);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12, backgroundColor: colors.background }]}>
        <Pressable style={styles.backBtn} onPress={() => { void Haptics.selectionAsync(); router.back(); }}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{t("notifications.title")}</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>{t("notifications.subtitle")}</Text>
        </View>
        {hasUnread && (
          <Pressable
            style={[styles.markAllBtn, { backgroundColor: colors.primaryLight }]}
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); markAllRead(); }}
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>{t("notifications.markAll")}</Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 8 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => {
            const sectionIndex = sections.findIndex((s) => s.title === section.title);
            return (
              <Animated.Text
                entering={FadeInDown.delay(sectionIndex * 40).springify()}
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                {section.title.toUpperCase()}
              </Animated.Text>
            );
          }}
          renderItem={({ item, index, section }) => (
            <Animated.View entering={FadeInDown.delay(index * 30 + 60).springify()}>
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <NotifRow
                  item={item}
                  onPress={(id) => markRead(id)}
                  borderColor={colors.border}
                  colors={colors}
                  isLast={index === section.data.length - 1}
                />
              </View>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="bell-off" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("notifications.empty")}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "flex-start",
    paddingHorizontal: 20, paddingBottom: 12, gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginTop: 2,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  sub:   { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  markAllBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, marginTop: 4,
  },
  markAllText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionLabel: {
    fontSize: 11, fontFamily: "Inter_600SemiBold",
    letterSpacing: 1, marginBottom: 8, marginLeft: 4,
  },
  card: {
    borderRadius: 16, paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 14, gap: 14 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 2 },
  rowContent: { flex: 1, gap: 3 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowTitle: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  unreadDot: { width: 7, height: 7, borderRadius: 4 },
  rowMsg:  { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  rowMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  rowTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
