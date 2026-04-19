import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  fetchStoreWallet,
  fetchLedger,
  reconcile,
  repair,
  reverseTransaction,
  adjustWallet,
} from "../api/walletsApi";
import type { LedgerQueryParams } from "../types";

export function useStoreWallet() {
  return useQuery({
    queryKey: QUERY_KEYS.WALLETS.STORE,
    queryFn: fetchStoreWallet,
  });
}

export function useLedger(walletId: string, params: LedgerQueryParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.WALLETS.LEDGER(
      walletId,
      params as Record<string, unknown>
    ),
    queryFn: () => fetchLedger(walletId, params),
    enabled: !!walletId,
  });
}

export function useReconcile(walletId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.WALLETS.RECONCILE(walletId),
    queryFn: () => reconcile(walletId),
    enabled: false,
  });
}

export function useRepair() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      walletId,
      body,
    }: {
      walletId: string;
      body: { dryRun?: boolean; confirm?: boolean };
    }) => repair(walletId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLETS.ALL });
    },
  });
}

export function useReverseTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: string;
      reason: string;
    }) => reverseTransaction(transactionId, { reason, confirm: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLETS.ALL });
    },
  });
}

export function useAdjustWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      walletId,
      direction,
      amount,
      reason,
    }: {
      walletId: string;
      direction: "CREDIT" | "DEBIT";
      amount: number;
      reason: string;
    }) => adjustWallet(walletId, { direction, amount, reason, confirm: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLETS.ALL });
    },
  });
}
