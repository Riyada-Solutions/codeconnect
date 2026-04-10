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

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LEN).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/forgot-password");
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  function handleOtpChange(text: string, index: number) {
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
        setTimeout(() => inputs.current[focusIdx]?.focus(), 0);
        return next;
      }

      next[index] = digits[digits.length - 1]!;
      if (index < OTP_LEN - 1) {
        setTimeout(() => inputs.current[index + 1]?.focus(), 0);
      }
      return next;
    });
  }

  function handleKeyPress(key: string, index: number, digit: string) {
    if (key !== "Backspace") return;
    if (digit) {
      handleOtpChange("", index);
    } else if (index > 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      setTimeout(() => inputs.current[index - 1]?.focus(), 0);
    }
  }

  function handleVerify() {
    const code = otp.join("");
    if (code.length < OTP_LEN) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/new-password");
    }, 800);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("otp.title")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("otp.enterFourDigit")}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.iconCard, { backgroundColor: colors.card }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Feather name="shield" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("otp.verifyCode")}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t("otp.verifyCodeDesc")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => {
                  inputs.current[i] = ref;
                }}
                style={[
                  styles.otpInput,
                  { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
                  digit ? { borderColor: colors.primary, backgroundColor: colors.primaryLight, color: colors.primary } : null,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, i)}
                keyboardType="number-pad"
                maxLength={OTP_LEN}
                selectTextOnFocus
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i, digit)}
              />
            ))}
          </View>

          <CustomButton
            title={t("otp.verifyAndContinue")}
            onPress={handleVerify}
            loading={loading}
            widerPadding
            height={52}
            radius={16}
            style={styles.verifyBtnShadow}
          />

          <View style={styles.bottomRow}>
            <Pressable>
              <Text style={[styles.resendText, { color: colors.primary }]}>{t("otp.resendCode")}</Text>
            </Pressable>
            <Pressable onPress={goBack}>
              <Text style={[styles.backText, { color: colors.textSecondary }]}>{t("otp.backToPrevious")}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
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
  verifyBtnShadow: {
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resendText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  backText: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
