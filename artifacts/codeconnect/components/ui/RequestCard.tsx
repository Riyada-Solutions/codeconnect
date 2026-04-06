import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Badge from "./Badge";

interface RequestCardProps {
  title: string;
  location: string;
  time: string;
  type: "urgent" | "pending" | "transit" | "active" | "resolved";
  color: string;
  onPress: () => void;
}

export default function RequestCard({ title, location, time, type, color, onPress }: RequestCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: color + "18" }]}>
        <Feather
          name={type === "urgent" ? "alert-circle" : type === "transit" ? "truck" : "clock"}
          size={18}
          color={color}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.meta}>
          <Feather name="map-pin" size={10} color="#93b5b6" />
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <Badge label={type} variant={type} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.13)",
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 10,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  time: {
    fontSize: 10,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
    marginLeft: 8,
  },
});
