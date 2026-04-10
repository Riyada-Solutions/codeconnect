import { ENV } from '@/constants/env'
import { apiClient } from './api_client'
import {
  mockFetchAlerts,
  mockFetchAlertById,
  mockFetchActiveRequests,
  mockFetchActiveCodes,
  mockRespondToAlert,
} from './mock/alerts_mock'
import type { Alert, AlertDetail, ActiveRequest, ActiveCode, ActivateAlertRequest } from '@/types/alert'

export async function fetchAlerts(): Promise<Alert[]> {
  if (ENV.USE_MOCK_DATA) return mockFetchAlerts()
  const { data } = await apiClient.get<{ data: Alert[] }>('/alerts')
  return data.data
}

export async function fetchAlertById(id: string): Promise<AlertDetail> {
  if (ENV.USE_MOCK_DATA) return mockFetchAlertById(id)
  const { data } = await apiClient.get<AlertDetail>(`/alerts/${id}`)
  return data
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

export async function activateAlert(body: ActivateAlertRequest): Promise<Alert> {
  if (ENV.USE_MOCK_DATA) {
    return {
      id: `mock-${Date.now()}`, title: `${body.type}: ${body.department}`,
      type: body.type, color: '#2daaae', location: `${body.building}, ${body.floor}`,
      status: 'active', responders: 0, timestamp: 'just now',
      building: body.building, floor: body.floor,
      department: body.department, room: body.room, notes: body.notes ?? null,
    }
  }
  const { data } = await apiClient.post<Alert>('/alerts', body)
  return data
}

export async function respondToAlert(id: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return mockRespondToAlert(id)
  await apiClient.post(`/alerts/${id}/respond`)
}

export async function escalateAlert(id: string, reason?: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post(`/alerts/${id}/escalate`, { reason })
}
