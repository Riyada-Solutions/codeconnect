import type { Alert, AlertDetail, ActiveRequest, ActiveCode } from '@/types/alert'

const mockDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const MOCK_ALERTS: AlertDetail[] = [
  {
    id: 'a1', title: 'Code Blue: Cardiac Arrest', type: 'Code Blue', color: '#3b82f6',
    location: 'ICU - Room 6', status: 'active', responders: 3, timestamp: '2m ago',
    building: 'Main Hospital', floor: 'Floor 4', department: 'ICU', room: 'Room 6', notes: null,
    respondersList: [
      { id: 'r1', name: 'Dr. Ahmed Hassan', role: 'Cardiologist', avatar: 'AH', respondedAt: '1m ago' },
      { id: 'r2', name: 'Nurse Fatima Ali', role: 'ICU Nurse', avatar: 'FA', respondedAt: '2m ago' },
      { id: 'r3', name: 'Dr. Omar Khan', role: 'Resident', avatar: 'OK', respondedAt: '2m ago' },
    ],
  },
  {
    id: 'a2', title: 'Code Red: Fire Alert', type: 'Code Red', color: '#ef4444',
    location: 'ER - Room 10', status: 'active', responders: 5, timestamp: '5m ago',
    building: 'Emergency Wing', floor: 'Floor 1', department: 'Emergency', room: 'Room 10', notes: null,
    respondersList: [
      { id: 'r4', name: 'Dr. Layla Noor', role: 'ER Physician', avatar: 'LN', respondedAt: '3m ago' },
      { id: 'r5', name: 'Tech. Samir Raza', role: 'Fire Safety', avatar: 'SR', respondedAt: '4m ago' },
    ],
  },
  {
    id: 'a3', title: 'Code Pink: NICU Alert', type: 'Code Pink', color: '#ec4899',
    location: 'NICU - Room 4', status: 'pending', responders: 2, timestamp: '8m ago',
    building: "Women's Center", floor: 'Floor 3', department: 'NICU', room: 'Room 4', notes: null,
    respondersList: [
      { id: 'r6', name: 'Nurse Hana Yusuf', role: 'NICU Nurse', avatar: 'HY', respondedAt: '6m ago' },
    ],
  },
  {
    id: 'a4', title: 'Code Yellow: Bomb Threat', type: 'Code Yellow', color: '#f59e0b',
    location: 'OR - Room 2', status: 'resolved', responders: 4, timestamp: '25m ago',
    building: 'Surgical Center', floor: 'Floor 2', department: 'Operating Room', room: 'Room 2', notes: null,
    respondersList: [],
  },
  {
    id: 'a5', title: 'Code Blue: Medical Emergency', type: 'Code Blue', color: '#3b82f6',
    location: 'Ward B - Room 12', status: 'resolved', responders: 3, timestamp: '1h ago',
    building: 'Main Hospital', floor: 'Floor 5', department: 'General Ward', room: 'Room 12', notes: null,
    respondersList: [],
  },
]

export const MOCK_ACTIVE_REQUESTS: ActiveRequest[] = [
  { id: 'r1', title: 'Code Red: ICU-402', type: 'urgent', location: 'South Wing - Floor 4', updatedAt: '2m ago', code: 'Code Red', color: '#ef4444' },
  { id: 'r2', title: 'Lab: STAT-Panel', type: 'pending', location: 'Main Lab - Central Hub', updatedAt: '15m ago', code: 'Code Yellow', color: '#f59e0b' },
  { id: 'r3', title: 'Supply: O+ Blood Unit', type: 'transit', location: 'Blood Bank - OR-3', updatedAt: '5m ago', code: 'Code Green', color: '#10b981' },
  { id: 'r4', title: 'Code Blue: Ward B-12', type: 'active', location: 'Ward B - Floor 5', updatedAt: '8m ago', code: 'Code Blue', color: '#3b82f6' },
  { id: 'r5', title: 'Code Pink: NICU Alert', type: 'urgent', location: 'NICU - Floor 3', updatedAt: '10m ago', code: 'Code Pink', color: '#ec4899' },
  { id: 'r6', title: 'Equipment: Ventilator', type: 'transit', location: 'Storage - ICU Wing', updatedAt: '12m ago', code: 'Code Orange', color: '#f97316' },
]

export const MOCK_ACTIVE_CODES: ActiveCode[] = [
  { id: '1', type: 'Code Blue', color: '#3b82f6', location: 'ICU / Dept A / Room 6', responders: 3, status: 'active', timestamp: '2m ago' },
  { id: '2', type: 'Code Red', color: '#ef4444', location: 'ER / Dept B / Room 10', responders: 5, status: 'active', timestamp: '5m ago' },
  { id: '3', type: 'Code Pink', color: '#ec4899', location: 'NICU / Dept C / Room 4', responders: 2, status: 'pending', timestamp: '8m ago' },
  { id: '4', type: 'Code Yellow', color: '#f59e0b', location: 'OR / Dept D / Room 2', responders: 4, status: 'active', timestamp: '12m ago' },
]

export async function mockFetchAlerts(): Promise<Alert[]> {
  await mockDelay()
  return MOCK_ALERTS
}

export async function mockFetchAlertById(id: string): Promise<AlertDetail> {
  await mockDelay(300)
  const alert = MOCK_ALERTS.find((a) => a.id === id)
  if (!alert) throw new Error('Alert not found')
  return alert
}

export async function mockFetchActiveRequests(): Promise<ActiveRequest[]> {
  await mockDelay(400)
  return MOCK_ACTIVE_REQUESTS
}

export async function mockFetchActiveCodes(): Promise<ActiveCode[]> {
  await mockDelay(400)
  return MOCK_ACTIVE_CODES
}

export async function mockRespondToAlert(_id: string): Promise<void> {
  await mockDelay(400)
}
