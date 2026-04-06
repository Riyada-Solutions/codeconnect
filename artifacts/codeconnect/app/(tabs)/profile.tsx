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

import Avatar from "@/components/ui/Avatar";
import { mockUser } from "@/constants/mockData";

interface MenuRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuRow({ icon, label, value, onPress, danger }: MenuRowProps) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Feather name={icon as any} size={16} color={danger ? "#ef4444" : "#2daaae"} />
      </View>
      <View style={styles.menuInfo}>
        <Text style={[styles.menuLabel, danger && styles.dangerText]}>{label}</Text>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      </View>
      {!danger && <Feather name="chevron-right" size={16} color="#93b5b6" />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>My profile</Text>
          <Pressable style={styles.editBtn} onPress={() => router.push("/edit-profile")}>
            <Feather name="edit-2" size={16} color="#ffffff" />
          </Pressable>
        </View>
        <View style={styles.heroCenter}>
          <Avatar
            initials={mockUser.initials}
            size={72}
            backgroundColor="rgba(255,255,255,0.2)"
            textColor="#ffffff"
            borderColor="rgba(255,255,255,0.3)"
            borderWidth={3}
          />
          <Text style={styles.heroName}>{mockUser.name}</Text>
          <Text style={styles.heroRole}>{mockUser.role}</Text>
          <View style={styles.hospitalBadge}>
            <Text style={styles.hospitalText}>{mockUser.hospital}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <MenuRow icon="mail" label="Email" value={mockUser.email} />
          <MenuRow icon="phone" label="Phone" value={mockUser.phone} />
          <MenuRow icon="briefcase" label="Department" value={mockUser.department} />
          <MenuRow icon="hash" label="Employee ID" value={mockUser.employeeId} />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SETTINGS</Text>
          </View>
          <MenuRow icon="bell" label="Notifications" onPress={() => router.push("/notifications")} />
          <MenuRow icon="moon" label="Appearance" onPress={() => router.push("/settings")} />
          <MenuRow icon="shield" label="Privacy & Security" onPress={() => router.push("/privacy")} />
          <MenuRow icon="help-circle" label="Help & Support" onPress={() => router.push("/settings")} />
          <MenuRow icon="file-text" label="Terms of Service" onPress={() => router.push("/terms")} />
          <MenuRow icon="info" label="About" onPress={() => router.push("/about")} />
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
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
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCenter: {
    alignItems: "center",
    gap: 6,
  },
  heroName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
    marginTop: 8,
  },
  heroRole: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  hospitalBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  hospitalText: {
    fontSize: 11,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
  },
  scroll: {
    flex: 1,
    marginTop: -18,
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#e4f7f7",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#2daaae",
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.08)",
    gap: 12,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#e4f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "#fef2f2",
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
  },
  menuValue: {
    fontSize: 11,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  dangerText: {
    color: "#ef4444",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginTop: 4,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#ef4444",
  },
});
