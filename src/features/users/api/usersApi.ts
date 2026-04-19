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

export async function suspendUser(
  id: string,
  reason: string
): Promise<AdminUser> {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    `/users/${id}/suspend`,
    { reason }
  );
  return data.data;
}

export async function reactivateUser(
  id: string,
  reason: string
): Promise<AdminUser> {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    `/users/${id}/reactivate`,
    { reason }
  );
  return data.data;
}

export async function deactivateUser(
  id: string,
  reason: string
): Promise<AdminUser> {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    `/users/${id}/deactivate`,
    { reason }
  );
  return data.data;
}

export interface UserOrderSummary {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export async function fetchUserOrders(
  userId: string
): Promise<{ orders: UserOrderSummary[] }> {
  const { data } = await api.get<{
    success: boolean;
    data: { orders: UserOrderSummary[] };
  }>(`/orders/admin`, { params: { userId, limit: 10 } });
  return data.data;
}
