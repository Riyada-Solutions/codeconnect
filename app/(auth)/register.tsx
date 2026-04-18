import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import { useApp } from "@/contexts/AppContext";
import { register } from "@/data/auth_repository";

const COUNTRY_CODES = [
  { flag: "🇸🇦", name: "Saudi Arabia", dial: "+966" },
  { flag: "🇦🇪", name: "UAE", dial: "+971" },
  { flag: "🇶🇦", name: "Qatar", dial: "+974" },
  { flag: "🇰🇼", name: "Kuwait", dial: "+965" },
  { flag: "🇧🇭", name: "Bahrain", dial: "+973" },
  { flag: "🇴🇲", name: "Oman", dial: "+968" },
  { flag: "🇯🇴", name: "Jordan", dial: "+962" },
  { flag: "🇪🇬", name: "Egypt", dial: "+20" },
  { flag: "🇱🇧", name: "Lebanon", dial: "+961" },
  { flag: "🇮🇶", name: "Iraq", dial: "+964" },
  { flag: "🇾🇪", name: "Yemen", dial: "+967" },
  { flag: "🇸🇾", name: "Syria", dial: "+963" },
  { flag: "🇵🇰", name: "Pakistan", dial: "+92" },
  { flag: "🇮🇳", name: "India", dial: "+91" },
  { flag: "🇵🇭", name: "Philippines", dial: "+63" },
  { flag: "🇬🇧", name: "United Kingdom", dial: "+44" },
  { flag: "🇺🇸", name: "United States", dial: "+1" },
  { flag: "🇨🇦", name: "Canada", dial: "+1" },
  { flag: "🇩🇪", name: "Germany", dial: "+49" },
  { flag: "🇫🇷", name: "France", dial: "+33" },
  { flag: "🇹🇷", name: "Turkey", dial: "+90" },
  { flag: "🇮🇷", name: "Iran", dial: "+98" },
  { flag: "🇿🇦", name: "South Africa", dial: "+27" },
  { flag: "🇳🇬", name: "Nigeria", dial: "+234" },
  { flag: "🇳🇵", name: "Nepal", dial: "+977" },
  { flag: "🇧🇩", name: "Bangladesh", dial: "+880" },
  { flag: "🇱🇰", name: "Sri Lanka", dial: "+94" },
  { flag: "🇮🇩", name: "Indonesia", dial: "+62" },
  { flag: "🇲🇾", name: "Malaysia", dial: "+60" },
  { flag: "🇸🇬", name: "Singapore", dial: "+65" },
  { flag: "🇦🇺", name: "Australia", dial: "+61" },
] as const;

const TEXT_FIELDS = [
  { icon: "key" as const, key: "registerCode", keyboard: "default" as const },
  { icon: "user" as const, key: "fullName", keyboard: "default" as const },
  { icon: "mail" as const, key: "emailAddress", keyboard: "email-address" as const },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { colors, t } = useApp();

  const [registerCode, setRegisterCode] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const values = [registerCode, name, email];
  const setters = [setRegisterCode, setName, setEmail];

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q)
    );
  }, [countrySearch]);

  const handleRegister = async () => {
    const fullPhone = `${selectedCountry.dial}${phone.replace(/^0+/, "")}`;
    setLoading(true);
    try {
      await register({
        registerCode: registerCode.trim(),
        phone: fullPhone,
        fullName: name.trim(),
        email: email.trim(),
      });
      router.push({ pathname: "/(auth)/verify-otp", params: { identifier: fullPhone, purpose: "register" } });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Registration failed. Please try again.";
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("register.createAccount")}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{t("register.desc")}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTag, { color: colors.primary }]}>{t("register.joinCodeConnect")}</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t("register.createAccount")}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t("register.desc")}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.formCard, { backgroundColor: colors.card }]}>
          {/* Register code */}
          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="key" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={registerCode}
              onChangeText={setRegisterCode}
              placeholder={t("register.registerCode")}
              placeholderTextColor={colors.textMuted}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>

          {/* Phone with country code */}
          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Pressable
              style={[styles.countryBtn, { borderRightColor: colors.border }]}
              onPress={() => { setCountrySearch(""); setShowCountryPicker(true); }}
            >
              <Text style={styles.flagText}>{selectedCountry.flag}</Text>
              <Text style={[styles.dialCode, { color: colors.text }]}>{selectedCountry.dial}</Text>
              <Feather name="chevron-down" size={14} color={colors.textMuted} />
            </Pressable>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={phone}
              onChangeText={setPhone}
              placeholder={t("register.phone")}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          {/* Full name */}
          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="user" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder={t("register.fullName")}
              placeholderTextColor={colors.textMuted}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="mail" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder={t("register.emailAddress")}
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.branchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Feather name="map-pin" size={18} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={[styles.branchText, { color: colors.text }]}>{t("register.mainBranch")}</Text>
          </View>

          <CustomButton
            title={t("register.register")}
            onPress={handleRegister}
            loading={loading}
            widerPadding
            height={52}
            radius={16}
            style={styles.registerBtnShadow}
          />
        </Animated.View>

        <Pressable onPress={() => router.push("/(auth)/login")} style={styles.loginLink}>
          <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
            {t("register.alreadyHaveAccount")}{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{t("login.signIn")}</Text>
          </Text>
        </Pressable>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderWidth: 1,
  },
  headerCenter: { flex: 1, gap: 4 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  body: { flex: 1, paddingHorizontal: 20 },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTag: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 20, lineHeight: 28 },
  cardSub: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  formCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 14,
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
  },
  flagText: { fontSize: 20, lineHeight: 24 },
  dialCode: { fontFamily: "Inter_500Medium", fontSize: 14 },
  branchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  branchText: { fontFamily: "Inter_400Regular", fontSize: 15 },
  registerBtnShadow: {
    marginTop: 4,
    shadowColor: "#2daaae",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  loginLink: { marginTop: 16, alignItems: "center" },
  loginLinkText: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
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
