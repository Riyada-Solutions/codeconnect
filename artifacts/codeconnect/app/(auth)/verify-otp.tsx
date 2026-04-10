import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";

const OTP_LEN = 4;

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LEN).fill(""));
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/login");
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  function handleChange(text: string, index: number) {
    if (text === "") {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    const digits = text.replace(/\D/g, "");
    if (!digits.length) return;

    setOtp((prev) => {
      const next = [...prev];

      if (digits.length > 1) {
        let writeAt = index;
        for (const ch of digits) {
          if (writeAt >= OTP_LEN) break;
          next[writeAt] = ch;
          writeAt += 1;
        }
        const focusIdx = Math.min(writeAt, OTP_LEN - 1);
        setTimeout(() => inputRefs.current[focusIdx]?.focus(), 0);
        return next;
      }

      next[index] = digits[digits.length - 1]!;
      if (index < OTP_LEN - 1) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
      }
      return next;
    });
  }

  function handleKeyPress(key: string, index: number, digit: string) {
    if (key !== "Backspace") return;
    if (digit) {
      handleChange("", index);
    } else if (index > 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
    }
  }

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < OTP_LEN) return;
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <View style={styles.header}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={goBack}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("verifyOtp.title")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("verifyOtp.subtitle")}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.iconCard, { backgroundColor: colors.card }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Feather name="shield" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("verifyOtp.verifyIdentity")}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t("verifyOtp.enterCode")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg },
                  digit ? { borderColor: colors.primary, backgroundColor: colors.primaryLight, color: colors.primary } : null,
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index, digit)}
                keyboardType="number-pad"
                maxLength={OTP_LEN}
                selectTextOnFocus
              />
            ))}
          </View>

          <CustomButton
            title={t("verifyOtp.verify")}
            onPress={handleVerify}
            widerPadding
            height={52}
            radius={16}
            style={styles.verifyButtonShadow}
          />

          <View style={styles.resendRow}>
            <Text style={[styles.resendLabel, { color: colors.textMuted }]}>{t("verifyOtp.didntReceive")} </Text>
            {countdown > 0 ? (
              <Text style={[styles.countdown, { color: colors.textSecondary }]}>
                {t("verifyOtp.resendIn")} {countdown}s
              </Text>
            ) : (
              <Pressable onPress={() => setCountdown(59)}>
                <Text style={[styles.resendLink, { color: colors.primary }]}>{t("verifyOtp.resendCode")}</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
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
  body: { gap: 16 },
  iconCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
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
    paddingHorizontal: 8,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  otpInput: {
    width: 46,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  verifyButtonShadow: {
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resendLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  countdown: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  resendLink: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
