import AsyncStorage from '@react-native-async-storage/async-storage'
import { ENV } from '@/constants/env'
import { apiClient } from './api_client'
import { mockLogin, mockGetMe } from './mock/auth_mock'
import type {
  LoginRequest,
  LoginResponse,
  User,
  RegisterRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types/auth'

export async function login(body: LoginRequest): Promise<LoginResponse> {
  if (ENV.USE_MOCK_DATA) return mockLogin(body)
  const { data } = await apiClient.post<{ data: LoginResponse }>('/auth/login', body)
  await AsyncStorage.setItem('access_token', data.data.accessToken)
  return data.data
}

export async function getMe(): Promise<User> {
  if (ENV.USE_MOCK_DATA) return mockGetMe()
  const res = await apiClient.get('/me')
  return res.data?.data ?? res.data
}

export async function register(body: RegisterRequest): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/register', body)
}

export async function verifyOtp(body: VerifyOtpRequest): Promise<{ resetToken?: string }> {
  if (ENV.USE_MOCK_DATA) return {}
  const { data } = await apiClient.post('/auth/verify-otp', body)
  return data
}

export async function resendOtp(purpose: string, identifier: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/resend-otp', { purpose, identifier })
}

export async function forgotPassword(email: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/forgot-password', { email })
}

export async function resetPassword(body: ResetPasswordRequest): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  // API requires: { email, resetToken, newPassword }
  await apiClient.post('/auth/reset-password', body)
}

export async function changePassword(body: ChangePasswordRequest): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/change-password', body)
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('access_token')
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/logout').catch(() => {})
}

export async function deleteAccount(password: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/auth/delete-account', { password, confirmation: 'DELETE' })
}

export async function updateMe(body: { name: string; phone: string }): Promise<User> {
  if (ENV.USE_MOCK_DATA) return mockGetMe()
  const res = await apiClient.patch('/me', body)
  return res.data?.data ?? res.data
}

export async function updateDeviceToken(userId: string, token: string): Promise<void> {
  if (ENV.USE_MOCK_DATA) return
  await apiClient.post('/me/device-token', { token, platform: 'android' })
}
