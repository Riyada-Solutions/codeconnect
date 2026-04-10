import { ENV } from '@/constants/env'
import { apiClient } from './api_client'
import {
  mockFetchNotifications,
  mockMarkNotificationRead,
  mockMarkAllRead,
} from './mock/notifications_mock'
import type { AppNotification } from '@/types/notification'

export async function fetchNotifications(): Promise<AppNotification[]> {
  if (ENV.USE_MOCK_DATA) return mockFetchNotifications()
  const { data } = await apiClient.get<{ data: AppNotification[] }>('/notifications')
  return data.data
}

export async function markNotificationRead(id: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return mockMarkNotificationRead(id)
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  if (ENV.USE_MOCK_DATA) return mockMarkAllRead()
  await apiClient.post('/notifications/read-all')
}
