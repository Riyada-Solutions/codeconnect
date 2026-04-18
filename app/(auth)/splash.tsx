import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { getMe } from "@/data/auth_repository";

export default function SplashScreen() {
  const queryClient = useQueryClient();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const badgeTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animations
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) });
    textOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    badgeOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    badgeTranslateY.value = withDelay(600, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));

    // Auth check + minimum display time run in parallel
    const checkAuth = async (): Promise<"home" | "login"> => {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return "login";

      try {
        // Token exists — verify it is still valid by calling /me
        const user = await getMe();
        // Seed React Query cache so screens don't refetch immediately
        queryClient.setQueryData(["me"], user);
        return "home";
      } catch (error: any) {
        // Only clear token on auth errors (401 / 403 / 404 = token invalid or expired)
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          await AsyncStorage.removeItem("access_token");
          queryClient.clear();
          return "login";
        }
        // Network / SSL error — keep token and go home optimistically
        return "home";
      }
    };

    Promise.all([
      checkAuth(),
      new Promise<void>((resolve) => setTimeout(resolve, 1800)), // minimum splash time
    ]).then(([destination]) => {
      router.replace(destination === "home" ? "/(tabs)" : "/(auth)/login");
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ translateY: badgeTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoCircle, logoStyle]}>
          <Image
            source={require("@/assets/images/logo.jpeg")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.appName, textStyle]}>CodeConnect</Animated.Text>
        <Animated.Text style={[styles.subtitle, textStyle]}>Emdad Arabia</Animated.Text>
      </View>

      <Animated.View style={[styles.badge, badgeStyle]}>
        <Text style={styles.badgeText}>Emergency Response System</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2daaae",
    alignItems: "center",
    justifyContent: "center",
  },
  decorCircle1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: 40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  center: {
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 28,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  badge: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
  },
});
