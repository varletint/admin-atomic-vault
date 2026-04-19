import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  fetchUsers,
  fetchUserById,
  suspendUser,
  reactivateUser,
  deactivateUser,
  fetchUserOrders,
} from "../api/usersApi";
import type { UsersQueryParams } from "../types";

export function useUsers(filters: UsersQueryParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(filters as Record<string, unknown>),
    queryFn: () => fetchUsers(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
}

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ["users", "orders", userId] as const,
    queryFn: () => fetchUserOrders(userId),
    enabled: !!userId,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      suspendUser(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reactivateUser(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      deactivateUser(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}
