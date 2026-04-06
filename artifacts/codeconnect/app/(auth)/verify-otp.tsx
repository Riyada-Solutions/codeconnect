import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, backgroundColor: colors.card }]}>
      <Pressable style={[styles.backBtn, { backgroundColor: colors.inputBg }]} onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} color={colors.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Feather name="shield" size={28} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Verify your identity</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Enter the 6-digit code sent to your registered email
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg },
                digit ? { borderColor: colors.primary, backgroundColor: colors.primaryLight } : null,
              ]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Pressable style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyText}>Verify</Text>
        </Pressable>

        <View style={styles.resendRow}>
          <Text style={[styles.resendLabel, { color: colors.textMuted }]}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={[styles.countdown, { color: colors.textSecondary }]}>Resend in {countdown}s</Text>
          ) : (
            <Pressable onPress={() => setCountdown(59)}>
              <Text style={[styles.resendLink, { color: colors.primary }]}>Resend code</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  content: {
    alignItems: "center",
    paddingTop: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  otpInput: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  verifyButton: {
    height: 48,
    width: "100%",
    backgroundColor: "#2daaae",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  verifyText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Inter_500Medium",
  },
});
