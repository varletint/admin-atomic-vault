import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { Settlement, SettlementFilters, SettlementListResponse } from "../types";

export async function fetchSettlements(
  filters: SettlementFilters = {}
): Promise<SettlementListResponse> {
  const params: Record<string, unknown> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.status) params.status = filters.status;

  const { data } = await api.get(API_ENDPOINTS.SETTLEMENTS.LIST, { params });
  return data.data;
}

export async function fetchSettlement(id: string): Promise<Settlement> {
  const { data } = await api.get(API_ENDPOINTS.SETTLEMENTS.DETAIL(id));
  return data.data;
}
