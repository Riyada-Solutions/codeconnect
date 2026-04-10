import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAlerts,
  fetchAlertById,
  respondToAlert,
  escalateAlert,
  activateAlert,
} from '@/data/alert_repository'
import type { ActivateAlertRequest } from '@/types/alert'

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 30_000,
  })
}

export function useAlertDetail(id: string) {
  return useQuery({
    queryKey: ['alerts', id],
    queryFn: () => fetchAlertById(id),
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useRespondToAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => respondToAlert(alertId),
    onSuccess: (_, alertId) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', alertId] })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export function useEscalateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      escalateAlert(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', id] })
    },
  })
}

export function useActivateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ActivateAlertRequest) => activateAlert(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
