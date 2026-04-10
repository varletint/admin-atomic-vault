/* ── Inventory Types (synced with backend) ── */

export type StockMovementType =
  | "INBOUND"
  | "OUTBOUND"
  | "RESERVE"
  | "RELEASE"
  | "COMMIT"
  | "ADJUSTMENT";

export interface InventoryRecord {
  _id: string;
  product: string;
  variant?: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  _id: string;
  product: string;
  variant?: string;
  type: StockMovementType;
  quantity: number;
  direction: 1 | -1;
  balanceAfter: number;
  reservedAfter: number;
  reference?: {
    orderId?: string;
    reason?: string;
  };
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementsResponse {
  movements: StockMovement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
