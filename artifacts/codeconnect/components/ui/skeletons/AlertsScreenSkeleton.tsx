import React from "react";
import { StyleSheet, View } from "react-native";
import { useApp } from "@/contexts/AppContext";
import Shimmer from "@/components/ui/Shimmer";

function AlertCardSkeleton() {
  const { colors } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.leftBorder, { backgroundColor: colors.border }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Shimmer width={10} height={10} borderRadius={5} />
          <Shimmer width="55%" height={13} borderRadius={6} />
        </View>
        <Shimmer width="40%" height={11} borderRadius={6} style={{ marginTop: 6 }} />
        <View style={styles.cardFooter}>
          <Shimmer width={64} height={22} borderRadius={11} />
          <Shimmer width={50} height={11} borderRadius={6} />
        </View>
      </View>
      <View style={styles.cardRight}>
        <Shimmer width={70} height={11} borderRadius={6} />
        <Shimmer width={28} height={28} borderRadius={8} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export default function AlertsScreenSkeleton() {
  const { colors } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Filter chips row */}
      <View style={[styles.filtersRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.filtersContent}>
          {[80, 70, 72, 66, 72].map((w, i) => (
            <Shimmer key={i} width={w} height={32} borderRadius={20} style={{ marginRight: 8 }} />
          ))}
        </View>
      </View>

      {/* Alert cards */}
      <View style={styles.list}>
        <AlertCardSkeleton />
        <AlertCardSkeleton />
        <AlertCardSkeleton />
        <AlertCardSkeleton />
        <AlertCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    borderBottomWidth: 0.5,
  },
  filtersContent: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  list: {
    padding: 14,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  leftBorder: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardRight: {
    padding: 12,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
