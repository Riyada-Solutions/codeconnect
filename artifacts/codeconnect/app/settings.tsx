import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>APPEARANCE</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="moon" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="bell" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={pushNotif}
              onValueChange={setPushNotif}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="volume-2" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Sound</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="smartphone" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Vibration</Text>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>EMERGENCY</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="zap" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Auto-Response</Text>
            <Switch
              value={autoResponse}
              onValueChange={setAutoResponse}
              trackColor={{ false: "#e0e0e0", true: "#2daaae" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SUPPORT</Text>
          </View>
          <Pressable style={styles.linkRow}>
            <View style={styles.settingIcon}>
              <Feather name="help-circle" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Help Center</Text>
            <Feather name="chevron-right" size={16} color="#93b5b6" />
          </Pressable>
          <Pressable style={styles.linkRow}>
            <View style={styles.settingIcon}>
              <Feather name="message-circle" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Contact Support</Text>
            <Feather name="chevron-right" size={16} color="#93b5b6" />
          </Pressable>
          <Pressable style={styles.linkRow}>
            <View style={styles.settingIcon}>
              <Feather name="flag" size={16} color="#2daaae" />
            </View>
            <Text style={styles.settingText}>Report a Bug</Text>
            <Feather name="chevron-right" size={16} color="#93b5b6" />
          </Pressable>
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.08)",
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#e4f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.08)",
    gap: 12,
  },
});
