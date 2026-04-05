import type { OrderStatus } from "../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-[var(--color-bg-muted)] text-[var(--color-text)]",
  CONFIRMED: "bg-[var(--color-info-bg)] text-[var(--color-info)]",
  SHIPPED: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  DELIVERED: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  CANCELLED: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  FAILED: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${STATUS_STYLES[status] || ""}`}
    >
      {status}
    </span>
  );
}
