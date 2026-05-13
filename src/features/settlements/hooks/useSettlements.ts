import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchSettlements, fetchSettlement } from "../api/settlementsApi";
import type { SettlementFilters } from "../types";

export function useSettlements(filters: SettlementFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.SETTLEMENTS.LIST(filters as Record<string, unknown>),
    queryFn: () => fetchSettlements(filters),
  });
}

export function useSettlement(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SETTLEMENTS.DETAIL(id),
    queryFn: () => fetchSettlement(id),
    enabled: !!id,
  });
}
