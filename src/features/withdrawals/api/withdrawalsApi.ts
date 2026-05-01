import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  WithdrawalTransaction,
  WithdrawalListResponse,
  WithdrawalListParams,
  InitiateWithdrawalPayload,
  InitiateWithdrawalResult,
} from "../types";

export async function fetchWithdrawals(
  params: WithdrawalListParams = {}
): Promise<WithdrawalListResponse> {
  const { data } = await api.get<{
    success: boolean;
    data: WithdrawalListResponse;
  }>(API_ENDPOINTS.WITHDRAWALS.LIST, { params });
  return data.data;
}

export async function fetchWithdrawalById(
  id: string
): Promise<WithdrawalTransaction> {
  const { data } = await api.get<{
    success: boolean;
    data: WithdrawalTransaction;
  }>(API_ENDPOINTS.WITHDRAWALS.DETAIL(id));
  return data.data;
}

export async function initiateWithdrawal(
  payload: InitiateWithdrawalPayload
): Promise<InitiateWithdrawalResult> {
  const { data } = await api.post<{
    success: boolean;
    data: InitiateWithdrawalResult;
  }>(API_ENDPOINTS.WITHDRAWALS.INITIATE, payload);
  return data.data;
}

export async function resolveAccount(params: {
  bankCode: string;
  accountNumber: string;
}): Promise<{ accountNumber: string; accountName: string }> {
  const { data } = await api.get<{
    success: boolean;
    data: { accountNumber: string; accountName: string };
  }>(API_ENDPOINTS.WITHDRAWALS.RESOLVE_ACCOUNT, {
    params: {
      bank_code: params.bankCode,
      account_number: params.accountNumber,
    },
  });
  return data.data;
}
