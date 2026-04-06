import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import { CODES } from "@/constants/codes";
import { useApp } from "@/contexts/AppContext";

const BUILDINGS = ["Main Hospital", "Emergency Wing", "Women's Center", "Surgical Center"];
const FLOORS = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
const DEPARTMENTS = ["ICU", "Emergency", "NICU", "Operating Room", "General Ward", "Radiology"];
const ROOMS = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 8", "Room 10", "Room 12"];

export default function NewEmergencyScreen() {
  const { code: preselectedCode } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  const [selectedCode, setSelectedCode] = useState(preselectedCode || "");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [department, setDepartment] = useState("");
  const [room, setRoom] = useState("");
  const [notes, setNotes] = useState("");
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);
  const [showFloorPicker, setShowFloorPicker] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);

  const handleActivate = () => {
    Alert.alert(
      t("emergency.activate"),
      `Are you sure you want to activate ${selectedCode}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: t("emergency.activate"),
          style: "destructive",
          onPress: () => {
            router.replace({
              pathname: "/incoming-alert",
              params: {
                code: selectedCode,
                building: building,
                floor: floor,
                room: room,
                department: department,
              },
            });
          },
        },
      ]
    );
  };

  const renderPicker = (
    items: string[],
    show: boolean,
    setShow: (v: boolean) => void,
    onSelect: (v: string) => void
  ) => {
    if (!show) return null;
    return (
      <View style={[styles.pickerList, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {items.map((item) => (
          <Pressable
            key={item}
            style={[styles.pickerItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              onSelect(item);
              setShow(false);
            }}
          >
            <Text style={[styles.pickerItemText, { color: colors.text }]}>{item}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12, backgroundColor: colors.hero }]}>
        <Text style={[styles.headerTitle, { color: colors.heroText }]}>{t("emergency.title")}</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={20} color={colors.heroText} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("emergency.selectCode")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScroll}>
          <View style={styles.codeRow}>
            {CODES.map((c) => (
              <Pressable
                key={c.id}
                style={[
                  styles.codePill,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedCode === c.type && { backgroundColor: c.color, borderColor: c.color },
                ]}
                onPress={() => setSelectedCode(c.type)}
              >
                <Text
                  style={[
                    styles.codePillText,
                    { color: colors.textSecondary },
                    selectedCode === c.type && { color: "#ffffff" },
                  ]}
                >
                  {c.type}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("emergency.location")}</Text>
        <View style={styles.fieldGroup}>
          <Pressable style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowBuildingPicker(!showBuildingPicker)}>
            <Text style={building ? [styles.dropdownValue, { color: colors.text }] : [styles.dropdownPlaceholder, { color: colors.textMuted }]}>
              {building || t("emergency.selectBuilding")}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {renderPicker(BUILDINGS, showBuildingPicker, setShowBuildingPicker, (v) => {
            setBuilding(v);
            setFloor("");
            setDepartment("");
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }, !building && styles.dropdownDisabled]}
            onPress={() => building && setShowFloorPicker(!showFloorPicker)}
          >
            <Text style={floor ? [styles.dropdownValue, { color: colors.text }] : [styles.dropdownPlaceholder, { color: colors.textMuted }]}>
              {floor || t("emergency.selectFloor")}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {renderPicker(FLOORS, showFloorPicker, setShowFloorPicker, (v) => {
            setFloor(v);
            setDepartment("");
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }, !floor && styles.dropdownDisabled]}
            onPress={() => floor && setShowDeptPicker(!showDeptPicker)}
          >
            <Text style={department ? [styles.dropdownValue, { color: colors.text }] : [styles.dropdownPlaceholder, { color: colors.textMuted }]}>
              {department || t("emergency.selectDept")}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {renderPicker(DEPARTMENTS, showDeptPicker, setShowDeptPicker, (v) => {
            setDepartment(v);
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }, !department && styles.dropdownDisabled]}
            onPress={() => department && setShowRoomPicker(!showRoomPicker)}
          >
            <Text style={room ? [styles.dropdownValue, { color: colors.text }] : [styles.dropdownPlaceholder, { color: colors.textMuted }]}>
              {room || t("emergency.selectRoom")}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {renderPicker(ROOMS, showRoomPicker, setShowRoomPicker, setRoom)}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("emergency.notes")}</Text>
        <TextInput
          style={[styles.notesInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder={t("emergency.notesPlaceholder")}
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.activateBtn, !selectedCode && styles.activateBtnDisabled]}
          onPress={handleActivate}
          disabled={!selectedCode}
        >
          <Feather name="alert-triangle" size={18} color="#ffffff" />
          <Text style={styles.activateText}>{t("emergency.activate")}</Text>
        </Pressable>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 14,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  codeScroll: {
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: "row",
    gap: 8,
  },
  codePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  codePillText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  fieldGroup: {
    gap: 10,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  dropdownValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  pickerList: {
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 100,
    marginBottom: 16,
  },
  activateBtn: {
    flexDirection: "row",
    height: 48,
    backgroundColor: "#2daaae",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  activateBtnDisabled: {
    opacity: 0.5,
  },
  activateText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
});
