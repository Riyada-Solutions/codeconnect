import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";

/** Reference UI: teal hero fading to deep teal (light) / darker slate (dark). */
const LOGIN_GRADIENT_LIGHT: [string, string] = ["#0d9488", "#042f2e"];
const LOGIN_GRADIENT_DARK: [string, string] = ["#115e59", "#022c22"];

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const insets = useSafeAreaInsets();
  const { colors, t, biometricLoginEnabled, isDark } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const gradientColors = isDark ? LOGIN_GRADIENT_DARK : LOGIN_GRADIENT_LIGHT;

  /** Setting alone controls visibility; hardware/enrollment checks often fail on emulators or before OS setup. */
  const showBiometricButton = biometricLoginEnabled && Platform.OS !== "web";

  const handleBiometricLogin = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        Alert.alert(t("login.biometricUnavailableTitle"), t("login.biometricUnavailableMessage"));
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("login.signIn"),
        cancelLabel: t("otp.backToPrevious"),
      });
      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch {
      Alert.alert(t("login.biometricUnavailableTitle"), t("login.biometricUnavailableMessage"));
    }
  };

  const handleLogin = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = t("login.usernameRequired");
    if (!password.trim()) newErrors.password = t("login.passwordRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 800);
  };

  const goGuest = () => {
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={gradientColors} style={styles.flex} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: topPad + 32, paddingBottom: insets.bottom + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.duration(500)} style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPulse} />
              <View style={styles.logoCircle}>
                <Image
                  source={require("@/assets/images/logo.jpeg")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.brandName}>CodeConnect</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.title, { color: colors.text }]}>{t("login.welcome")}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t("login.signInSubtitle")}</Text>

            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t("login.username")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                  errors.username && styles.inputError,
                ]}
              >
                <Feather name="user" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={username}
                  onChangeText={(v) => {
                    setUsername(v);
                    setErrors((e) => ({ ...e, username: undefined }));
                  }}
                  placeholder={t("login.enterUsername")}
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t("login.password")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                  errors.password && styles.inputError,
                ]}
              >
                <Feather name="lock" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  placeholder={t("login.enterPassword")}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <Pressable onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>{t("login.forgotPassword")}</Text>
            </Pressable>

            <View style={styles.loginActionsRow}>
              <View style={styles.buttonFlex}>
                <CustomButton
                  onPress={handleLogin}
                  loading={loading}
                  widerPadding
                  height={52}
                  radius={16}
                  style={styles.buttonShadow}
                >
                  <View style={styles.buttonInner}>
                    <Text style={styles.buttonText}>{t("login.signIn")}</Text>
                    <Feather name="arrow-right" size={18} color="#fff" />
                  </View>
                </CustomButton>
              </View>
              {showBiometricButton ? (
                <CustomButton
                  onPress={() => {
                    void handleBiometricLogin();
                  }}
                  width={56}
                  height={56}
                  radius={16}
                  isOutlined
                  borderColor={isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}
                  color={isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"}
                  testID="biometric-login"
                >
                  <View style={styles.biometricIconRow}>
                    {/* <MaterialCommunityIcons name="face-man-profile" size={18} color={colors.primary} /> */}
                    <MaterialCommunityIcons name="fingerprint" size={28} color={colors.primary} />                              </View>
                </CustomButton>
              ) : null}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(380).duration(500)} style={styles.registerRow}>
            <Text style={styles.registerText}>{t("login.dontHaveAccount")} </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>{t("login.createAccount")}</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(440).duration(500)} style={styles.guestWrap}>
            <CustomButton
              onPress={goGuest}
              isOutlined
              borderColor="rgba(255,255,255,0.92)"
              height={52}
              radius={16}
              widerPadding
              style={styles.guestButton}
            >
              <View style={styles.guestInner}>
                <Feather name="user" size={18} color="#ffffff" />
                <Text style={styles.guestLabel}>{t("login.continueAsGuest")}</Text>
              </View>
            </CustomButton>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footer}>
            <Feather name="shield" size={12} color="rgba(255,255,255,0.45)" />
            <Text style={styles.footerText}>{t("login.secureData")}</Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    minHeight: "100%",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoPulse: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  brandName: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  heroWelcome: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.88)",
    marginTop: 6,
  },
  card: {
    borderRadius: 28,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 26,
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  loginActionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginTop: 6,
  },
  buttonFlex: {
    flex: 1,
    minWidth: 0,
  },
  biometricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  buttonShadow: {
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    flexWrap: "wrap",
  },
  registerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.72)",
  },
  registerLink: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  guestWrap: {
    marginTop: 14,
  },
  guestButton: {
    backgroundColor: "transparent",
  },
  guestInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  guestLabel: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
