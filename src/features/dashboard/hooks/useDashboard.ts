import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { dashboardApi } from "../api/dashboardApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: async () => {
      const { data } = await dashboardApi.getStats();
      return data.data;
    },
    // Cache for 5 minutes since these are aggregated stats
    staleTime: 5 * 60 * 1000,
  });
}
