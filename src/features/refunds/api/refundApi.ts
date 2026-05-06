import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";
import type { RefundRequest, RefundFilters } from "../types";

interface RefundListResponse {
  refunds: RefundRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const refundApi = {
  getRefunds: (filters: RefundFilters = {}) => {
    const params: Record<string, string | number> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status) params.status = filters.status;

    return api.get<ApiResponse<RefundListResponse>>(
      API_ENDPOINTS.REFUNDS.LIST,
      { params }
    );
  },

  getRefund: (id: string) =>
    api.get<ApiResponse<RefundRequest>>(API_ENDPOINTS.REFUNDS.DETAIL(id)),

  approveRefund: (
    id: string,
    body: { deductionAmount?: number; deductionReason?: string }
  ) =>
    api.post<ApiResponse<RefundRequest>>(
      API_ENDPOINTS.REFUNDS.APPROVE(id),
      body
    ),

  rejectRefund: (id: string, body: { reason: string }) =>
    api.post<ApiResponse<RefundRequest>>(
      API_ENDPOINTS.REFUNDS.REJECT(id),
      body
    ),

  requeueRefund: (id: string) =>
    api.post<ApiResponse<RefundRequest>>(API_ENDPOINTS.REFUNDS.REQUEUE(id)),
};
