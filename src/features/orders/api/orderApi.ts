import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { OrdersPaginatedResponse, ApiResponse } from "@/api/types";
import type { Order, OrderFilters, OrderStatus } from "../types";

export const orderApi = {
  getOrders: (filters: OrderFilters = {}) => {
    const params: Record<string, string | number> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    return api.get<OrdersPaginatedResponse<Order>>(API_ENDPOINTS.ORDERS.LIST, {
      params,
    });
  },

  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(id)),

  updateStatus: (id: string, status: OrderStatus, note?: string) =>
    api.patch<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), {
      status,
      note,
    }),

  cancelOrder: (id: string) =>
    api.patch<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CANCEL(id), {
      status: "CANCELLED",
      reason: "Cancelled by admin",
    }),
};
