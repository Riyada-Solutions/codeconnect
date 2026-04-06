import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import Badge from "@/components/ui/Badge";
import { alertsList } from "@/constants/mockData";
import { formatTime } from "@/utils/formatTime";

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [elapsed, setElapsed] = useState(0);

  const alert = alertsList.find((a) => a.id === id) || alertsList[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{alert.title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: alert.color }]}>
          <Text style={styles.heroCodeName}>{alert.type}</Text>
          <View style={styles.heroMeta}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroLocation}>{alert.location}</Text>
          </View>
          <View style={styles.timerRow}>
            <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
          </View>
          <Badge label={alert.status} variant={alert.status === "active" ? "urgent" : alert.status === "pending" ? "pending" : "resolved"} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Location Details</Text>
          <View style={styles.infoRow}>
            <Feather name="home" size={14} color="#2daaae" />
            <Text style={styles.infoLabel}>Building</Text>
            <Text style={styles.infoValue}>{alert.building}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="layers" size={14} color="#2daaae" />
            <Text style={styles.infoLabel}>Floor</Text>
            <Text style={styles.infoValue}>{alert.floor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="grid" size={14} color="#2daaae" />
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{alert.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="square" size={14} color="#2daaae" />
            <Text style={styles.infoLabel}>Room</Text>
            <Text style={styles.infoValue}>{alert.room}</Text>
          </View>
        </View>

        <View style={styles.respondersCard}>
          <Text style={styles.infoTitle}>Responders ({alert.respondersList.length})</Text>
          {alert.respondersList.length === 0 ? (
            <View style={styles.emptyResp}>
              <Feather name="users" size={24} color="#93b5b6" />
              <Text style={styles.emptyRespText}>No responders yet</Text>
            </View>
          ) : (
            alert.respondersList.map((r) => (
              <View key={r.id} style={styles.responderRow}>
                <Avatar initials={r.avatar} size={36} backgroundColor="#e4f7f7" textColor="#2daaae" />
                <View style={styles.responderInfo}>
                  <Text style={styles.responderName}>{r.name}</Text>
                  <Text style={styles.responderRole}>{r.role}</Text>
                </View>
                <Text style={styles.responderTime}>{r.respondedAt}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.respondBtn}>
            <Text style={styles.respondText}>Respond</Text>
          </Pressable>
          <Pressable style={styles.escalateBtn}>
            <Text style={styles.escalateText}>Escalate</Text>
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
  heroCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  heroCodeName: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroLocation: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
    width: 80,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
    flex: 1,
  },
  respondersCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  emptyResp: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  emptyRespText: {
    fontSize: 13,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  responderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  responderInfo: {
    flex: 1,
  },
  responderName: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
  },
  responderRole: {
    fontSize: 11,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  responderTime: {
    fontSize: 10,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  respondBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "#2daaae",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  respondText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  escalateBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2daaae",
    alignItems: "center",
    justifyContent: "center",
  },
  escalateText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#2daaae",
  },
});
