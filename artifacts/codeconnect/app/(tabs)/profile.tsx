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

import Avatar from "@/components/ui/Avatar";
import CustomButton from "@/components/ui/CustomButton";
import { mockUser } from "@/constants/mockData";
import { useApp } from "@/contexts/AppContext";
import type { ThemeColors } from "@/constants/theme";

interface MenuRowProps {
  icon: string;
  iconColor?: string;
  iconBg?: string;
  label: string;
  onPress?: () => void;
  colors: ThemeColors;
}

function MenuRow({ icon, iconColor, iconBg, label, onPress, colors }: MenuRowProps) {
  return (
    <Pressable
      style={[styles.menuRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg || colors.primaryLight }]}>
        <Feather name={icon as any} size={18} color={iconColor || colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, colors } = useApp();

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.heroCenter}>
          <Avatar
            initials={mockUser.initials}
            size={72}
            backgroundColor="rgba(255,255,255,0.2)"
            textColor="#ffffff"
            borderColor="rgba(255,255,255,0.3)"
            borderWidth={3}
          />
          <Text style={styles.heroName}>{mockUser.name}</Text>
          <Text style={styles.heroRole}>{mockUser.role}</Text>
          <View style={styles.hospitalBadge}>
            <Text style={styles.hospitalText}>{mockUser.hospital}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <MenuRow
            icon="user"
            iconColor="#2daaae"
            iconBg="#e4f7f7"
            label={t("profile.editProfile")}
            onPress={() => router.push("/edit-profile")}
            colors={colors}
          />
          <MenuRow
            icon="settings"
            iconColor="#6366f1"
            iconBg="#eef2ff"
            label={t("profile.settings")}
            onPress={() => router.push("/settings")}
            colors={colors}
          />
          <MenuRow
            icon="lock"
            iconColor="#f59e0b"
            iconBg="#fffbeb"
            label={t("profile.changePassword")}
            onPress={() => router.push("/change-password")}
            colors={colors}
          />
          <MenuRow
            icon="bell"
            iconColor="#ef4444"
            iconBg="#fef2f2"
            label={t("profile.notifications")}
            onPress={() => router.push("/notifications")}
            colors={colors}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <MenuRow
            icon="info"
            iconColor="#3b82f6"
            iconBg="#eff6ff"
            label={t("profile.about")}
            onPress={() => router.push("/about")}
            colors={colors}
          />
          <MenuRow
            icon="file-text"
            iconColor="#10b981"
            iconBg="#ecfdf5"
            label={t("profile.terms")}
            onPress={() => router.push("/terms")}
            colors={colors}
          />
          <MenuRow
            icon="shield"
            iconColor="#8b5cf6"
            iconBg="#f5f3ff"
            label={t("profile.privacy")}
            onPress={() => router.push("/privacy")}
            colors={colors}
          />
          <MenuRow
            icon="help-circle"
            iconColor="#2daaae"
            iconBg="#e4f7f7"
            label={t("profile.helpSupport")}
            onPress={() => router.push("/help-support")}
            colors={colors}
          />
        </View>

        <CustomButton onPress={handleLogout} color={colors.card} borderColor="#fecaca" height={50} radius={14}>
          <View style={styles.logoutInner}>
            <Feather name="log-out" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </View>
        </CustomButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingBottom: 40,
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
  heroCenter: {
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
  },
  heroName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
    marginTop: 10,
  },
  heroRole: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
  },
  hospitalBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  hospitalText: {
    fontSize: 11,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
  },
  scroll: {
    flex: 1,
    marginTop: -18,
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 14,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 58,
    borderBottomWidth: 0.5,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#ef4444",
  },
});
