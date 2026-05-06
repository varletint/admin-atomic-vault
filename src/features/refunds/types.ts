export type RefundStatus =
  | "REQUESTED"
  | "PENDING_APPROVAL"
  | "AWAITING_REVIEW"
  | "PROCESSING"
  | "RETRYING"
  | "GATEWAY_PENDING"
  | "SETTLED"
  | "COMPLETED"
  | "FAILED"
  | "REJECTED";

export interface RefundStatusHistoryEntry {
  status: RefundStatus;
  timestamp: string;
  note?: string;
  actor?: {
    type: "SYSTEM" | "ADMIN" | "CUSTOMER";
    id?: string;
  };
}

export interface RefundRequest {
  _id: string;
  orderId:
    | string
    | { _id: string; totalAmount: number; status: string; items: unknown[] };
  userId: string | { _id: string; name: string; email: string } | null;
  originalTransactionId: string | Record<string, unknown>;
  refundTransactionId?: string | Record<string, unknown>;
  originalAmount: number;
  deductionAmount: number;
  deductionReason?: string;
  refundAmount: number;
  status: RefundStatus;
  reviewedBy?: string | { _id: string; name: string; email: string };
  reviewedAt?: string;
  rejectionReason?: string;
  completedAt?: string;
  providerRefundRef?: string;
  retryCount: number;
  requeueCount: number;
  lastError?: string;
  statusHistory: RefundStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface RefundFilters {
  page?: number;
  limit?: number;
  status?: RefundStatus | "";
}
