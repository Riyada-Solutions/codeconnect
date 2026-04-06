import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  function handleOtpChange(text: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/new-password");
    }, 800);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("otp.title")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("otp.enterSixDigit")}</Text>
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
                ref={(ref) => { inputs.current[i] = ref; }}
                style={[
                  styles.otpInput,
                  { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
                  digit ? { borderColor: colors.primary, backgroundColor: colors.primaryLight, color: colors.primary } : null,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text.slice(-1), i)}
                keyboardType="number-pad"
                maxLength={1}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !digit && i > 0) inputs.current[i - 1]?.focus();
                }}
              />
            ))}
          </View>

          <Pressable style={styles.verifyBtn} onPress={handleVerify} disabled={loading}>
            <Text style={styles.verifyBtnText}>
              {loading ? t("register.loading") : t("otp.verifyAndContinue")}
            </Text>
          </Pressable>

          <View style={styles.bottomRow}>
            <Pressable>
              <Text style={[styles.resendText, { color: colors.primary }]}>{t("otp.resendCode")}</Text>
            </Pressable>
            <Pressable onPress={() => router.back()}>
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
  verifyBtn: {
    backgroundColor: "#2daaae",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  verifyBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resendText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  backText: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
