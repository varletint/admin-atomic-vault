import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "../types";

const STATUS_VARIANTS: Record<OrderStatus, { variant: "success" | "error" | "warning" | "info" | "neutral" }> = {
  PENDING: { variant: "neutral" },
  CONFIRMED: { variant: "info" },
  SHIPPED: { variant: "warning" },
  DELIVERED: { variant: "success" },
  CANCELLED: { variant: "error" },
  FAILED: { variant: "error" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_VARIANTS[status] ?? { variant: "neutral" as const };

  return <StatusBadge label={status} variant={config.variant} />;
}
