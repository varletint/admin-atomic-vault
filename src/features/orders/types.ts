/* ── Order Types (synced with storefront + backend) ── */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type PaymentMethod =
  | "CARD"
  | "BANK_TRANSFER"
  | "WALLET"
  | "USSD"
  | "CASH_ON_DELIVERY"
  | "CASH_IN_STORE";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
}

export interface OrderItem {
  product: string;
  variant?: string;
  variantLabel?: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  checkoutType: "REGISTERED" | "GUEST";
  user?: { _id: string; name: string; email: string } | string;
  guestContact?: { email: string; phone: string };
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  idempotencyKey: string;
  shippingAddress: Address;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  order: string;
  user?: string;
  amount: number;
  currency: string;
  status:
    | "INITIATED"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "REFUND_INITIATED"
    | "REFUNDED";
  paymentMethod: PaymentMethod;
  provider: string;
  providerRef?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus | "";
  search?: string;
}
