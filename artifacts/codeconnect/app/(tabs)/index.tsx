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
import CodeButton from "@/components/ui/CodeButton";
import LiveDot from "@/components/ui/LiveDot";
import RequestCard from "@/components/ui/RequestCard";
import { CODES } from "@/constants/codes";
import { mockUser, activeRequests } from "@/constants/mockData";
import { getGreeting } from "@/utils/formatTime";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const displayCodes = CODES.slice(0, 6);

  const getGridColumns = (count: number) => {
    if (count <= 2) return count;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const columns = getGridColumns(displayCodes.length);

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
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyHeaderLeft}>
              <LiveDot color="#10b981" size={8} />
              <View>
                <Text style={styles.emergencyTitle}>Emergency request</Text>
                <Text style={styles.emergencySubtitle}>Tap a code to alert the team</Text>
              </View>
            </View>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{displayCodes.length} codes</Text>
            </View>
          </View>

          <View style={styles.codeGrid}>
            <View style={[styles.codeGridInner, { flexWrap: "wrap" }]}>
              {displayCodes.map((code) => (
                <View
                  key={code.id}
                  style={{ width: `${100 / columns - 2}%`, marginHorizontal: "1%" }}
                >
                  <CodeButton
                    code={code.type}
                    color={code.color}
                    icon={code.icon}
                    compact={columns > 3}
                    onPress={() => router.push(`/emergency/new?code=${code.type}`)}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACTIVE REQUESTS</Text>
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
    paddingBottom: 40,
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
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  emergencyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  emergencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.13)",
  },
  emergencyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emergencyTitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
  },
  emergencySubtitle: {
    fontSize: 11,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  codeBadge: {
    backgroundColor: "#e4f7f7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  codeBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#2daaae",
  },
  codeGrid: {
    backgroundColor: "#e4f7f7",
    padding: 14,
  },
  codeGridInner: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#93b5b6",
    letterSpacing: 0.5,
  },
  viewAll: {
    fontSize: 12,
    color: "#2daaae",
    fontFamily: "Inter_500Medium",
  },
  requestList: {
    gap: 8,
  },
});
