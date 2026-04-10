import { useQuery } from '@tanstack/react-query'
import { fetchActiveRequests, fetchActiveCodes } from '@/data/alert_repository'
import { getMe } from '@/data/auth_repository'

export function useActiveRequests() {
  return useQuery({
    queryKey: ['home', 'active-requests'],
    queryFn: fetchActiveRequests,
    staleTime: 30_000,
  })
}

export function useActiveCodes() {
  return useQuery({
    queryKey: ['home', 'active-codes'],
    queryFn: fetchActiveCodes,
    staleTime: 30_000,
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60_000,
  })
}
