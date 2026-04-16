export interface AppNotification {
  id: number
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'emergency' | 'info' | 'warning' | 'success'
  code_type: string | null
  code_color: string | null
  location: string | null
  activated_by: string | null
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
