import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";
import type { InventoryRecord, StockMovementsResponse } from "../types";

export const inventoryApi = {
  getByProductId: (productId: string) =>
    api.get<ApiResponse<InventoryRecord>>(
      API_ENDPOINTS.INVENTORY.GET(productId)
    ),

  getMovements: (productId: string, page = 1, limit = 20) =>
    api.get<ApiResponse<StockMovementsResponse>>(
      API_ENDPOINTS.INVENTORY.MOVEMENTS(productId),
      { params: { page, limit } }
    ),

  adjustStock: (productId: string, quantity: number, reason?: string) =>
    api.patch<ApiResponse<InventoryRecord>>(
      API_ENDPOINTS.INVENTORY.ADJUST(productId),
      { quantity, reason }
    ),
};
