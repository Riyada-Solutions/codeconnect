import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useApp } from "@/contexts/AppContext";
import Shimmer from "@/components/ui/Shimmer";

function CodeCardSkeleton() {
  const { colors } = useApp();
  return (
    <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Shimmer width={40} height={40} borderRadius={10} />
      <View style={styles.codeCardInfo}>
        <Shimmer width="50%" height={13} borderRadius={6} />
        <Shimmer width="75%" height={11} borderRadius={6} style={{ marginTop: 6 }} />
      </View>
      <Shimmer width={60} height={22} borderRadius={11} />
    </View>
  );
}

function RequestCardSkeleton() {
  const { colors } = useApp();
  return (
    <View style={[styles.requestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Shimmer width={40} height={40} borderRadius={10} />
      <View style={styles.requestCardInfo}>
        <Shimmer width="60%" height={13} borderRadius={6} />
        <Shimmer width="80%" height={11} borderRadius={6} style={{ marginTop: 6 }} />
      </View>
      <Shimmer width={56} height={22} borderRadius={11} />
    </View>
  );
}

export default function HomeScreenSkeleton() {
  const { colors } = useApp();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Section title */}
      <Shimmer width="45%" height={16} borderRadius={8} />
      <Shimmer width="30%" height={11} borderRadius={6} style={{ marginTop: 6, marginBottom: 14 }} />

      {/* Emergency code cards */}
      <View style={styles.list}>
        <CodeCardSkeleton />
        <CodeCardSkeleton />
        <CodeCardSkeleton />
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View>
          <Shimmer width={140} height={16} borderRadius={8} />
          <Shimmer width={90} height={11} borderRadius={6} style={{ marginTop: 6 }} />
        </View>
        <Shimmer width={48} height={13} borderRadius={6} />
      </View>

      {/* Request cards */}
      <View style={styles.list}>
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 120,
  },
  list: {
    gap: 8,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    gap: 12,
  },
  codeCardInfo: {
    flex: 1,
    gap: 4,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    gap: 12,
  },
  requestCardInfo: {
    flex: 1,
    gap: 4,
  },
});
