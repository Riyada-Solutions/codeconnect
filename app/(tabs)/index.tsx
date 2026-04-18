import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "@/components/ui/Avatar";
import EmergencyCodeCard from "@/components/ui/EmergencyCodeCard";
import RequestCard from "@/components/ui/RequestCard";
import HomeScreenSkeleton from "@/components/ui/skeletons/HomeScreenSkeleton";
import { getCodeByType } from "@/constants/codes";
import { useApp } from "@/contexts/AppContext";
import { useHomeData, useCurrentUser } from "@/hooks/useHome";
import { getGreeting, timeAgo } from "@/utils/formatTime";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data: user, isLoading: userLoading, refetch: refetchUser } = useCurrentUser();
  const { data: homeData, isLoading: reqLoading, isError: reqError, refetch: refetchReq } = useHomeData();

  const activeRequests = homeData?.activeRequests;
  const codeTypes = homeData?.codeTypes ?? [];
  const unreadCount = homeData?.unreadNotificationCount ?? 0;

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchUser(), refetchReq()]);
    setRefreshing(false);
  };

  const initials = user?.initials ?? user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { paddingTop: topPad + 16, backgroundColor: colors.hero }]}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <Avatar initials={initials} size={36} />
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {userLoading ? "..." : (user?.name ?? "")}
              </Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Pressable style={styles.iconBtn} onPress={() => router.push("/notifications")}>
              <Feather name="bell" size={18} color={colors.heroText} />
              {unreadCount > 0 && (
                <View style={[styles.notifBadge, { borderColor: colors.hero, backgroundColor: colors.danger }]}>
                  <Text style={styles.notifBadgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {reqLoading || refreshing ? (
        <HomeScreenSkeleton />
      ) : (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle2, { color: colors.text }]}>{t("home.emergencyCodes")}</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>{t("home.quickAccess")}</Text>
          <View style={styles.codeList}>
            {codeTypes.map((code) => {
              const local = getCodeByType(code.name);
              return (
                <EmergencyCodeCard
                  key={code.id}
                  type={code.name}
                  description={code.description}
                  color={code.color}
                  icon={local?.icon ?? "alert-circle"}
                  onPress={() => router.push(`/emergency/new?code=${encodeURIComponent(code.name)}`)}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle2, { color: colors.text }]}>{t("home.activeRequests")}</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                {`${activeRequests?.length ?? 0} ${t("home.ongoingAlerts")}`}
              </Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/alerts")}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>{t("home.viewAll")}</Text>
            </Pressable>
          </View>

          {reqError ? (
            <Pressable onPress={() => refetchReq()} style={[styles.errorRow, { backgroundColor: colors.dangerBg }]}>
              <Feather name="alert-circle" size={16} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{t("common.errorRetap")}</Text>
            </Pressable>
          ) : (
            <View style={styles.requestList}>
              {(activeRequests ?? []).map((req) => (
                <RequestCard
                  key={req.id}
                  title={req.title}
                  location={req.location}
                  time={timeAgo(req.updatedAt)}
                  type={req.type}
                  color={req.color}
                  onPress={() => router.push(`/alert/${req.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: 20,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  greeting: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  heroRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    lineHeight: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionTitle2: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  codeList: {
    gap: 8,
  },
  requestList: {
    gap: 8,
  },
  loader: {
    marginTop: 20,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
