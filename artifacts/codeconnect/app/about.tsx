import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image
              source={require("@/assets/images/logo.jpeg")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>CodeConnect</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <View style={styles.byBadge}>
            <Text style={styles.byText}>By Emdad Arabia</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>
            CodeConnect is a comprehensive hospital emergency response coordination system designed to streamline communication and response times during critical situations.
          </Text>
          <Text style={styles.description}>
            Our mission is to save lives by reducing emergency response times through real-time coordination, instant notifications, and seamless team communication across hospital departments.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          <View style={styles.featureList}>
            {[
              { icon: "zap", text: "Real-time emergency alerts" },
              { icon: "users", text: "Team coordination" },
              { icon: "map-pin", text: "Location-based routing" },
              { icon: "clock", text: "Response time tracking" },
              { icon: "shield", text: "Secure communications" },
              { icon: "bar-chart-2", text: "Analytics dashboard" },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Feather name={f.icon as any} size={14} color="#2daaae" />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal</Text>
          <Pressable style={styles.linkRow} onPress={() => router.push("/privacy")}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Feather name="chevron-right" size={16} color="#93b5b6" />
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => router.push("/terms")}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Feather name="chevron-right" size={16} color="#93b5b6" />
          </Pressable>
        </View>

        <Text style={styles.copyright}>
          2025 Emdad Arabia. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f5f5",
  },
  header: {
    backgroundColor: "#2daaae",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
    textAlign: "center",
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  logoSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    color: "#0d2526",
  },
  version: {
    fontSize: 12,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  byBadge: {
    backgroundColor: "#e4f7f7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  byText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#2daaae",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  description: {
    fontSize: 13,
    color: "#4a7072",
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#0d2526",
    marginBottom: 4,
  },
  featureList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#e4f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 13,
    color: "#0d2526",
    fontFamily: "Inter_400Regular",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.08)",
  },
  linkText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#2daaae",
  },
  copyright: {
    textAlign: "center",
    fontSize: 11,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
