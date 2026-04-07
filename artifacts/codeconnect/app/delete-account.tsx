import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

const RED = "#D30000";
const NAVY = "#0f172a";
const PINK_BG = "#ffe4e6";
const PINK_SOFT = "#fff1f2";

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;

  const impactItems = [
    {
      icon: "trash-2" as const,
      title: t("deleteAccount.itemAlertsTitle"),
      sub: t("deleteAccount.itemAlertsSub"),
    },
    {
      icon: "lock" as const,
      title: t("deleteAccount.itemProfileTitle"),
      sub: t("deleteAccount.itemProfileSub"),
    },
    {
      icon: "alert-triangle" as const,
      title: t("deleteAccount.itemAccessTitle"),
      sub: t("deleteAccount.itemAccessSub"),
    },
  ];

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 8 }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable
          style={styles.backCircle}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("deleteAccount.back")}
        >
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{t("deleteAccount.title")}</Text>
          <Text style={styles.headerSub}>{t("deleteAccount.subtitle")}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.warnIconWrap}>
            <Feather name="alert-triangle" size={36} color={RED} />
          </View>
          <Text style={styles.cardTitle}>{t("deleteAccount.areYouSure")}</Text>
          <Text style={styles.cardIntro}>{t("deleteAccount.intro")}</Text>

          {impactItems.map((item) => (
            <View key={item.title} style={styles.impactRow}>
              <View style={styles.impactIcon}>
                <Feather name={item.icon} size={18} color={RED} />
              </View>
              <View style={styles.impactText}>
                <Text style={styles.impactTitle}>{item.title}</Text>
                <Text style={styles.impactSub}>{item.sub}</Text>
              </View>
            </View>
          ))}

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>{t("deleteAccount.noteBold")}</Text>{" "}
              {t("deleteAccount.noteBody")}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.btnCancel, pressed && styles.pressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.btnCancelLabel}>{t("deleteAccount.cancel")}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btnContinue, pressed && styles.pressed]}
              onPress={() => router.push("/delete-account-verify")}
            >
              <Text style={styles.btnContinueLabel}>{t("deleteAccount.continue")}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Text style={styles.footer}>{t("deleteAccount.footerHelp")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: RED,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 14,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
  },
  warnIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PINK_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: NAVY,
    marginBottom: 6,
    textAlign: "center",
  },
  cardIntro: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: PINK_BG,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 12,
  },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  impactText: {
    flex: 1,
    gap: 4,
  },
  impactTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: NAVY,
  },
  impactSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#64748b",
    lineHeight: 16,
  },
  noteBox: {
    width: "100%",
    backgroundColor: "#fef9c3",
    borderWidth: 1,
    borderColor: "#facc15",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 22,
  },
  noteText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#713f12",
    lineHeight: 19,
  },
  noteBold: {
    fontFamily: "Inter_700Bold",
  },
  actionsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#475569",
  },
  btnContinue: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContinueLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  pressed: {
    opacity: 0.88,
  },
  footer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingTop: 4,
  },
});
