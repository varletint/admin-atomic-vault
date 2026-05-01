import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  fetchWithdrawals,
  fetchWithdrawalById,
  initiateWithdrawal,
  resolveAccount,
} from "../api/withdrawalsApi";
import { TERMINAL_STATUSES } from "../types";
import type { WithdrawalListParams } from "../types";

export function useWithdrawals(params: WithdrawalListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.WITHDRAWALS.LIST(params as Record<string, unknown>),
    queryFn: () => fetchWithdrawals(params),
  });
}

export function useWithdrawal(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.WITHDRAWALS.DETAIL(id),
    queryFn: () => fetchWithdrawalById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return 5_000;
    },
  });
}

export function useInitiateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: initiateWithdrawal,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WITHDRAWALS.ALL,
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WALLETS.ALL,
      });
    },
  });
}

/**
 * Auto-resolve bank account name when bankCode + 10-digit accountNumber are provided.
 * No useEffect — React Query's `enabled` handles the triggering declaratively.
 */
export function useResolveAccount(bankCode: string, accountNumber: string) {
  const shouldResolve = !!bankCode && /^\d{10}$/.test(accountNumber);

  return useQuery({
    queryKey: ["resolve-account", bankCode, accountNumber],
    queryFn: () => resolveAccount({ bankCode, accountNumber }),
    enabled: shouldResolve,
    staleTime: 5 * 60_000, // cache for 5 minutes
    retry: 1,
  });
}
