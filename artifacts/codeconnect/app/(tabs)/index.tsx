import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "@/components/ui/Avatar";
import EmergencyCodeCard from "@/components/ui/EmergencyCodeCard";
import RequestCard from "@/components/ui/RequestCard";
import { CODES } from "@/constants/codes";
import { mockUser, activeRequests } from "@/constants/mockData";
import { getGreeting } from "@/utils/formatTime";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: topPad + 16 }]}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <Avatar initials={mockUser.initials} size={36} />
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <Text style={styles.userRole}>{mockUser.role} - {mockUser.hospital}</Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Pressable style={styles.iconBtn}>
              <Feather name="search" size={18} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => router.push("/notifications")}>
              <Feather name="bell" size={18} color="#ffffff" />
              <View style={styles.notifDot} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle2}>Emergency Codes</Text>
          <Text style={styles.sectionSubtitle}>Quick access to create alerts</Text>
          <View style={styles.codeList}>
            {CODES.map((code) => (
              <EmergencyCodeCard
                key={code.id}
                type={code.type}
                description={code.description}
                color={code.color}
                icon={code.icon}
                onPress={() => router.push(`/emergency/new?code=${code.type}`)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle2}>Active Requests</Text>
              <Text style={styles.sectionSubtitle}>{activeRequests.length} ongoing alerts</Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/alerts")}>
              <Text style={styles.viewAll}>View all</Text>
            </Pressable>
          </View>
          <View style={styles.requestList}>
            {activeRequests.map((req) => (
              <RequestCard
                key={req.id}
                title={req.title}
                location={req.location}
                time={req.updatedAt}
                type={req.type}
                color={req.color}
                onPress={() => router.push(`/alert/${req.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f5f5",
  },
  hero: {
    backgroundColor: "#2daaae",
    paddingHorizontal: 14,
    paddingBottom: 20,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: 20,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  greeting: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  userRole: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  heroRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: "#2daaae",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionTitle2: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: "#0d2526",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    color: "#2daaae",
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  codeList: {
    gap: 8,
  },
  requestList: {
    gap: 8,
  },
});
