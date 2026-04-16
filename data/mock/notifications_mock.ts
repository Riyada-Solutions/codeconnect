import type { AppNotification } from '@/types/notification'

const mockDelay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 1, title: 'Code Blue Activated', message: 'ICU Room 6 - Cardiac arrest reported', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), read: false, type: 'emergency', code_type: 'Code Blue', code_color: '#3B82F6', location: 'ICU - Room 6', activated_by: null },
  { id: 2, title: 'Response Acknowledged', message: 'Dr. Ahmed Hassan responded to Code Blue', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), read: false, type: 'info', code_type: null, code_color: null, location: null, activated_by: null },
  { id: 3, title: 'Code Red Resolved', message: 'ER Room 10 - Fire alert cleared', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), read: true, type: 'success', code_type: null, code_color: null, location: null, activated_by: null },
  { id: 4, title: 'Shift Reminder', message: 'Your next shift starts in 2 hours', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), read: true, type: 'info', code_type: null, code_color: null, location: null, activated_by: null },
  { id: 5, title: 'System Update', message: 'CodeConnect v2.1 is now available', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), read: true, type: 'info', code_type: null, code_color: null, location: null, activated_by: null },
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
