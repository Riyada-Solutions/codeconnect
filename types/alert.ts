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
  status: 'active' | 'resolved'
  responders: number
  timestamp: string
  building: string | null
  floor: string | null
  department: string | null
  room: string | null
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

export interface ApiCodeType {
  id: number
  name: string
  color: string
  description: string
}

export interface HomeData {
  activeRequests: ActiveRequest[]
  codeTypes: ApiCodeType[]
  unreadNotificationCount: number
}

export interface LocationOption {
  id: number
  name: string
}

// String-based (legacy, still accepted by API)
export interface ActivateAlertRequest {
  type: string
  building: string
  floor: string
  department: string
  room: string
  notes?: string
}

// ID-based (preferred by API)
export interface ActivateAlertIdRequest {
  code_type_id: number
  building_id: number
  floor_id: number
  department_id: number
  room_id: number
  notes?: string
}
