import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

const RED = "#D30000";
const NAVY = "#0f172a";
const INPUT_BORDER = "#cbd5e1";

const DELETE_TOKEN = "DELETE";

export default function DeleteAccountVerifyScreen() {
  const insets = useSafeAreaInsets();
  const { t, setBiometricLoginEnabled } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!password.trim() || confirmText.trim() !== DELETE_TOKEN) {
      if (!password.trim() || !confirmText.trim()) {
        Alert.alert(t("deleteAccount.title"), t("deleteAccount.fillFields"));
        return;
      }
      Alert.alert(t("deleteAccount.title"), t("deleteAccount.typeDeleteMismatch"));
      return;
    }

    setBusy(true);
    try {
      await AsyncStorage.setItem("app_biometric_login", "0");
      setBiometricLoginEnabled(false);
      Alert.alert(t("deleteAccount.doneTitle"), t("deleteAccount.doneMessage"), [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            <View style={styles.lockIconWrap}>
              <Feather name="lock" size={32} color={RED} />
            </View>
            <Text style={styles.cardTitle}>{t("deleteAccount.verifyTitle")}</Text>
            <Text style={styles.cardIntro}>{t("deleteAccount.verifySubtitle")}</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>{t("deleteAccount.passwordLabel")}</Text>
              <View style={styles.inputRow}>
                <Feather name="lock" size={16} color="#64748b" />
                <TextInput
                  style={styles.input}
                  placeholder={t("deleteAccount.passwordPlaceholder")}
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={16} color="#64748b" />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>{t("deleteAccount.typeDeleteLabel")}</Text>
              <View style={styles.inputRow}>
                <Feather name="alert-triangle" size={16} color="#64748b" />
                <TextInput
                  style={styles.input}
                  placeholder={t("deleteAccount.typeDeletePlaceholder")}
                  placeholderTextColor="#94a3b8"
                  value={confirmText}
                  onChangeText={setConfirmText}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningEmoji}>⚠️</Text>
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>{t("deleteAccount.finalWarningBold")}</Text>{" "}
                {t("deleteAccount.finalWarningBody")}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnBackWide, pressed && styles.pressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.btnBackWideLabel}>{t("deleteAccount.back")}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.btnDeleteWide,
                (pressed || busy) && styles.pressed,
                busy && styles.btnDisabled,
              ]}
              onPress={handleDelete}
              disabled={busy}
            >
              <Feather name="trash-2" size={18} color="#ffffff" />
              <Text style={styles.btnDeleteWideLabel}>{t("deleteAccount.deleteButton")}</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Text style={styles.footer}>{t("deleteAccount.footerHelp")}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  headerSub: {
    fontSize: 13,
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
    paddingVertical: 20,
    alignItems: "stretch",
  },
  lockIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ffe4e6",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: NAVY,
    marginBottom: 8,
    textAlign: "center",
  },
  cardIntro: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },
  fieldBlock: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#334155",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    backgroundColor: "#f8fafc",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: NAVY,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  warningEmoji: {
    fontSize: 18,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: RED,
    lineHeight: 19,
  },
  warningBold: {
    fontFamily: "Inter_700Bold",
  },
  btnBackWide: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnBackWideLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#475569",
  },
  btnDeleteWide: {
    flexDirection: "row",
    height: 48,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnDeleteWideLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  pressed: {
    opacity: 0.88,
  },
  btnDisabled: {
    opacity: 0.6,
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
