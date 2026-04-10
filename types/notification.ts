export interface AppNotification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'urgent' | 'info' | 'success'
}

export interface NotificationPayload {
  id: string
  type: NotificationType
  data?: Record<string, string>
}

export enum NotificationType {
  general = 'general',
  emergency_alert = 'emergency_alert',
  code_activated = 'code_activated',
  responder_assigned = 'responder_assigned',
  alert_resolved = 'alert_resolved',
}
