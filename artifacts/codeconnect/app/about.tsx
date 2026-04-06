import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("about.title")}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.card }]}>
            <Image
              source={require("@/assets/images/logo.jpeg")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>CodeConnect</Text>
          <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0</Text>
          <View style={[styles.byBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.byText, { color: colors.primary }]}>By Emdad Arabia</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            CodeConnect is a comprehensive hospital emergency response coordination system designed to streamline communication and response times during critical situations.
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Our mission is to save lives by reducing emergency response times through real-time coordination, instant notifications, and seamless team communication across hospital departments.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("about.features")}</Text>
          <View style={styles.featureList}>
            {[
              { icon: "zap", text: "Real-time emergency alerts" },
              { icon: "users", text: "Team coordination" },
              { icon: "map-pin", text: "Location-based routing" },
              { icon: "clock", text: "Response time tracking" },
              { icon: "shield", text: "Secure communications" },
              { icon: "bar-chart-2", text: "Analytics dashboard" },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
                  <Feather name={f.icon as any} size={14} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("about.legal")}</Text>
          <Pressable style={[styles.linkRow, { borderBottomColor: colors.border }]} onPress={() => router.push("/privacy")}>
            <Text style={[styles.linkText, { color: colors.primary }]}>{t("privacy.title")}</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={[styles.linkRow, { borderBottomColor: colors.border }]} onPress={() => router.push("/terms")}>
            <Text style={[styles.linkText, { color: colors.primary }]}>{t("terms.title")}</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        </View>

        <Text style={[styles.copyright, { color: colors.textMuted }]}>
          2025 Emdad Arabia. All rights reserved.
        </Text>
      </ScrollView>
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
  logoSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
  },
  version: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  byBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  byText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  featureList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  linkText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  copyright: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
