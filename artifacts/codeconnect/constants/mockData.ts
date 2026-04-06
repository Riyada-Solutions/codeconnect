export const mockUser = {
  id: "u1",
  name: "Dr. Sarah Mitchell",
  role: "Chief Surgical Officer",
  hospital: "St. Jude Medical Center",
  email: "sarah.mitchell@stjude.med",
  phone: "+966 50 123 4567",
  department: "Surgery",
  employeeId: "SJM-2024-001",
  initials: "SM",
};

export interface ActiveCode {
  id: string;
  type: string;
  color: string;
  location: string;
  responders: number;
  status: string;
  timestamp: string;
}

export const activeCodes: ActiveCode[] = [
  { id: "1", type: "Code Blue", color: "#3b82f6", location: "ICU / Dept A / Room 6", responders: 3, status: "active", timestamp: "2m ago" },
  { id: "2", type: "Code Red", color: "#ef4444", location: "ER / Dept B / Room 10", responders: 5, status: "active", timestamp: "5m ago" },
  { id: "3", type: "Code Pink", color: "#ec4899", location: "NICU / Dept C / Room 4", responders: 2, status: "pending", timestamp: "8m ago" },
  { id: "4", type: "Code Yellow", color: "#f59e0b", location: "OR / Dept D / Room 2", responders: 4, status: "active", timestamp: "12m ago" },
];

export interface ActiveRequest {
  id: string;
  title: string;
  type: "urgent" | "pending" | "transit" | "active" | "resolved";
  location: string;
  updatedAt: string;
  code: string;
  color: string;
}

export const activeRequests: ActiveRequest[] = [
  { id: "r1", title: "Code Red: ICU-402", type: "urgent", location: "South Wing - Floor 4", updatedAt: "2m ago", code: "Code Red", color: "#ef4444" },
  { id: "r2", title: "Lab: STAT-Panel", type: "pending", location: "Main Lab - Central Hub", updatedAt: "15m ago", code: "Code Yellow", color: "#f59e0b" },
  { id: "r3", title: "Supply: O+ Blood Unit", type: "transit", location: "Blood Bank - OR-3", updatedAt: "5m ago", code: "Code Green", color: "#10b981" },
];

export interface Alert {
  id: string;
  title: string;
  type: string;
  color: string;
  location: string;
  status: "active" | "pending" | "resolved";
  responders: number;
  timestamp: string;
  building: string;
  floor: string;
  department: string;
  room: string;
  respondersList: Responder[];
}

export interface Responder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  respondedAt: string;
}

export const alertsList: Alert[] = [
  {
    id: "a1", title: "Code Blue: Cardiac Arrest", type: "Code Blue", color: "#3b82f6",
    location: "ICU - Room 6", status: "active", responders: 3, timestamp: "2m ago",
    building: "Main Hospital", floor: "Floor 4", department: "ICU", room: "Room 6",
    respondersList: [
      { id: "r1", name: "Dr. Ahmed Hassan", role: "Cardiologist", avatar: "AH", respondedAt: "1m ago" },
      { id: "r2", name: "Nurse Fatima Ali", role: "ICU Nurse", avatar: "FA", respondedAt: "2m ago" },
      { id: "r3", name: "Dr. Omar Khan", role: "Resident", avatar: "OK", respondedAt: "2m ago" },
    ],
  },
  {
    id: "a2", title: "Code Red: Fire Alert", type: "Code Red", color: "#ef4444",
    location: "ER - Room 10", status: "active", responders: 5, timestamp: "5m ago",
    building: "Emergency Wing", floor: "Floor 1", department: "Emergency", room: "Room 10",
    respondersList: [
      { id: "r4", name: "Dr. Layla Noor", role: "ER Physician", avatar: "LN", respondedAt: "3m ago" },
      { id: "r5", name: "Tech. Samir Raza", role: "Fire Safety", avatar: "SR", respondedAt: "4m ago" },
    ],
  },
  {
    id: "a3", title: "Code Pink: NICU Alert", type: "Code Pink", color: "#ec4899",
    location: "NICU - Room 4", status: "pending", responders: 2, timestamp: "8m ago",
    building: "Women's Center", floor: "Floor 3", department: "NICU", room: "Room 4",
    respondersList: [
      { id: "r6", name: "Nurse Hana Yusuf", role: "NICU Nurse", avatar: "HY", respondedAt: "6m ago" },
    ],
  },
  {
    id: "a4", title: "Code Yellow: Bomb Threat", type: "Code Yellow", color: "#f59e0b",
    location: "OR - Room 2", status: "resolved", responders: 4, timestamp: "25m ago",
    building: "Surgical Center", floor: "Floor 2", department: "Operating Room", room: "Room 2",
    respondersList: [],
  },
  {
    id: "a5", title: "Code Blue: Medical Emergency", type: "Code Blue", color: "#3b82f6",
    location: "Ward B - Room 12", status: "resolved", responders: 3, timestamp: "1h ago",
    building: "Main Hospital", floor: "Floor 5", department: "General Ward", room: "Room 12",
    respondersList: [],
  },
];

export const notifications = [
  { id: "n1", title: "Code Blue Activated", message: "ICU Room 6 - Cardiac arrest reported", time: "2m ago", read: false, type: "urgent" as const },
  { id: "n2", title: "Response Acknowledged", message: "Dr. Ahmed Hassan responded to Code Blue", time: "3m ago", read: false, type: "info" as const },
  { id: "n3", title: "Code Red Resolved", message: "ER Room 10 - Fire alert cleared", time: "30m ago", read: true, type: "success" as const },
  { id: "n4", title: "Shift Reminder", message: "Your next shift starts in 2 hours", time: "1h ago", read: true, type: "info" as const },
  { id: "n5", title: "System Update", message: "CodeConnect v2.1 is now available", time: "3h ago", read: true, type: "info" as const },
];
