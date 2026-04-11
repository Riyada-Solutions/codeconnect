import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import CustomButton from "@/components/ui/CustomButton";
import AlertDetailSkeleton from "@/components/ui/skeletons/AlertDetailSkeleton";
import { useApp } from "@/contexts/AppContext";
import { useAlertDetail } from "@/hooks/useAlerts";
import { formatTime } from "@/utils/formatTime";

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const [elapsed, setElapsed] = useState(0);

  const { data: alert, isLoading, isError, error, refetch } = useAlertDetail(id ?? "");

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]} numberOfLines={1}>
          {isLoading ? "..." : (alert?.title ?? "")}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {isLoading ? (
        <AlertDetailSkeleton />
      ) : isError || !alert ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Feather name="alert-circle" size={40} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error?.message ?? t("common.errorGeneric")}
          </Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
            <Text style={[styles.retryText, { color: colors.heroText }]}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroCard, { backgroundColor: alert.color }]}>
            <Text style={styles.heroCodeName}>{alert.type}</Text>
            <View style={styles.heroMeta}>
              <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroLocation}>{alert.location}</Text>
            </View>
            <View style={styles.timerRow}>
              <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
            </View>
            <Badge label={alert.status} variant={alert.status === "active" ? "urgent" : alert.status === "pending" ? "pending" : "resolved"} />
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>{t("alertDetail.locationDetails")}</Text>
            <View style={styles.infoRow}>
              <Feather name="home" size={14} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t("alertDetail.building")}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{alert.building}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="layers" size={14} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t("alertDetail.floor")}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{alert.floor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="grid" size={14} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t("alertDetail.department")}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{alert.department}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="square" size={14} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t("alertDetail.room")}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{alert.room}</Text>
            </View>
          </View>

          <View style={[styles.respondersCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>{t("alertDetail.responders")} ({alert.respondersList.length})</Text>
            {alert.respondersList.length === 0 ? (
              <View style={styles.emptyResp}>
                <Feather name="users" size={24} color={colors.textMuted} />
                <Text style={[styles.emptyRespText, { color: colors.textMuted }]}>{t("alertDetail.noResponders")}</Text>
              </View>
            ) : (
              alert.respondersList.map((r) => (
                <View key={r.id} style={styles.responderRow}>
                  <Avatar initials={r.avatar} size={36} backgroundColor={colors.primaryLight} textColor={colors.primary} />
                  <View style={styles.responderInfo}>
                    <Text style={[styles.responderName, { color: colors.text }]}>{r.name}</Text>
                    <Text style={[styles.responderRole, { color: colors.textMuted }]}>{r.role}</Text>
                  </View>
                  <Text style={[styles.responderTime, { color: colors.textMuted }]}>{r.respondedAt}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.actions}>
            <View style={styles.actionFlex}>
              <CustomButton title={t("alertDetail.respond")} onPress={() => {}} color={colors.primary} height={48} style={styles.actionGrow} />
            </View>
            <View style={styles.actionFlex}>
              <CustomButton
                title={t("alertDetail.escalate")}
                onPress={() => {}}
                isOutlined
                borderColor={colors.primary}
                textColor={colors.primary}
                height={48}
                fontSize={15}
                style={styles.actionGrow}
              />
            </View>
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
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  heroCodeName: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroLocation: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    width: 80,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  respondersCard: {
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  emptyResp: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  emptyRespText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  responderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  responderInfo: {
    flex: 1,
  },
  responderName: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  responderRole: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  responderTime: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  actionFlex: {
    flex: 1,
  },
  actionGrow: {
    flex: 1,
    alignSelf: "stretch",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
