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

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [department, setDepartment] = useState(mockUser.department);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable style={styles.saveBtn} onPress={() => router.back()}>
          <Feather name="check" size={20} color="#ffffff" />
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
            backgroundColor="#e4f7f7"
            textColor="#2daaae"
            borderColor="#2daaae"
            borderWidth={2}
          />
          <Pressable style={styles.changePhotoBtn}>
            <Feather name="camera" size={14} color="#2daaae" />
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#93b5b6"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#93b5b6"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={styles.fieldInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#93b5b6"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Department</Text>
            <TextInput
              style={styles.fieldInput}
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor="#93b5b6"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Role</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled]}>
              <Text style={styles.disabledText}>{mockUser.role}</Text>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Employee ID</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled]}>
              <Text style={styles.disabledText}>{mockUser.employeeId}</Text>
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
    backgroundColor: "#f0f5f5",
  },
  header: {
    backgroundColor: "#2daaae",
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
    color: "#ffffff",
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
    color: "#2daaae",
    fontFamily: "Inter_500Medium",
  },
  form: {
    backgroundColor: "#ffffff",
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
    color: "#93b5b6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.2)",
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#0d2526",
    backgroundColor: "#f8fafa",
    justifyContent: "center",
  },
  fieldDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },
  disabledText: {
    fontSize: 14,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
});
