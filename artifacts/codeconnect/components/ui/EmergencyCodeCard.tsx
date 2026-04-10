import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useApp } from "@/contexts/AppContext";

interface EmergencyCodeCardProps {
  type: string;
  description: string;
  color: string;
  icon: string;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EmergencyCodeCard({ type, description, color, icon, onPress }: EmergencyCodeCardProps) {
  const { isDark } = useApp();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor = isDark ? color + "20" : color + "12";

  return (
    <AnimatedPressable
      style={[styles.container, { backgroundColor: bgColor, borderColor: color + "30" }, animStyle]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.description, { color: isDark ? "#93b5b6" : "#4a7072" }]}>{description}</Text>
        <Text style={[styles.codeName, { color: color }]}>{type.toUpperCase()}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={color + "80"} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  codeName: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
});
