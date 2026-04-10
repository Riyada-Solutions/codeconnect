import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  type KeyboardEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import CustomButton from "@/components/ui/CustomButton";
import { getCodeByType } from "@/constants/codes";
import { useApp } from "@/contexts/AppContext";

const BUILDINGS = ["Main Hospital", "Emergency Wing", "Women's Center", "Surgical Center"];
const FLOORS = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
const DEPARTMENTS = ["ICU", "Emergency", "NICU", "Operating Room", "General Ward", "Radiology"];

const SHEET_MAX_HEIGHT = Math.round(Dimensions.get("window").height * 0.98);
function useDecodedCodeParam(): string {
  const params = useLocalSearchParams<{ code?: string | string[] }>();
  const raw = params.code;
  const single = Array.isArray(raw) ? raw[0] : raw;
  if (!single) return "";
  try {
    return decodeURIComponent(single);
  } catch {
    return single;
  }
}

export default function NewEmergencyScreen() {
  const codeParam = useDecodedCodeParam();
  const insets = useSafeAreaInsets();
  const { colors, t, isDark } = useApp();

  const activeCode = useMemo(() => (codeParam ? getCodeByType(codeParam) : undefined), [codeParam]);

  useEffect(() => {
    if (!codeParam || !activeCode) {
      router.back();
    }
  }, [codeParam, activeCode]);

  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [department, setDepartment] = useState("");
  const [room, setRoom] = useState("");
  const [notes, setNotes] = useState("");
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);
  const [showFloorPicker, setShowFloorPicker] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);

  /** Mirrors Flutter `40 + MediaQuery.of(context).viewInsets.bottom` for scroll bottom inset. */
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent) => {
      setKeyboardInset(e.endCoordinates.height);
    };
    const onHide = () => setKeyboardInset(0);

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const scrollPaddingBottom = 40 + keyboardInset + insets.bottom;

  const titleColor = isDark ? colors.text : "#111827";
  const subtitleBlue = "#2563eb";
  const subtitleColor = isDark ? colors.textSecondary : subtitleBlue;
  const instructionColor = isDark ? colors.textSecondary : "#6b7280";
  const fieldBorder = isDark ? colors.border : "#e5e7eb";
  const mutedIcon = isDark ? colors.textMuted : "#6b7280";

  const canSubmit =
    Boolean(activeCode) && Boolean(building) && Boolean(floor) && Boolean(department) && room.trim().length > 0;

  const handleActivate = () => {
    if (!activeCode) return;
    Alert.alert(
      t("emergency.sendAlert"),
      `Are you sure you want to activate ${activeCode.type}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: t("emergency.sendAlert"),
          style: "destructive",
          onPress: () => {
            router.replace({
              pathname: "/incoming-alert",
              params: {
                code: activeCode.type,
                building: building,
                floor: floor,
                room: room.trim(),
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
      <View style={[styles.pickerList, { backgroundColor: colors.card, borderColor: fieldBorder }]}>
        {items.map((item) => (
          <Pressable
            key={item}
            style={[styles.pickerItem, { borderBottomColor: fieldBorder }]}
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

  if (!activeCode) {
    return <View style={styles.backdropOnly} />;
  }

  const headerTitle = activeCode.type.toUpperCase();
  const headerSubtitle = activeCode.tagline ?? activeCode.description;
  const accentDot = activeCode.color;
  const sendBtnBg = canSubmit ? activeCode.color : isDark ? "#4a6068" : "#8fa8b6";

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close" />
      <View style={[styles.sheetContainer, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
        <Pressable style={styles.sheetPressShield} onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                borderColor: fieldBorder,
                maxHeight: SHEET_MAX_HEIGHT,
              },
            ]}
          >
            <View style={[styles.dragHandle, { backgroundColor: isDark ? "#4b5563" : "#d1d5db" }]} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderMain}>
                <View style={[styles.severityDot, { backgroundColor: accentDot }]} />
                <View style={styles.sheetHeaderText}>
                  <Text style={[styles.sheetTitle, { color: titleColor }]}>{headerTitle}</Text>
                  <Text style={[styles.sheetSubtitle, { color: subtitleColor }]}>{headerSubtitle}</Text>
                </View>
              </View>
              <Pressable style={styles.closeBtn} onPress={() => router.back()} hitSlop={14}>
                <Feather name="x" size={22} color={mutedIcon} />
              </Pressable>
            </View>

            <View style={[styles.headerRule, { backgroundColor: fieldBorder }]} />

            <KeyboardAwareScrollViewCompat
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPaddingBottom }]}
              showsVerticalScrollIndicator={false}
              bottomOffset={20}
              extraKeyboardSpace={88}
            >
              <Text style={[styles.instruction, { color: instructionColor }]}>{t("emergency.instruction")}</Text>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <MaterialCommunityIcons name="office-building-outline" size={18} color={mutedIcon} />
                  <Text style={[styles.labelWithIcon, { color: titleColor }]}>{t("alertDetail.building")}</Text>
                </View>
                <View style={[styles.control, { borderColor: fieldBorder, backgroundColor: colors.card }]}>
                  <Pressable style={styles.controlInner} onPress={() => setShowBuildingPicker(!showBuildingPicker)}>
                    <Text
                      style={
                        building
                          ? [styles.fieldValue, { color: colors.text }]
                          : [styles.fieldPlaceholder, { color: colors.textMuted }]
                      }
                      numberOfLines={1}
                    >
                      {building || t("emergency.selectBuilding")}
                    </Text>
                    <Feather name="chevron-down" size={18} color={mutedIcon} />
                  </Pressable>
                </View>
                {renderPicker(BUILDINGS, showBuildingPicker, setShowBuildingPicker, (v) => {
                  setBuilding(v);
                  setFloor("");
                  setDepartment("");
                  setRoom("");
                })}
              </View>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Feather name="layers" size={18} color={mutedIcon} />
                  <Text style={[styles.labelWithIcon, { color: titleColor }]}>{t("alertDetail.floor")}</Text>
                </View>
                <View style={[styles.control, { borderColor: fieldBorder, backgroundColor: colors.card }, !building && styles.rowDisabled]}>
                  <Pressable style={styles.controlInner} onPress={() => building && setShowFloorPicker(!showFloorPicker)} disabled={!building}>
                    <Text
                      style={
                        floor
                          ? [styles.fieldValue, { color: colors.text }]
                          : [styles.fieldPlaceholder, { color: colors.textMuted }]
                      }
                      numberOfLines={1}
                    >
                      {floor || t("emergency.selectFloor")}
                    </Text>
                    <Feather name="chevron-down" size={18} color={mutedIcon} />
                  </Pressable>
                </View>
                {renderPicker(FLOORS, showFloorPicker, setShowFloorPicker, (v) => {
                  setFloor(v);
                  setDepartment("");
                  setRoom("");
                })}
              </View>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Feather name="map-pin" size={18} color={mutedIcon} />
                  <Text style={[styles.labelWithIcon, { color: titleColor }]}>{t("alertDetail.department")}</Text>
                </View>
                <View style={[styles.control, { borderColor: fieldBorder, backgroundColor: colors.card }, !floor && styles.rowDisabled]}>
                  <Pressable style={styles.controlInner} onPress={() => floor && setShowDeptPicker(!showDeptPicker)} disabled={!floor}>
                    <Text
                      style={
                        department
                          ? [styles.fieldValue, { color: colors.text }]
                          : [styles.fieldPlaceholder, { color: colors.textMuted }]
                      }
                      numberOfLines={1}
                    >
                      {department || t("emergency.selectDept")}
                    </Text>
                    <Feather name="chevron-down" size={18} color={mutedIcon} />
                  </Pressable>
                </View>
                {renderPicker(DEPARTMENTS, showDeptPicker, setShowDeptPicker, (v) => {
                  setDepartment(v);
                  setRoom("");
                })}
              </View>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <MaterialCommunityIcons name="door" size={18} color={mutedIcon} />
                  <Text style={[styles.labelWithIcon, { color: titleColor }]}>{t("emergency.roomNumber")}</Text>
                </View>
                <View style={[styles.control, { borderColor: fieldBorder, backgroundColor: colors.card }, !department && styles.rowDisabled]}>
                  <TextInput
                    style={[styles.textInputFull, { color: colors.text }]}
                    placeholder={t("emergency.roomPlaceholder")}
                    placeholderTextColor={colors.textMuted}
                    value={room}
                    onChangeText={setRoom}
                    editable={Boolean(department)}
                  />
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Feather name="file-text" size={18} color={mutedIcon} />
                  <Text style={[styles.labelWithIcon, { color: titleColor }]}>{t("emergency.notes")}</Text>
                </View>
                <View style={[styles.notesControl, { borderColor: fieldBorder, backgroundColor: colors.card }]}>
                  <TextInput
                    style={[styles.notesInput, { color: colors.text }]}
                    placeholder={t("emergency.notesPlaceholder")}
                    placeholderTextColor={colors.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <CustomButton
                onPress={handleActivate}
                enabled={canSubmit}
                color={sendBtnBg}
                height={52}
                radius={14}
                style={styles.sendBtnWrap}
              >
                <View style={styles.sendBtnInner}>
                  <Feather name="send" size={18} color="#ffffff" />
                  <Text style={styles.sendBtnText}>{t("emergency.sendAlert")}</Text>
                </View>
              </CustomButton>

              <Text style={[styles.footerNote, { color: mutedIcon }]}>{t("emergency.sendFooter")}</Text>
            </KeyboardAwareScrollViewCompat>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdropOnly: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetPressShield: {
    width: "100%",
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 16 },
      default: {},
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetHeaderMain: {
    flex: 1,
    flexDirection: "row",
    // alignItems: "flex-start",
    alignItems: "center",
    paddingEnd: 12,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 5,
    marginTop: 6,
    marginEnd: 12,
  },
  sheetHeaderText: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  sheetSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    // marginTop: 4,
    lineHeight: 22,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRule: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  scroll: {
    maxHeight: SHEET_MAX_HEIGHT - 200,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  instruction: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 23,
    marginBottom: 16,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  labelWithIcon: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  control: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    overflow: "hidden",
  },
  controlInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    minHeight: 48,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  fieldPlaceholder: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginEnd: 8,
  },
  fieldValue: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    marginEnd: 8,
  },
  textInputFull: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    paddingVertical: 13,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  notesControl: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 120,
    position: "relative",
  },
  notesInput: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  pickerList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerItemText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sendBtnWrap: {
    marginTop: 8,
  },
  sendBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sendBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  footerNote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 18,
  },
});
