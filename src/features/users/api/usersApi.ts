import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AdminUser, UsersListResponse, UsersQueryParams } from "../types";

export async function fetchUsers(
  params: UsersQueryParams = {}
): Promise<UsersListResponse["data"]> {
  const { data } = await api.get<UsersListResponse>(API_ENDPOINTS.USERS.LIST, {
    params,
  });
  return data.data;
}

export async function fetchUserById(id: string): Promise<AdminUser> {
  const { data } = await api.get<{ success: boolean; data: AdminUser }>(
    API_ENDPOINTS.USERS.DETAIL(id)
  );
  return data.data;
}

export async function updateUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<AdminUser> {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    API_ENDPOINTS.USERS.UPDATE_STATUS(id),
    { status }
  );
  return data.data;
}
