import React, { useEffect } from "react";
import { StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { useApp } from "@/contexts/AppContext";

interface ShimmerProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Shimmer({ width, height, borderRadius = 8, style }: ShimmerProps) {
  const { isDark } = useApp();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      isDark
        ? ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.13)"]
        : ["rgba(0,0,0,0.06)", "rgba(0,0,0,0.12)"]
    ),
  }));

  return (
    <Animated.View
      style={[
        { height, borderRadius, width: width ?? "100%" },
        animStyle,
        style,
      ]}
    />
  );
}
