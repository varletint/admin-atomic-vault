/* ── Audit Log Types (synced with backend AuditLog model) ── */

export type AuditSeverity = "info" | "warning" | "error" | "critical";

export type AuditEntityType =
  | "User"
  | "Order"
  | "Transaction"
  | "Product"
  | "Cart"
  | "Inventory"
  | "TrackingEvent"
  | "OutboxEvent"
  | "System"
  | "Ledger"
  | "Wallet"
  | "Other";

export interface AuditLog {
  _id: string;
  action: string;
  actor: {
    userId?: string;
    email?: string;
    role?: string;
    isSystem: boolean;
  };
  entity?: {
    type: AuditEntityType;
    id?: string;
    name?: string;
  };
  changes?: {
    before?: unknown;
    after?: unknown;
    changedFields?: string[];
  };
  request?: {
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
    method?: string;
  };
  result?: {
    success: boolean;
    errorMessage?: string;
    errorCode?: string;
  };
  metadata?: Record<string, unknown>;
  severity: AuditSeverity;
  createdAt: string;
  updatedAt: string;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  action?: string;
  severity?: AuditSeverity;
  entityType?: AuditEntityType;
  from?: string;
  to?: string;
}

export interface AuditListResponse {
  logs: AuditLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
