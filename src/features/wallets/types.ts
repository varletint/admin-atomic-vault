export interface WalletData {
  _id: string;
  ownerType: string;
  currency: string;
  available: number;
  pending: number;
  status: "ACTIVE" | "FROZEN";
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  _id: string;
  transactionId: string;
  walletId: string;
  currency: string;
  bucket: "AVAILABLE" | "PENDING";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  entryType: string;
  narration?: string;
  actor: { type: string; id?: string };
  source: string;
  traceId: string;
  dedupeKey?: string;
  balanceAfterAvailable: number;
  balanceAfterPending: number;
  createdAt: string;
}

export interface LedgerResponse {
  wallet: WalletData;
  entries: LedgerEntry[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReconciliationReport {
  walletId: string;
  currency: string;
  walletAvailable: number;
  walletPending: number;
  computedAvailable: number;
  computedPending: number;
  balanced: boolean;
  debitCount: number;
  creditCount: number;
  debitSum: number;
  creditSum: number;
  unpostedTransactions: number;
  lastPostedAt: string | null;
}

export interface RepairResult {
  repaired: number;
  skipped: number;
  failed: number;
}

export interface LedgerQueryParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}
