import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!current || !newPass || !confirm) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }
    Alert.alert("Success", "Password updated successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("changePassword.title")}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t("changePassword.current")}</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter current password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showCurrent}
                value={current}
                onChangeText={setCurrent}
              />
              <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                <Feather name={showCurrent ? "eye" : "eye-off"} size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t("changePassword.new")}</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showNew}
                value={newPass}
                onChangeText={setNewPass}
              />
              <Pressable onPress={() => setShowNew(!showNew)}>
                <Feather name={showNew ? "eye" : "eye-off"} size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t("changePassword.confirm")}</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Re-enter new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showConfirm}
                value={confirm}
                onChangeText={setConfirm}
              />
              <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                <Feather name={showConfirm ? "eye" : "eye-off"} size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <CustomButton title={t("changePassword.update")} onPress={handleSave} color={colors.primary} height={48} style={{ marginTop: 4 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  scrollContent: {
    padding: 14,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    gap: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
