import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";

const FIELDS = [
  { icon: "key" as const, key: "registerCode", keyboard: "default" as const },
  { icon: "phone" as const, key: "phone", keyboard: "phone-pad" as const },
  { icon: "user" as const, key: "fullName", keyboard: "default" as const },
  { icon: "mail" as const, key: "emailAddress", keyboard: "email-address" as const },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();

  const [registerCode, setRegisterCode] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const values = [registerCode, phone, name, email];
  const setters = [setRegisterCode, setPhone, setName, setEmail];

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/verify-otp");
    }, 800);
  };

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("register.createAccount")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("register.desc")}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTag, { color: colors.primary }]}>{t("register.joinCodeConnect")}</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("register.createAccount")}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t("register.desc")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.formCard, { backgroundColor: colors.card }]}>
          {FIELDS.map((field, i) => (
            <View key={field.key} style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name={field.icon} size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={values[i]}
                onChangeText={setters[i]}
                placeholder={t(`register.${field.key}`)}
                placeholderTextColor={colors.textMuted}
                keyboardType={field.keyboard}
                autoCapitalize={field.key === "emailAddress" ? "none" : "words"}
              />
            </View>
          ))}

          <View style={[styles.branchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="map-pin" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={[styles.branchText, { color: colors.text }]}>{t("register.mainBranch")}</Text>
          </View>

          <CustomButton
            title={t("register.register")}
            onPress={handleRegister}
            loading={loading}
            widerPadding
            height={52}
            radius={16}
            style={styles.registerBtnShadow}
          />
        </Animated.View>

        <Pressable onPress={() => router.push("/(auth)/login")} style={styles.loginLink}>
          <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
            {t("register.alreadyHaveAccount")} <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{t("login.signIn")}</Text>
          </Text>
        </Pressable>
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
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTag: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 20, lineHeight: 28 },
  cardSub: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  formCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
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
  branchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  branchText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  registerBtnShadow: {
    marginTop: 4,
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  loginLink: { marginTop: 16, alignItems: "center" },
  loginLinkText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});
