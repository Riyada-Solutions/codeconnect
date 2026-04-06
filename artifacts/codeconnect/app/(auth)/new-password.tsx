import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated as RNAnimated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

export default function NewPasswordScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const successScale = useRef(new RNAnimated.Value(0)).current;
  const confirmRef = useRef<TextInput>(null);

  function validate(): boolean {
    if (newPassword.length < 8) {
      setError(t("newPass.minLength"));
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError(t("newPass.mismatch"));
      return false;
    }
    return true;
  }

  function handleSave() {
    setError(null);
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      RNAnimated.spring(successScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 800);
  }

  if (success) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }]}>
        <RNAnimated.View style={[styles.successCircle, { backgroundColor: colors.primaryLight, transform: [{ scale: successScale }] }]}>
          <Feather name="check" size={40} color={colors.primary} />
        </RNAnimated.View>
        <Text style={[styles.successTitle, { color: colors.text }]}>{t("newPass.updated")}</Text>
        <Text style={[styles.successDesc, { color: colors.textSecondary }]}>{t("newPass.updatedDesc")}</Text>
        <Pressable style={styles.successBtn} onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.successBtnText}>{t("login.signIn")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("newPass.title")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("newPass.subtitle")}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.iconCard, { backgroundColor: colors.card }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Feather name="lock" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("newPass.setNewPassword")}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t("newPass.setNewDesc")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t("newPass.newPassword")}</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={newPassword}
                onChangeText={(v) => { setNewPassword(v); setError(null); }}
                placeholder={t("newPass.enterNew")}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showNew}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <Pressable onPress={() => setShowNew(!showNew)}>
                <Feather name={showNew ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t("newPass.confirmPassword")}</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                ref={confirmRef}
                style={[styles.input, { color: colors.text }]}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); setError(null); }}
                placeholder={t("newPass.enterConfirm")}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {error && (
            <View style={styles.errorRow}>
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveBtnText}>
              {loading ? t("register.loading") : t("newPass.updatePassword")}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderWidth: 1,
  },
  headerCenter: { flex: 1, gap: 4 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  body: { flex: 1, paddingHorizontal: 20 },
  iconCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 20, textAlign: "center" },
  cardSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldContainer: { gap: 8 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: "#ef4444",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  saveBtn: {
    backgroundColor: "#2daaae",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    marginBottom: 8,
  },
  successDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  successBtn: {
    backgroundColor: "#2daaae",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  successBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
