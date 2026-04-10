import type { AppNotification } from '@/types/notification'

const mockDelay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Code Blue Activated', message: 'ICU Room 6 - Cardiac arrest reported', time: '2m ago', read: false, type: 'urgent' },
  { id: 'n2', title: 'Response Acknowledged', message: 'Dr. Ahmed Hassan responded to Code Blue', time: '3m ago', read: false, type: 'info' },
  { id: 'n3', title: 'Code Red Resolved', message: 'ER Room 10 - Fire alert cleared', time: '30m ago', read: true, type: 'success' },
  { id: 'n4', title: 'Shift Reminder', message: 'Your next shift starts in 2 hours', time: '1h ago', read: true, type: 'info' },
  { id: 'n5', title: 'System Update', message: 'CodeConnect v2.1 is now available', time: '3h ago', read: true, type: 'info' },
]

export async function mockFetchNotifications(): Promise<AppNotification[]> {
  await mockDelay()
  return MOCK_NOTIFICATIONS
}

export async function mockMarkNotificationRead(_id: string): Promise<void> {
  await mockDelay(200)
}

export async function mockMarkAllRead(): Promise<void> {
  await mockDelay(300)
}
