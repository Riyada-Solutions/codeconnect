export interface User {
  id: string
  name: string
  role: string
  hospital: string
  email: string
  phone: string
  department: string
  employeeId: string
  initials?: string
  avatarUrl?: string | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface RegisterRequest {
  registerCode: string
  phone: string
  fullName: string
  email: string
}

export interface VerifyOtpRequest {
  purpose: 'register' | 'reset_password'
  identifier: string
  otp: string
}

export interface ResetPasswordRequest {
  resetToken: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
