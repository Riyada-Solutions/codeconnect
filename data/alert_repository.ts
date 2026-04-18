import { ENV } from '@/constants/env'
import { apiClient } from './api_client'
import {
  mockFetchAlerts,
  mockFetchAlertById,
  mockFetchActiveRequests,
  mockFetchActiveCodes,
  mockFetchHomeData,
  mockRespondToAlert,
} from './mock/alerts_mock'
import type { Alert, AlertDetail, ActiveRequest, ActiveCode, HomeData, ActivateAlertRequest, ActivateAlertIdRequest, LocationOption } from '@/types/alert'

export async function fetchAlerts(): Promise<Alert[]> {
  if (ENV.USE_MOCK_DATA) return mockFetchAlerts()
  const { data } = await apiClient.get<{ data: Alert[] }>('/alerts')
  return data.data
}

export async function fetchAlertById(id: string): Promise<AlertDetail> {
  if (ENV.USE_MOCK_DATA) return mockFetchAlertById(id)
  const { data } = await apiClient.get<{ data: AlertDetail }>(`/alerts/${id}`)
  return data.data
}

export async function fetchHomeData(): Promise<HomeData> {
  if (ENV.USE_MOCK_DATA) return mockFetchHomeData()
  const res = await apiClient.get('/home')
  return res.data?.data ?? res.data ?? { activeRequests: [], codeTypes: [], unreadNotificationCount: 0 }
}

export async function fetchActiveRequests(): Promise<ActiveRequest[]> {
  if (ENV.USE_MOCK_DATA) return mockFetchActiveRequests()
  const { data } = await apiClient.get<{ data: ActiveRequest[] }>('/home/active-requests')
  return data.data
}

export async function fetchActiveCodes(): Promise<ActiveCode[]> {
  if (ENV.USE_MOCK_DATA) return mockFetchActiveCodes()
  const { data } = await apiClient.get<{ data: ActiveCode[] }>('/alerts?status=active')
  return data.data
}

export async function fetchBuildings(): Promise<LocationOption[]> {
  if (ENV.USE_MOCK_DATA) {
    const { mockBuildings } = await import('./mock/alerts_mock')
    return mockBuildings
  }
  const { data } = await apiClient.get<{ data: LocationOption[] }>('/settings/locations/buildings')
  return data.data
}

export async function fetchFloors(buildingId: number): Promise<LocationOption[]> {
  if (ENV.USE_MOCK_DATA) {
    const { mockFloors } = await import('./mock/alerts_mock')
    return mockFloors
  }
  const { data } = await apiClient.get<{ data: LocationOption[] }>('/settings/locations/floors', {
    params: { building_id: buildingId },
  })
  return data.data
}

export async function fetchDepartments(buildingId: number, floorId: number): Promise<LocationOption[]> {
  if (ENV.USE_MOCK_DATA) {
    const { mockDepartments } = await import('./mock/alerts_mock')
    return mockDepartments
  }
  const { data } = await apiClient.get<{ data: LocationOption[] }>('/settings/locations/departments', {
    params: { building_id: buildingId, floor_id: floorId },
  })
  return data.data
}

export async function fetchRooms(buildingId: number, floorId: number, departmentId: number): Promise<LocationOption[]> {
  if (ENV.USE_MOCK_DATA) {
    const { mockRooms } = await import('./mock/alerts_mock')
    return mockRooms
  }
  const { data } = await apiClient.get<{ data: LocationOption[] }>('/settings/locations/rooms', {
    params: { building_id: buildingId, floor_id: floorId, department_id: departmentId },
  })
  return data.data
}

export async function activateAlert(body: ActivateAlertRequest | ActivateAlertIdRequest): Promise<Alert> {
  if (ENV.USE_MOCK_DATA) {
    const b = body as ActivateAlertRequest
    return {
      id: `mock-${Date.now()}`, title: `${b.type}: ${b.department}`,
      type: b.type, color: '#2daaae', location: `${b.building}, ${b.floor}`,
      status: 'active', responders: 0, timestamp: new Date().toISOString(),
      building: b.building, floor: b.floor,
      department: b.department, room: b.room, notes: b.notes ?? null,
    }
  }
  const { data } = await apiClient.post<{ data: Alert }>('/alerts', body)
  return data.data
}

export async function respondToAlert(id: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return mockRespondToAlert(id)
  await apiClient.post(`/alerts/${id}/respond`)
}

export async function escalateAlert(id: string, reason?: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post(`/alerts/${id}/escalate`, { reason })
}
