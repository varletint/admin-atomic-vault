import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { inventoryApi } from "../api/inventoryApi";

export function useInventory(productId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.INVENTORY.DETAIL(productId),
    queryFn: async () => {
      const { data } = await inventoryApi.getByProductId(productId);
      return data.data;
    },
    enabled: !!productId,
  });
}

export function useStockMovements(productId: string, page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.INVENTORY.MOVEMENTS(productId, page),
    queryFn: async () => {
      const { data } = await inventoryApi.getMovements(productId, page);
      return data.data;
    },
    enabled: !!productId,
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
      reason,
    }: {
      productId: string;
      quantity: number;
      reason?: string;
    }) => inventoryApi.adjustStock(productId, quantity, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INVENTORY.ALL,
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.ALL,
      });
    },
  });
}
