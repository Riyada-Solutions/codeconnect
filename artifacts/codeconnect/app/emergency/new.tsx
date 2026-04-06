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

const BUILDINGS = ["Main Hospital", "Emergency Wing", "Women's Center", "Surgical Center"];
const FLOORS = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
const DEPARTMENTS = ["ICU", "Emergency", "NICU", "Operating Room", "General Ward", "Radiology"];
const ROOMS = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 8", "Room 10", "Room 12"];

export default function NewEmergencyScreen() {
  const { code: preselectedCode } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();

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
      "Activate Alert",
      `Are you sure you want to activate ${selectedCode}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Activate",
          style: "destructive",
          onPress: () => router.back(),
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
      <View style={styles.pickerList}>
        {items.map((item) => (
          <Pressable
            key={item}
            style={styles.pickerItem}
            onPress={() => {
              onSelect(item);
              setShow(false);
            }}
          >
            <Text style={styles.pickerItemText}>{item}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>New emergency request</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>SELECT CODE TYPE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScroll}>
          <View style={styles.codeRow}>
            {CODES.map((c) => (
              <Pressable
                key={c.id}
                style={[
                  styles.codePill,
                  selectedCode === c.type && { backgroundColor: c.color, borderColor: c.color },
                ]}
                onPress={() => setSelectedCode(c.type)}
              >
                <Text
                  style={[
                    styles.codePillText,
                    selectedCode === c.type && { color: "#ffffff" },
                  ]}
                >
                  {c.type}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.sectionLabel}>LOCATION</Text>
        <View style={styles.fieldGroup}>
          <Pressable style={styles.dropdown} onPress={() => setShowBuildingPicker(!showBuildingPicker)}>
            <Text style={building ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {building || "Select building"}
            </Text>
            <Feather name="chevron-down" size={16} color="#93b5b6" />
          </Pressable>
          {renderPicker(BUILDINGS, showBuildingPicker, setShowBuildingPicker, (v) => {
            setBuilding(v);
            setFloor("");
            setDepartment("");
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, !building && styles.dropdownDisabled]}
            onPress={() => building && setShowFloorPicker(!showFloorPicker)}
          >
            <Text style={floor ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {floor || "Select floor"}
            </Text>
            <Feather name="chevron-down" size={16} color="#93b5b6" />
          </Pressable>
          {renderPicker(FLOORS, showFloorPicker, setShowFloorPicker, (v) => {
            setFloor(v);
            setDepartment("");
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, !floor && styles.dropdownDisabled]}
            onPress={() => floor && setShowDeptPicker(!showDeptPicker)}
          >
            <Text style={department ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {department || "Select department"}
            </Text>
            <Feather name="chevron-down" size={16} color="#93b5b6" />
          </Pressable>
          {renderPicker(DEPARTMENTS, showDeptPicker, setShowDeptPicker, (v) => {
            setDepartment(v);
            setRoom("");
          })}

          <Pressable
            style={[styles.dropdown, !department && styles.dropdownDisabled]}
            onPress={() => department && setShowRoomPicker(!showRoomPicker)}
          >
            <Text style={room ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {room || "Select room"}
            </Text>
            <Feather name="chevron-down" size={16} color="#93b5b6" />
          </Pressable>
          {renderPicker(ROOMS, showRoomPicker, setShowRoomPicker, setRoom)}
        </View>

        <Text style={styles.sectionLabel}>NOTES</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Additional details..."
          placeholderTextColor="#93b5b6"
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
          <Text style={styles.activateText}>Activate alert</Text>
        </Pressable>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
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
    color: "#93b5b6",
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
    borderColor: "rgba(45,170,174,0.2)",
    backgroundColor: "#ffffff",
  },
  codePillText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#4a7072",
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
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.2)",
    paddingHorizontal: 14,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#93b5b6",
    fontFamily: "Inter_400Regular",
  },
  dropdownValue: {
    fontSize: 14,
    color: "#0d2526",
    fontFamily: "Inter_500Medium",
  },
  pickerList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.13)",
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(45,170,174,0.08)",
  },
  pickerItemText: {
    fontSize: 14,
    color: "#0d2526",
    fontFamily: "Inter_400Regular",
  },
  notesInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(45,170,174,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#0d2526",
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
