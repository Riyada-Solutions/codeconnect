import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AlertCard from "@/components/ui/AlertCard";
import { alertsList } from "@/constants/mockData";

const FILTERS = ["All", "Code Red", "Code Blue", "Pending", "Resolved"];

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const insets = useSafeAreaInsets();

  const filtered = alertsList.filter((a) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return a.status === "pending";
    if (activeFilter === "Resolved") return a.status === "resolved";
    return a.type === activeFilter;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Active alerts</Text>
        <Pressable style={styles.filterIcon}>
          <Feather name="sliders" size={18} color="#ffffff" />
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterChip,
                activeFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        renderItem={({ item }) => (
          <AlertCard
            title={item.title}
            location={item.location}
            color={item.color}
            status={item.status}
            responders={item.responders}
            timestamp={item.timestamp}
            onPress={() => router.push(`/alert/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={40} color="#93b5b6" />
            <Text style={styles.emptyText}>No alerts found</Text>
          </View>
        }
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  filterIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  filtersRow: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.13)",
  },
  filtersContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.13)",
  },
  filterChipActive: {
    backgroundColor: "#2daaae",
    borderColor: "#2daaae",
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#4a7072",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  list: {
    padding: 14,
    gap: 10,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
});
