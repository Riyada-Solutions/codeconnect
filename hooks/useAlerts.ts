import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAlerts,
  fetchAlertById,
  respondToAlert,
  escalateAlert,
  activateAlert,
  fetchBuildings,
  fetchFloors,
  fetchDepartments,
  fetchRooms,
} from '@/data/alert_repository'
import type { ActivateAlertRequest, ActivateAlertIdRequest } from '@/types/alert'

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
    mutationFn: (body: ActivateAlertRequest | ActivateAlertIdRequest) => activateAlert(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}

export function useBuildings() {
  return useQuery({
    queryKey: ['locations', 'buildings'],
    queryFn: fetchBuildings,
    staleTime: 5 * 60_000,
  })
}

export function useFloors(buildingId: number | null) {
  return useQuery({
    queryKey: ['locations', 'floors', buildingId],
    queryFn: () => fetchFloors(buildingId!),
    enabled: buildingId !== null,
    staleTime: 5 * 60_000,
  })
}

export function useDepartments(buildingId: number | null, floorId: number | null) {
  return useQuery({
    queryKey: ['locations', 'departments', buildingId, floorId],
    queryFn: () => fetchDepartments(buildingId!, floorId!),
    enabled: buildingId !== null && floorId !== null,
    staleTime: 5 * 60_000,
  })
}

export function useRooms(buildingId: number | null, floorId: number | null, departmentId: number | null) {
  return useQuery({
    queryKey: ['locations', 'rooms', buildingId, floorId, departmentId],
    queryFn: () => fetchRooms(buildingId!, floorId!, departmentId!),
    enabled: buildingId !== null && floorId !== null && departmentId !== null,
    staleTime: 5 * 60_000,
  })
}
