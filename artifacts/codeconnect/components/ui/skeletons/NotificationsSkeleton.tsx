import React from "react";
import { StyleSheet, View } from "react-native";
import { useApp } from "@/contexts/AppContext";
import Shimmer from "@/components/ui/Shimmer";

function NotifCardSkeleton() {
  const { colors } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Shimmer width={36} height={36} borderRadius={10} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Shimmer width="55%" height={13} borderRadius={6} />
          <Shimmer width={6} height={6} borderRadius={3} />
        </View>
        <Shimmer width="85%" height={11} borderRadius={6} style={{ marginTop: 6 }} />
        <Shimmer width={40} height={10} borderRadius={5} style={{ marginTop: 5 }} />
      </View>
    </View>
  );
}

export default function NotificationsSkeleton() {
  const { colors } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 14, gap: 8 }}>
      <NotifCardSkeleton />
      <NotifCardSkeleton />
      <NotifCardSkeleton />
      <NotifCardSkeleton />
      <NotifCardSkeleton />
      <NotifCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
