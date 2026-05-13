/* ── Settlement Types (synced with backend Settlement model) ── */

export type SettlementStatus = "PENDING" | "RECONCILED" | "PARTIAL" | "FAILED";
export type SettlementItemMatch = "MATCHED" | "UNMATCHED" | "AMOUNT_MISMATCH";

export interface SettlementItem {
  paystackRef: string;
  grossAmount: number;
  fee: number;
  netAmount: number;
  matchStatus: SettlementItemMatch;
  transactionId?: string;
}

export interface Settlement {
  _id: string;
  paystackId: string;
  status: SettlementStatus;
  totalAmount: number;
  totalFees: number;
  netAmount: number;
  currency: string;
  settledAt: string;
  reconciledAt?: string;
  items: SettlementItem[];
  unmatchedCount: number;
  mismatchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementFilters {
  page?: number;
  limit?: number;
  status?: SettlementStatus;
}

export interface SettlementListResponse {
  settlements: Settlement[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
