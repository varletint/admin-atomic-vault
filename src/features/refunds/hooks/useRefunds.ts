import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { refundApi } from "../api/refundApi";
import type { RefundFilters } from "../types";

export function useRefunds(filters: RefundFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.REFUNDS.LIST(filters as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await refundApi.getRefunds(filters);
      return data.data;
    },
  });
}

export function useRefund(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REFUNDS.DETAIL(id),
    queryFn: async () => {
      const { data } = await refundApi.getRefund(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useApproveRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      deductionAmount,
      deductionReason,
    }: {
      id: string;
      deductionAmount?: number;
      deductionReason?: string;
    }) => refundApi.approveRefund(id, { deductionAmount, deductionReason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFUNDS.ALL });
    },
  });
}

export function useRejectRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      refundApi.rejectRefund(id, { reason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFUNDS.ALL });
    },
  });
}

export function useRequeueRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => refundApi.requeueRefund(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFUNDS.ALL });
    },
  });
}

export function useForceSettle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => refundApi.forceSettle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFUNDS.ALL });
    },
  });
}

export function useDrainOutbox() {
  return useMutation({
    mutationFn: () => refundApi.drainOutbox(),
  });
}
