import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CODES, getCodeByType } from "@/constants/codes";
import { useApp } from "@/contexts/AppContext";
import { formatTime } from "@/utils/formatTime";

export default function IncomingAlertScreen() {
  const params = useLocalSearchParams<{
    code: string;
    building: string;
    floor: string;
    room: string;
    department: string;
  }>();
  const insets = useSafeAreaInsets();
  const { colors, t, isDark } = useApp();
  const [elapsed, setElapsed] = useState(0);

  const codeData = getCodeByType(params.code || "Code Red") || CODES[1];
  const codeColor = codeData.color;

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

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

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleAccept = () => {
    router.replace("/(tabs)");
  };

  const handleReject = () => {
    router.replace("/(tabs)");
  };

  const bgColor = isDark ? "#0d1b1c" : "#111111";
  const cardBg = isDark ? "#1a2a2b" : "#1e1e1e";
  const textPrimary = "#ffffff";
  const textSecondary = isDark ? "#93b5b6" : "#9ca3af";

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: Platform.OS === "web" ? 67 : insets.top }]}>
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
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.actionRow}>
        <Pressable
          style={[styles.rejectBtn, { backgroundColor: isDark ? "#2a1a1a" : "#2a2a2a", borderColor: "#4a4a4a" }]}
          onPress={handleReject}
        >
          <Feather name="x-circle" size={18} color="#9ca3af" />
          <Text style={styles.rejectText}>{t("incoming.reject")}</Text>
        </Pressable>
        <Pressable style={[styles.acceptBtn, { backgroundColor: "#22c55e" }]} onPress={handleAccept}>
          <Feather name="check-circle" size={18} color="#ffffff" />
          <Text style={styles.acceptText}>{t("incoming.accept")}</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.footerSection}>
        <View style={styles.footerRow}>
          <Feather name="alert-triangle" size={14} color="#f59e0b" />
          <Text style={[styles.footerTitle, { color: textPrimary }]}>{t("incoming.quickResponse")}</Text>
        </View>
        <Text style={[styles.footerSubtext, { color: textSecondary }]}>{t("incoming.pleaseRespond")}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: 32,
  },
  heroContent: {
    alignItems: "center",
    gap: 10,
  },
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
  timerSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timerText: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  timerLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  locationLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  locationValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  rejectBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rejectText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#9ca3af",
  },
  acceptBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  acceptText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 28,
    gap: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
