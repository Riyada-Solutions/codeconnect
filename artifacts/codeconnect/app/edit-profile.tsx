import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "@/components/ui/Avatar";
import { mockUser } from "@/constants/mockData";
import { useApp } from "@/contexts/AppContext";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [department, setDepartment] = useState(mockUser.department);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("editProfile.title")}</Text>
        <Pressable style={styles.saveBtn} onPress={() => router.back()}>
          <Feather name="check" size={20} color={colors.heroText} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Avatar
            initials={mockUser.initials}
            size={80}
            backgroundColor={colors.primaryLight}
            textColor={colors.primary}
            borderColor={colors.primary}
            borderWidth={2}
          />
          <Pressable style={styles.changePhotoBtn}>
            <Feather name="camera" size={14} color={colors.primary} />
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>{t("editProfile.changePhoto")}</Text>
          </Pressable>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.fullName").toUpperCase()}</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.email").toUpperCase()}</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.phone").toUpperCase()}</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.department").toUpperCase()}</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.role").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{mockUser.role}</Text>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.employeeId").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{mockUser.employeeId}</Text>
            </View>
          </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
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
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 14,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changePhotoText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  form: {
    borderRadius: 14,
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    justifyContent: "center",
  },
  fieldDisabled: {
    opacity: 0.7,
  },
  disabledText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
