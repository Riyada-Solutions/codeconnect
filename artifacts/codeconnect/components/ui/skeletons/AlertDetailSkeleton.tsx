import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useApp } from "@/contexts/AppContext";
import Shimmer from "@/components/ui/Shimmer";

function ResponderSkeleton() {
  const { colors } = useApp();
  return (
    <View style={[styles.responder, { borderBottomColor: colors.border }]}>
      <Shimmer width={38} height={38} borderRadius={19} />
      <View style={styles.responderInfo}>
        <Shimmer width="50%" height={13} borderRadius={6} />
        <Shimmer width="35%" height={11} borderRadius={6} style={{ marginTop: 5 }} />
      </View>
      <Shimmer width={48} height={11} borderRadius={6} />
    </View>
  );
}

export default function AlertDetailSkeleton() {
  const { colors } = useApp();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Hero card */}
      <View style={[styles.heroCard, { backgroundColor: colors.border }]}>
        <Shimmer width="40%" height={22} borderRadius={8} />
        <Shimmer width="60%" height={13} borderRadius={6} style={{ marginTop: 10 }} />
        <Shimmer width="35%" height={13} borderRadius={6} style={{ marginTop: 6 }} />
        <Shimmer width={72} height={24} borderRadius={12} style={{ marginTop: 10 }} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Shimmer width={28} height={28} borderRadius={14} />
            <Shimmer width={32} height={18} borderRadius={6} style={{ marginTop: 8 }} />
            <Shimmer width={48} height={11} borderRadius={6} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <Shimmer height={48} borderRadius={12} style={{ flex: 1 }} />
        <Shimmer height={48} borderRadius={12} style={{ flex: 1 }} />
      </View>

      {/* Responders section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Shimmer width="40%" height={15} borderRadius={6} style={styles.sectionTitle} />
        <ResponderSkeleton />
        <ResponderSkeleton />
        <ResponderSkeleton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  section: {
    borderRadius: 16,
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    marginVertical: 14,
  },
  responder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  responderInfo: {
    flex: 1,
    gap: 4,
  },
});
