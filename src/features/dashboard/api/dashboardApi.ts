import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

export interface CardStats {
  total: number;
  daily: number[];
  change: number;
  trend: "up" | "down";
}

export interface DashboardStats {
  revenue: {
    totalRevenue: CardStats;
    avgOrderValue: CardStats;
    totalProfit: CardStats;
  };
  orders: {
    totalOrders: CardStats;
    fulfilled: CardStats;
    cancelled: CardStats;
  };
  customers: {
    totalCustomers: CardStats;
    newCustomers: CardStats;
    activeCustomers: CardStats;
  };
  products: {
    totalProducts: CardStats;
    unitsSold: CardStats;
    inventoryValue: CardStats;
  };
}

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.DASHBOARD.STATS),
};
