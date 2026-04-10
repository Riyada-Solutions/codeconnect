import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

/** Mirrors Flutter `kButtonRadius` default for this app. */
export const CUSTOM_BUTTON_RADIUS = 12;

const DEFAULT_GRADIENT: [string, string] = ["#2daaae", "#238f92"];

export interface CustomButtonProps {
  onPress: () => void;
  /** Custom content; used when `title` is not set. */
  children?: React.ReactNode;
  title?: string;
  /** Filled background when not outlined. If omitted, a primary gradient is used. */
  color?: string;
  textColor?: string;
  borderColor?: string;
  /**
   * `undefined` — full width (parent / screen).
   * `0` — intrinsic width (hug content).
   * Positive number — fixed width.
   */
  width?: number;
  height?: number;
  fontSize?: number;
  radius?: number;
  loadingSize?: number;
  isCircle?: boolean;
  isOutlined?: boolean;
  widerPadding?: boolean;
  loading?: boolean;
  /** When false, presses are ignored (unless `loading` and dev build — matches Flutter `kDebugMode`). */
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function defaultGradientColors(): [string, string] {
  return DEFAULT_GRADIENT;
}

export default function CustomButton({
  onPress,
  children,
  title,
  color,
  textColor = "#ffffff",
  borderColor,
  width,
  height = 48,
  fontSize = 16,
  radius = CUSTOM_BUTTON_RADIUS,
  loadingSize = 20,
  isCircle = false,
  isOutlined = false,
  widerPadding = false,
  loading = false,
  enabled = true,
  style,
  testID,
}: CustomButtonProps) {
  const interactive = enabled && (!loading || __DEV__);

  const resolvedBorderColor = borderColor ?? color ?? "transparent";

  const outerStyle = useMemo((): StyleProp<ViewStyle> => {
    const base: ViewStyle = {
      height,
      borderRadius: isCircle ? height / 2 : radius,
      overflow: "hidden",
    };
    if (width === 0) {
      base.alignSelf = "flex-start";
    } else if (width !== undefined) {
      base.width = width;
    } else {
      base.alignSelf = "stretch";
    }
    return [base, style];
  }, [height, isCircle, radius, style, width]);

  const paddingStyle = useMemo(() => {
    const horizontal = width === 0 ? 0 : widerPadding ? 16 : 8;
    const vertical = widerPadding ? 12 : 4;
    return { paddingHorizontal: horizontal, paddingVertical: vertical };
  }, [widerPadding, width]);

  const fillColor = color ?? "transparent";
  const showGradient = !isOutlined && color == null;

  const content = loading ? (
    <ActivityIndicator
      color={textColor}
      size="small"
      style={{ transform: [{ scale: loadingSize / 20 }] }}
    />
  ) : title != null ? (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      style={[styles.title, { fontSize, color: textColor }]}
    >
      {title}
    </Text>
  ) : (
    children
  );

  return (
    <View style={outerStyle}>
      {showGradient ? (
        <LinearGradient
          colors={defaultGradientColors()}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: isCircle ? height / 2 : radius,
            },
          ]}
        />
      ) : !isOutlined ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: fillColor,
              borderRadius: isCircle ? height / 2 : radius,
            },
          ]}
        />
      ) : null}

      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: !interactive }}
        disabled={!interactive}
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          {
            borderRadius: isCircle ? height / 2 : radius,
            borderWidth: 1.5,
            borderColor: resolvedBorderColor,
            backgroundColor: isOutlined ? "transparent" : "transparent",
            opacity: !enabled && !loading ? 0.55 : pressed && interactive ? 0.92 : 1,
          },
          paddingStyle,
        ]}
      >
        <View style={styles.inner}>{content}</View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 0,
    width: "100%",
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});
