import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  initials: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export default function Avatar({
  initials,
  size = 36,
  backgroundColor = "rgba(255,255,255,0.2)",
  textColor = "#ffffff",
  borderColor,
  borderWidth = 0,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: borderColor || "transparent",
          borderWidth,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: size * 0.36 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter_600SemiBold",
  },
});
