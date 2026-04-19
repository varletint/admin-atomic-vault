import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  WalletData,
  LedgerResponse,
  LedgerQueryParams,
  ReconciliationReport,
  RepairResult,
} from "../types";

export async function fetchStoreWallet(): Promise<WalletData> {
  const { data } = await api.get<{ success: boolean; data: WalletData }>(
    API_ENDPOINTS.WALLETS.STORE
  );
  return data.data;
}

export async function fetchLedger(
  walletId: string,
  params: LedgerQueryParams = {}
): Promise<LedgerResponse> {
  const { data } = await api.get<{ success: boolean; data: LedgerResponse }>(
    API_ENDPOINTS.WALLETS.LEDGER(walletId),
    { params }
  );
  return data.data;
}

export async function reconcile(
  walletId: string
): Promise<ReconciliationReport> {
  const { data } = await api.get<{
    success: boolean;
    data: ReconciliationReport;
  }>(API_ENDPOINTS.WALLETS.RECONCILE(walletId));
  return data.data;
}

export async function repair(
  walletId: string,
  body: { dryRun?: boolean; confirm?: boolean }
): Promise<RepairResult> {
  const { data } = await api.post<{ success: boolean; data: RepairResult }>(
    API_ENDPOINTS.WALLETS.REPAIR(walletId),
    body
  );
  return data.data;
}

export async function reverseTransaction(
  transactionId: string,
  body: { reason: string; confirm: boolean }
): Promise<{ reversalTransactionId: string }> {
  const { data } = await api.post<{
    success: boolean;
    data: { reversalTransactionId: string };
  }>(API_ENDPOINTS.WALLETS.REVERSE(transactionId), body);
  return data.data;
}

export async function adjustWallet(
  walletId: string,
  body: {
    direction: "CREDIT" | "DEBIT";
    amount: number;
    reason: string;
    confirm: boolean;
  }
): Promise<{ adjustmentTransactionId: string }> {
  const { data } = await api.post<{
    success: boolean;
    data: { adjustmentTransactionId: string };
  }>(API_ENDPOINTS.WALLETS.ADJUST(walletId), body);
  return data.data;
}
