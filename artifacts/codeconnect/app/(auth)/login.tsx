import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    router.replace("/(auth)/verify-otp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.heroSection, { paddingTop: insets.top + 40 }]}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.logoCircle}>
          <Image
            source={require("@/assets/images/logo.jpeg")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.logoText}>CodeConnect</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#93b5b6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#93b5b6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#93b5b6" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#93b5b6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#93b5b6" />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>

        <Pressable style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  heroSection: {
    backgroundColor: "#2daaae",
    alignItems: "center",
    paddingBottom: 40,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: 20,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  logoText: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcome: {
    fontSize: 24,
    fontFamily: "Inter_500Medium",
    color: "#0d2526",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
    marginBottom: 32,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafa",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#0d2526",
    fontFamily: "Inter_400Regular",
  },
  signInButton: {
    height: 48,
    backgroundColor: "#2daaae",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  forgotContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotText: {
    fontSize: 13,
    color: "#2daaae",
    fontFamily: "Inter_500Medium",
  },
});
