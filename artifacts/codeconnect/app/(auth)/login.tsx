import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

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
      router.replace("/(auth)/verify-otp");
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.hero }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 40, paddingBottom: insets.bottom + 24 }]}
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
          <Text style={styles.brandSubtitle}>{t("login.platformSubtitle")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>{t("login.welcome")}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t("login.signInSubtitle")}</Text>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t("login.username")}</Text>
            <View style={[
              styles.inputWrapper,
              { backgroundColor: colors.inputBg, borderColor: colors.border },
              errors.username && styles.inputError,
            ]}>
              <Feather name="user" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={username}
                onChangeText={(v) => { setUsername(v); setErrors((e) => ({ ...e, username: undefined })); }}
                placeholder={t("login.enterUsername")}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t("login.password")}</Text>
            <View style={[
              styles.inputWrapper,
              { backgroundColor: colors.inputBg, borderColor: colors.border },
              errors.password && styles.inputError,
            ]}>
              <Feather name="lock" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
                placeholder={t("login.enterPassword")}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
              </Pressable>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <Pressable onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotBtn}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>{t("login.forgotPassword")}</Text>
          </Pressable>

          <AnimatedPressable
            style={[styles.button, buttonStyle, loading && styles.buttonDisabled]}
            onPressIn={() => { buttonScale.value = withSpring(0.97); }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
            onPress={handleLogin}
            disabled={loading}
          >
            <View style={styles.buttonInner}>
              {loading ? (
                <Text style={styles.buttonText}>{t("login.signingIn")}</Text>
              ) : (
                <>
                  <Text style={styles.buttonText}>{t("login.signIn")}</Text>
                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </View>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.registerRow}>
          <Text style={styles.registerText}>{t("login.dontHaveAccount")} </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>{t("login.createAccount")}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footer}>
          <Feather name="shield" size={12} color="rgba(255,255,255,0.4)" />
          <Text style={styles.footerText}>{t("login.secureData")}</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    minHeight: "100%",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 16,
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
    borderColor: "rgba(255,255,255,0.2)",
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
  brandSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 28,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
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
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  button: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    backgroundColor: "#2daaae",
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
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
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  registerLink: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_400Regular",
  },
});
