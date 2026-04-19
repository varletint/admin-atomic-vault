import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchUsers, fetchUserById, updateUserStatus } from "../api/usersApi";
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

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "SUSPENDED";
    }) => updateUserStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}
