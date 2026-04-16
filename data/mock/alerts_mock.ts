import type { Alert, AlertDetail, ActiveRequest, ActiveCode, ApiCodeType, HomeData, LocationOption } from '@/types/alert'

const mockDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const MOCK_ALERTS: AlertDetail[] = [
  {
    id: 'a1', title: 'Code Blue: Cardiac Arrest', type: 'Code Blue', color: '#3b82f6',
    location: 'ICU - Room 6', status: 'active', responders: 3, timestamp: '2m ago',
    building: 'Main Hospital', floor: 'Floor 4', department: 'ICU', room: 'Room 6', notes: 'Patient unresponsive, CPR in progress. Defibrillator requested.',
    respondersList: [
      { id: 'r1', name: 'Dr. Ahmed Hassan', role: 'Cardiologist', avatar: 'AH', respondedAt: '1m ago' },
      { id: 'r2', name: 'Nurse Fatima Ali', role: 'ICU Nurse', avatar: 'FA', respondedAt: '2m ago' },
      { id: 'r3', name: 'Dr. Omar Khan', role: 'Resident', avatar: 'OK', respondedAt: '2m ago' },
    ],
  },
  {
    id: 'a2', title: 'Code Red: Fire Alert', type: 'Code Red', color: '#ef4444',
    location: 'ER - Room 10', status: 'active', responders: 5, timestamp: '5m ago',
    building: 'Emergency Wing', floor: 'Floor 1', department: 'Emergency', room: 'Room 10', notes: 'Smoke detected near east corridor. Evacuation initiated.',
    respondersList: [
      { id: 'r4', name: 'Dr. Layla Noor', role: 'ER Physician', avatar: 'LN', respondedAt: '3m ago' },
      { id: 'r5', name: 'Tech. Samir Raza', role: 'Fire Safety', avatar: 'SR', respondedAt: '4m ago' },
    ],
  },
  {
    id: 'a3', title: 'Code Pink: NICU Alert', type: 'Code Pink', color: '#ec4899',
    location: 'NICU - Room 4', status: 'active', responders: 2, timestamp: '8m ago',
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
  { id: 'a1', title: 'Code Blue: Cardiac Arrest', type: 'urgent', location: 'ICU - Room 6', updatedAt: '2m ago', code: 'Code Blue', color: '#3b82f6' },
  { id: 'a2', title: 'Code Red: Fire Alert', type: 'active', location: 'ER - Room 10', updatedAt: '5m ago', code: 'Code Red', color: '#ef4444' },
  { id: 'a3', title: 'Code Pink: NICU Alert', type: 'pending', location: 'NICU - Room 4', updatedAt: '8m ago', code: 'Code Pink', color: '#ec4899' },
  { id: 'a4', title: 'Code Yellow: Bomb Threat', type: 'resolved', location: 'OR - Room 2', updatedAt: '25m ago', code: 'Code Yellow', color: '#f59e0b' },
  { id: 'a5', title: 'Code Blue: Medical Emergency', type: 'resolved', location: 'Ward B - Room 12', updatedAt: '1h ago', code: 'Code Blue', color: '#3b82f6' },
]

export const MOCK_ACTIVE_CODES: ActiveCode[] = [
  { id: '1', type: 'Code Blue', color: '#3b82f6', location: 'ICU / Dept A / Room 6', responders: 3, status: 'active', timestamp: '2m ago' },
  { id: '2', type: 'Code Red', color: '#ef4444', location: 'ER / Dept B / Room 10', responders: 5, status: 'active', timestamp: '5m ago' },
  { id: '3', type: 'Code Pink', color: '#ec4899', location: 'NICU / Dept C / Room 4', responders: 2, status: 'active', timestamp: '8m ago' },
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

export const MOCK_CODE_TYPES: ApiCodeType[] = [
  { id: 1, name: 'Code Blue', color: '#3B82F6', description: 'Medical emergency – cardiac/respiratory arrest' },
  { id: 2, name: 'Code Red', color: '#EF4444', description: 'Fire emergency' },
  { id: 3, name: 'Code White', color: '#F9FAFB', description: 'Violent or threatening situation' },
  { id: 4, name: 'Code Black', color: '#111827', description: 'Bomb threat' },
  { id: 5, name: 'Code Yellow', color: '#F59E0B', description: 'Missing patient' },
  { id: 6, name: 'Code Pink', color: '#EC4899', description: 'Infant/child abduction' },
]

export async function mockFetchHomeData(): Promise<HomeData> {
  await mockDelay(400)
  return {
    activeRequests: MOCK_ACTIVE_REQUESTS,
    codeTypes: MOCK_CODE_TYPES,
    unreadNotificationCount: 3,
  }
}

export async function mockRespondToAlert(_id: string): Promise<void> {
  await mockDelay(400)
}

export const mockBuildings: LocationOption[] = [
  { id: 1, name: 'Main Building' },
  { id: 2, name: 'Emergency Wing' },
  { id: 3, name: "Women's Center" },
  { id: 4, name: 'Surgical Center' },
]

export const mockFloors: LocationOption[] = [
  { id: 1, name: 'Floor 1' },
  { id: 2, name: 'Floor 2' },
  { id: 3, name: 'Floor 3' },
  { id: 4, name: 'Floor 4' },
]

export const mockDepartments: LocationOption[] = [
  { id: 1, name: 'ICU' },
  { id: 2, name: 'Emergency' },
  { id: 3, name: 'NICU' },
  { id: 4, name: 'Operating Room' },
  { id: 5, name: 'General Ward' },
]

export const mockRooms: LocationOption[] = [
  { id: 1, name: 'Room 1' },
  { id: 2, name: 'Room 2' },
  { id: 3, name: 'Room 3' },
  { id: 4, name: 'Room 4' },
  { id: 5, name: 'Room 5' },
  { id: 6, name: 'Room 6' },
]
