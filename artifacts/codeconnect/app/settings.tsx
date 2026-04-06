import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { lightTheme, darkTheme } from "@/constants/theme";
import { useApp } from "@/contexts/AppContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, isDark, toggleTheme, language, setLanguage } = useApp();
  const colors = isDark ? darkTheme : lightTheme;
  const [pushNotif, setPushNotif] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("settings.title")}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.sectionLabel}>{t("settings.appearance").toUpperCase()}</Text>
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="moon" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.darkMode")}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.sectionLabel}>{t("settings.language").toUpperCase()}</Text>
          </View>
          <Pressable
            style={[styles.langRow, { borderBottomColor: colors.border }]}
            onPress={() => setLanguage("en")}
          >
            <View style={[styles.settingIcon, { backgroundColor: "#eff6ff" }]}>
              <Text style={styles.langFlag}>EN</Text>
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.english")}</Text>
            <View style={[styles.radio, language === "en" && styles.radioActive]}>
              {language === "en" && <View style={styles.radioInner} />}
            </View>
          </Pressable>
          <Pressable
            style={[styles.langRow, { borderBottomColor: colors.border }]}
            onPress={() => setLanguage("ar")}
          >
            <View style={[styles.settingIcon, { backgroundColor: "#ecfdf5" }]}>
              <Text style={styles.langFlag}>AR</Text>
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.arabic")}</Text>
            <View style={[styles.radio, language === "ar" && styles.radioActive]}>
              {language === "ar" && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.sectionLabel}>{t("settings.notifications").toUpperCase()}</Text>
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="bell" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.pushNotifications")}</Text>
            <Switch
              value={pushNotif}
              onValueChange={setPushNotif}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="volume-2" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.sound")}</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="smartphone" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.vibration")}</Text>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.sectionLabel}>{t("settings.emergency").toUpperCase()}</Text>
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="zap" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{t("settings.autoResponse")}</Text>
            <Switch
              value={autoResponse}
              onValueChange={setAutoResponse}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
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
    gap: 14,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#2daaae",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 54,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 54,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  langFlag: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#2daaae",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#2daaae",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2daaae",
  },
});
