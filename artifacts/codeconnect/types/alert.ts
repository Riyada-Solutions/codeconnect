export interface Responder {
  id: string
  name: string
  role: string
  avatar: string
  respondedAt: string
}

export interface Alert {
  id: string
  title: string
  type: string
  color: string
  location: string
  status: 'active' | 'pending' | 'resolved'
  responders: number
  timestamp: string
  building: string
  floor: string
  department: string
  room: string
  notes?: string | null
}

export interface AlertDetail extends Alert {
  respondersList: Responder[]
}

export interface ActiveCode {
  id: string
  type: string
  color: string
  location: string
  responders: number
  status: string
  timestamp: string
}

export interface ActiveRequest {
  id: string
  title: string
  type: 'urgent' | 'pending' | 'transit' | 'active' | 'resolved'
  location: string
  updatedAt: string
  code: string
  color: string
}

export interface ActivateAlertRequest {
  type: string
  building: string
  floor: string
  department: string
  room: string
  notes?: string
}
