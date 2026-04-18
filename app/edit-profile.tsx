import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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
import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useHome";

const COUNTRY_CODES = [
  { flag: "\u{1F1F8}\u{1F1E6}", name: "Saudi Arabia", dial: "+966" },
  { flag: "\u{1F1E6}\u{1F1EA}", name: "UAE", dial: "+971" },
  { flag: "\u{1F1F6}\u{1F1E6}", name: "Qatar", dial: "+974" },
  { flag: "\u{1F1F0}\u{1F1FC}", name: "Kuwait", dial: "+965" },
  { flag: "\u{1F1E7}\u{1F1ED}", name: "Bahrain", dial: "+973" },
  { flag: "\u{1F1F4}\u{1F1F2}", name: "Oman", dial: "+968" },
  { flag: "\u{1F1EF}\u{1F1F4}", name: "Jordan", dial: "+962" },
  { flag: "\u{1F1EA}\u{1F1EC}", name: "Egypt", dial: "+20" },
  { flag: "\u{1F1F1}\u{1F1E7}", name: "Lebanon", dial: "+961" },
  { flag: "\u{1F1EE}\u{1F1F6}", name: "Iraq", dial: "+964" },
  { flag: "\u{1F1FE}\u{1F1EA}", name: "Yemen", dial: "+967" },
  { flag: "\u{1F1F8}\u{1F1FE}", name: "Syria", dial: "+963" },
  { flag: "\u{1F1F5}\u{1F1F0}", name: "Pakistan", dial: "+92" },
  { flag: "\u{1F1EE}\u{1F1F3}", name: "India", dial: "+91" },
  { flag: "\u{1F1F5}\u{1F1ED}", name: "Philippines", dial: "+63" },
  { flag: "\u{1F1EC}\u{1F1E7}", name: "United Kingdom", dial: "+44" },
  { flag: "\u{1F1FA}\u{1F1F8}", name: "United States", dial: "+1" },
  { flag: "\u{1F1E8}\u{1F1E6}", name: "Canada", dial: "+1" },
  { flag: "\u{1F1E9}\u{1F1EA}", name: "Germany", dial: "+49" },
  { flag: "\u{1F1EB}\u{1F1F7}", name: "France", dial: "+33" },
  { flag: "\u{1F1F9}\u{1F1F7}", name: "Turkey", dial: "+90" },
  { flag: "\u{1F1EE}\u{1F1F7}", name: "Iran", dial: "+98" },
  { flag: "\u{1F1FF}\u{1F1E6}", name: "South Africa", dial: "+27" },
  { flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria", dial: "+234" },
  { flag: "\u{1F1F3}\u{1F1F5}", name: "Nepal", dial: "+977" },
  { flag: "\u{1F1E7}\u{1F1E9}", name: "Bangladesh", dial: "+880" },
  { flag: "\u{1F1F1}\u{1F1F0}", name: "Sri Lanka", dial: "+94" },
  { flag: "\u{1F1EE}\u{1F1E9}", name: "Indonesia", dial: "+62" },
  { flag: "\u{1F1F2}\u{1F1FE}", name: "Malaysia", dial: "+60" },
  { flag: "\u{1F1F8}\u{1F1EC}", name: "Singapore", dial: "+65" },
  { flag: "\u{1F1E6}\u{1F1FA}", name: "Australia", dial: "+61" },
] as const;

function parsePhone(fullPhone: string | null | undefined) {
  if (!fullPhone) return { country: COUNTRY_CODES[0], local: "" };
  // Sort by dial length descending so longer codes match first (e.g. +966 before +96)
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (fullPhone.startsWith(c.dial)) {
      return { country: c, local: fullPhone.slice(c.dial.length) };
    }
  }
  return { country: COUNTRY_CODES[0], local: fullPhone.replace(/^\+/, "") };
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      const parsed = parsePhone(user.phone);
      setSelectedCountry(parsed.country);
      setPhone(parsed.local);
    }
  }, [user]);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q)
    );
  }, [countrySearch]);

  const handleSave = async () => {
    const fullPhone = `${selectedCountry.dial}${phone.replace(/^0+/, "")}`;
    updateProfile.mutate(
      { name: name.trim(), phone: fullPhone },
      {
        onSuccess: () => router.back(),
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Update failed.";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const initials = user?.initials ?? user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) ?? "?";

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.heroText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("editProfile.title")}</Text>
        <CustomButton
          onPress={handleSave}
          width={32}
          height={32}
          radius={8}
          color="rgba(255,255,255,0.15)"
          borderColor="rgba(255,255,255,0.2)"
          loading={updateProfile.isPending}
        >
          <Feather name="check" size={20} color={colors.heroText} />
        </CustomButton>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <Avatar
            initials={initials}
            size={80}
            backgroundColor={colors.primaryLight}
            textColor={colors.primary}
            borderColor={colors.primary}
            borderWidth={2}
          />
          <CustomButton
            onPress={() => {}}
            width={0}
            height={40}
            radius={12}
            isOutlined
            borderColor={colors.primary}
            widerPadding
          >
            <View style={[styles.changePhotoInner, { paddingHorizontal: 14 }]}>
              <Feather name="camera" size={14} color={colors.primary} />
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>{t("editProfile.changePhoto")}</Text>
            </View>
          </CustomButton>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card }]}>
          {/* Name - editable */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.fullName").toUpperCase()}</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Email - read only */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.email").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{user?.email ?? ""}</Text>
            </View>
          </View>

          {/* Phone - editable with country code */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.phone").toUpperCase()}</Text>
            <View style={[styles.phoneRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Pressable
                style={[styles.countryBtn, { borderRightColor: colors.border }]}
                onPress={() => { setCountrySearch(""); setShowCountryPicker(true); }}
              >
                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                <Text style={[styles.dialCode, { color: colors.text }]}>{selectedCountry.dial}</Text>
                <Feather name="chevron-down" size={14} color={colors.textMuted} />
              </Pressable>
              <TextInput
                style={[styles.phoneInput, { color: colors.text }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={colors.textMuted}
                placeholder={t("editProfile.phone")}
              />
            </View>
          </View>

          {/* Department - read only */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.department").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{user?.department ?? ""}</Text>
            </View>
          </View>

          {/* Role - read only */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.role").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{user?.role ?? ""}</Text>
            </View>
          </View>

          {/* Employee ID - read only */}
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t("editProfile.employeeId").toUpperCase()}</Text>
            <View style={[styles.fieldInput, styles.fieldDisabled, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={[styles.disabledText, { color: colors.textMuted }]}>{user?.employeeId ?? ""}</Text>
            </View>
          </View>

          {/* Save button */}
          <CustomButton
            title={t("editProfile.title")}
            onPress={handleSave}
            loading={updateProfile.isPending}
            widerPadding
            height={52}
            radius={16}
            style={styles.saveBtnShadow}
          />
        </View>
      </ScrollView>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowCountryPicker(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 12 }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
            <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={countrySearch}
                onChangeText={setCountrySearch}
                placeholder="Search country or code..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
              {countrySearch.length > 0 && (
                <Pressable onPress={() => setCountrySearch("")}>
                  <Feather name="x" size={16} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.name}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.countryRow,
                    { borderBottomColor: colors.border },
                    selectedCountry.name === item.name && { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => { setSelectedCountry(item); setShowCountryPicker(false); }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.countryDial, { color: colors.textMuted }]}>{item.dial}</Text>
                  {selectedCountry.name === item.name && (
                    <Feather name="check" size={16} color={colors.primary} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
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
  scrollContent: {
    padding: 14,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  changePhotoInner: {
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    height: "100%",
  },
  flagText: { fontSize: 18, lineHeight: 22 },
  dialCode: { fontFamily: "Inter_500Medium", fontSize: 13 },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    height: "100%",
  },
  saveBtnShadow: {
    marginTop: 8,
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    maxHeight: "75%",
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 14 },
  modalTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, textAlign: "center", marginBottom: 14 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, padding: 0 },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  countryFlag: { fontSize: 22 },
  countryName: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15 },
  countryDial: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
