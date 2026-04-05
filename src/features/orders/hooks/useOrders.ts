import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { orderApi } from "../api/orderApi";
import type { OrderFilters, OrderStatus } from "../types";

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.LIST(filters as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await orderApi.getOrders(filters);
      return data.data; // { orders, total, page, limit, totalPages }
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAIL(id),
    queryFn: async () => {
      const { data } = await orderApi.getOrder(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
    }) => orderApi.updateStatus(id, status, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderApi.cancelOrder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
    },
  });
}
