import type { LoginRequest, LoginResponse, User } from '@/types/auth'

const mockDelay = (ms = 600) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Dr. Sarah Mitchell',
  role: 'Chief Surgical Officer',
  hospital: 'St. Jude Medical Center',
  email: 'sarah.mitchell@stjude.med',
  phone: '+966 50 123 4567',
  department: 'Surgery',
  employeeId: 'SJM-2024-001',
  initials: 'SM',
  avatarUrl: null,
}

export async function mockLogin(body: LoginRequest): Promise<LoginResponse> {
  await mockDelay()
  if (body.password.length < 4) throw new Error('Invalid credentials')
  return { accessToken: 'mock-token-dev', user: MOCK_USER }
}

export async function mockGetMe(): Promise<User> {
  await mockDelay(300)
  return MOCK_USER
}
