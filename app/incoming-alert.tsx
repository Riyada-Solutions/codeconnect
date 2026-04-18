import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, Vibration, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import { CODES, getCodeByType } from "@/constants/codes";
import { useApp } from "@/contexts/AppContext";
import { formatTime } from "@/utils/formatTime";
import { useCurrentUser } from "@/hooks/useHome";

function buildSpeechText(
  language: string,
  code: string,
  department?: string,
  building?: string,
  floor?: string,
  room?: string,
  userName?: string,
): string {
  if (language === "ar") {
    return [
      `${code}. ${code}. `,
      department ? `${department} القسم.` : "",
      building ? `${building} المبنى.` : "",
      floor ? `${floor} الطابق.` : "",
      room ? `${room} الغرفة.` : "",
      "يرجى الاستجابة فوراً.",
      // userName ? `${userName}، يرجى الاستجابة.` : "",
    ].filter(Boolean).join(" ");
  }

  return [
    `${code}. ${code}. --`,
    building ? `building -- ${building} . --` : "",
    department ? `department -- ${department} . --` : "",
    floor ? `floor -- ${floor}. --` : "",
    room ? `room -- ${room}. --` : "",
    "Please respond immediately.",
    // userName ? `${userName}, please respond.` : "",
  ].filter(Boolean).join(" ");
} 

export default function IncomingAlertScreen() {
  const params = useLocalSearchParams<{
    code: string; 
    floor?: string;
    room?: string;
    department?: string;
    building?: string;
    notes?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { t, isDark, language } = useApp();
  const { data: user } = useCurrentUser();
  const [elapsed, setElapsed] = useState(0);

  const codeData = getCodeByType(params.code || "Code Red") || CODES[1];
  const codeColor = codeData.color;

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  const sirenRef = useRef<Audio.Sound | null>(null);

  // ── Tune these two values to control timing ──────────────────
  const SIREN_DURATION_MS = 3000; // how long siren plays before voice starts
  // ─────────────────────────────────────────────────────────────

  // Alarm + TTS on mount
  useEffect(() => {
    let cancelled = false;

    // Repeating urgent vibration
    const PATTERN = [0, 500, 300, 500, 300, 700];
    Vibration.vibrate(PATTERN, true);

    // Strong haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});

    // 1️⃣ Play siren first
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).then(() =>
      Audio.Sound.createAsync(
        require("@/assets/sounds/siren.wav"),
        { shouldPlay: true, isLooping: false, volume: 1.0 }
      )
    ).then(({ sound }) => {
      if (cancelled) { sound.unloadAsync(); return; }
      sirenRef.current = sound;
    }).catch(() => {});

    const speechText = buildSpeechText(
      language,
      params.code ?? "",
      params.department ?? "",
      params.building ?? "",
      params.floor ?? "",
      params.room ?? "",
      user?.name ?? "",
    );

    const lang = language === "ar" ? "ar-SA" : "en-US";
    let repeatCount = 0;

    const speak = (voiceId?: string) => {
      if (cancelled) return;
      Speech.speak(speechText, {
        language: lang,
        voice: voiceId,
        pitch: voiceId ? 1.0 : 0.7,
        rate: 1.05,
        onDone: () => {
          repeatCount += 1;
          if (repeatCount < 3 && !cancelled) {
            setTimeout(() => speak(voiceId), 1000);
          }
        },
      });
    };

    // 2️⃣ After siren finishes → start TTS voice
    const speechTimer = setTimeout(async () => {
      if (cancelled) return;
      // Stop siren when voice starts
      sirenRef.current?.stopAsync().catch(() => {});
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const maleVoice = voices.find(
          (v) =>
            v.language.startsWith(language === "ar" ? "ar" : "en") &&
            (v.identifier.toLowerCase().includes("male") ||
              v.name.toLowerCase().includes("male") ||
              ["aaron", "alex", "fred", "daniel", "oliver", "rishi", "thomas"].some((n) =>
                v.name.toLowerCase().includes(n)
              ) ||
              v.identifier.toLowerCase().includes("male_1"))
        );
        speak(maleVoice?.identifier);
      } catch {
        speak();
      }
    }, SIREN_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(speechTimer);
      Vibration.cancel();
      Speech.stop();
      sirenRef.current?.stopAsync().then(() => sirenRef.current?.unloadAsync()).catch(() => {});
      sirenRef.current = null;
    };
  }, []);

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.2, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const stopAlarm = () => {
    Vibration.cancel();
    Speech.stop();
    sirenRef.current?.stopAsync().then(() => sirenRef.current?.unloadAsync()).catch(() => {});
    sirenRef.current = null;
  };

  const handleAccept = () => {
    stopAlarm();
    router.replace("/(tabs)");
  };

  const handleReject = () => {
    stopAlarm();
    router.replace("/(tabs)");
  };

  const bgColor = isDark ? "#0d1b1c" : "#111111";
  const cardBg = isDark ? "#1a2a2b" : "#1e1e1e";
  const textPrimary = "#ffffff";
  const textSecondary = isDark ? "#93b5b6" : "#9ca3af";

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const actionsBarInset = 12 + 52 + Math.max(insets.bottom, 16) + 8;

  return (
    <View style={[styles.root, { backgroundColor: bgColor, paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: actionsBarInset }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[styles.heroBanner, { backgroundColor: codeColor }]}
        >
          <View style={styles.heroContent}>
            <View style={styles.iconContainer}>
              <Animated.View style={[styles.iconPulseRing, { borderColor: "rgba(255,255,255,0.3)" }, pulseStyle]} />
              <View style={styles.iconCircle}>
                <Feather name={codeData.icon as any} size={28} color={codeColor} />
              </View>
            </View>
            <Animated.Text entering={FadeInUp.delay(200).duration(400)} style={styles.codeTitle}>
              {codeData.type.toUpperCase()}
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(300).duration(400)} style={styles.codeSubtitle}>
              {t("incoming.incomingAlert")}
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.timerSection}>
          <View style={styles.timerRow}>
            <Feather name="clock" size={16} color={codeColor} />
            <Text style={[styles.timerText, { color: textPrimary }]}>{formatTime(elapsed)}</Text>
            <Feather name="clock" size={16} color={codeColor} />
          </View>
          <Text style={[styles.timerLabel, { color: textSecondary }]}>{t("incoming.timeElapsed")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={[styles.locationCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.locationTitle, { color: textSecondary }]}>{t("incoming.locationDetails")}</Text>

          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: codeColor + "20" }]}>
              <Feather name="home" size={16} color={codeColor} />
            </View>
            <View>
              <Text style={[styles.locationLabel, { color: textSecondary }]}>{t("alertDetail.building")}</Text>
              <Text style={[styles.locationValue, { color: textPrimary }]}>{params.building || "Main Hospital"}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: codeColor + "20" }]}>
              <Feather name="navigation" size={16} color={codeColor} />
            </View>
            <View>
              <Text style={[styles.locationLabel, { color: textSecondary }]}>{t("incoming.floorRoom")}</Text>
              <Text style={[styles.locationValue, { color: textPrimary }]}>
                {params.floor || "3rd Floor"} - {params.room || "Room 305"}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: codeColor + "20" }]}>
              <Feather name="map-pin" size={16} color={codeColor} />
            </View>
            <View>
              <Text style={[styles.locationLabel, { color: textSecondary }]}>{t("alertDetail.department")}</Text>
              <Text style={[styles.locationValue, { color: textPrimary }]}>{params.department || "Cardiology"}</Text>
            </View>
          </View>

          {params.notes ? (
            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, { backgroundColor: codeColor + "20" }]}>
                <Feather name="file-text" size={16} color={codeColor} />
              </View>
              <View style={styles.notesValueWrap}>
                <Text style={[styles.locationLabel, { color: textSecondary }]}>{t("alertDetail.notes")}</Text>
                <Text style={[styles.locationValue, { color: textPrimary }]}>{params.notes}</Text>
              </View>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.footerSection}>
          <View style={styles.footerRow}>
            <Feather name="alert-triangle" size={14} color="#f59e0b" />
            <Text style={[styles.footerTitle, { color: textPrimary }]}>{t("incoming.quickResponse")}</Text>
          </View>
          <Text style={[styles.footerSubtext, { color: textSecondary }]}>{t("incoming.pleaseRespond")}</Text>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.actionsBar,
          {
            backgroundColor: bgColor,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <View style={styles.actionRow}>
          <View style={styles.actionBtnFlex}>
            <CustomButton
              onPress={handleReject}
              isOutlined
              borderColor="#6b7280"
              height={52}
              radius={14}
              widerPadding
              style={styles.actionBtnWide}
            >
              <View style={styles.actionBtnInner}>
                <Feather name="x-circle" size={18} color="#9ca3af" />
                <Text style={styles.rejectText}>{t("incoming.reject")}</Text>
              </View>
            </CustomButton>
          </View>
          <View style={styles.actionBtnFlex}>
            <CustomButton
              onPress={handleAccept}
              color="#22c55e"
              borderColor="#16a34a"
              height={52}
              radius={14}
              widerPadding
              style={styles.actionBtnWide}
            >
              <View style={styles.actionBtnInner}>
                <Feather name="check-circle" size={18} color="#ffffff" />
                <Text style={styles.acceptText}>{t("incoming.accept")}</Text>
              </View>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1, minHeight: 0 },
  scrollContent: { flexGrow: 1 },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: 32,
  },
  heroContent: { alignItems: "center", gap: 10 },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconPulseRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  codeTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    letterSpacing: 2,
  },
  codeSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  timerSection: { alignItems: "center", paddingVertical: 20, gap: 4 },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  timerText: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: 4 },
  timerLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  locationCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    gap: 18,
  },
  locationTitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  locationLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  locationValue: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 1 },
  notesValueWrap: { flex: 1 },
  actionsBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  actionRow: { flexDirection: "row", gap: 12, alignItems: "stretch" },
  actionBtnFlex: { flex: 1, minWidth: 0 },
  actionBtnWide: { alignSelf: "stretch", width: "100%" },
  actionBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rejectText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#9ca3af" },
  acceptText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#ffffff" },
  footerSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footerSubtext: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
