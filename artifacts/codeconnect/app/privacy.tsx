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

import { useApp } from "@/contexts/AppContext";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, such as your name, email address, hospital affiliation, and employee identification. We also collect data about your use of the application, including emergency response times, alert interactions, and location data within hospital premises.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to facilitate emergency response coordination, maintain hospital safety protocols, generate response analytics, and improve the overall efficiency of the CodeConnect system. We do not sell or share your personal information with third parties.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures to protect your data, including end-to-end encryption for all communications, secure data storage with regular backups, and strict access controls. All data transmitted through CodeConnect is encrypted using TLS 1.3.",
  },
  {
    title: "Data Retention",
    content:
      "Emergency response data is retained for a minimum of 7 years as required by healthcare regulations. Personal account information is retained for the duration of your employment and deleted 90 days after account deactivation.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask for its deletion by contacting your hospital's IT department or our support team.",
  },
  {
    title: "Contact Us",
    content:
      "For privacy-related inquiries, please contact our Data Protection Officer at privacy@emdadarabia.com or through the in-app support channel.",
  },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("privacy.title")}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.lastUpdated}>
            <Feather name="calendar" size={12} color={colors.textMuted} />
            <Text style={[styles.lastUpdatedText, { color: colors.textMuted }]}>Last updated: March 15, 2025</Text>
          </View>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            Emdad Arabia is committed to protecting your privacy and ensuring the security of your personal information within the CodeConnect emergency response system.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    textAlign: "center",
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  card: {
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
    fontFamily: "Inter_400Regular",
  },
  intro: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  sectionCard: {
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  sectionContent: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
