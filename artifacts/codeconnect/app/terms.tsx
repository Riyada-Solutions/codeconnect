import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using CodeConnect, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the application. This agreement is between you and Emdad Arabia.",
  },
  {
    title: "2. Use of Service",
    content:
      "CodeConnect is designed exclusively for authorized hospital personnel to coordinate emergency responses. You agree to use the service only for its intended purpose, maintain the confidentiality of your login credentials, and report any unauthorized access immediately.",
  },
  {
    title: "3. User Responsibilities",
    content:
      "As a user, you are responsible for the accuracy of information you provide during emergency situations, responding promptly to emergency alerts within your scope, maintaining updated contact information, and following your hospital's emergency protocols.",
  },
  {
    title: "4. System Availability",
    content:
      "While we strive for 99.99% uptime, we do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance. Emergency maintenance may be performed without prior notice to ensure system security and reliability.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "CodeConnect is a coordination tool and does not replace professional medical judgment. Emdad Arabia shall not be liable for any decisions made based on information transmitted through the application. Users must always follow established medical protocols.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content, features, and functionality of CodeConnect are owned by Emdad Arabia and protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    title: "7. Modifications",
    content:
      "Emdad Arabia reserves the right to modify these terms at any time. Users will be notified of significant changes through the application. Continued use after modifications constitutes acceptance of updated terms.",
  },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.lastUpdated}>
            <Feather name="calendar" size={12} color="#93b5b6" />
            <Text style={styles.lastUpdatedText}>Effective: January 1, 2025</Text>
          </View>
          <Text style={styles.intro}>
            Please read these Terms of Service carefully before using the CodeConnect Emergency Response System operated by Emdad Arabia.
          </Text>
        </View>

        {terms.map((term, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{term.title}</Text>
            <Text style={styles.sectionContent}>{term.content}</Text>
          </View>
        ))}
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  lastUpdated: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastUpdatedText: {
    fontSize: 11,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  intro: {
    fontSize: 13,
    color: "#4a7072",
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#0d2526",
  },
  sectionContent: {
    fontSize: 13,
    color: "#4a7072",
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
