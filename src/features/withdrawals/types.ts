export type TransactionStatus =
  | "INITIATED"
  | "RESERVED"
  | "PROCESSING"
  | "UNKNOWN"
  | "CONFIRMED"
  | "FAILED"
  | "REVERSED";

export const TERMINAL_STATUSES: TransactionStatus[] = [
  "CONFIRMED",
  "FAILED",
  "REVERSED",
];

export interface WithdrawalTransaction {
  _id: string;
  type: "PAYOUT";
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: "BANK_TRANSFER";
  provider: string;
  providerRef?: string;
  idempotencyKey: string;
  metadata: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
    reason: string;
    recipientCode?: string;
  };
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalListResponse {
  withdrawals: WithdrawalTransaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WithdrawalListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface InitiateWithdrawalPayload {
  walletId: string;
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  reason?: string;
  idempotencyKey: string;
}

export interface InitiateWithdrawalResult {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
}
