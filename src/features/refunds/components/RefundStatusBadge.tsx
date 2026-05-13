import { StatusBadge } from "@/components/ui/StatusBadge";
import type { RefundStatus } from "../types";

const STATUS_CONFIG: Record<
  RefundStatus,
  { label: string; variant: "success" | "error" | "warning" | "info" | "neutral" }
> = {
  REQUESTED: { label: "Requested", variant: "warning" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  AWAITING_REVIEW: { label: "Awaiting Review", variant: "warning" },
  PROCESSING: { label: "Processing", variant: "info" },
  RETRYING: { label: "Retrying", variant: "info" },
  GATEWAY_PENDING: { label: "Gateway Pending", variant: "info" },
  SETTLED: { label: "Settled", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  FAILED: { label: "Failed", variant: "error" },
  REJECTED: { label: "Rejected", variant: "neutral" },
};

export function RefundStatusBadge({ status }: { status: RefundStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    variant: "neutral" as const,
  };

  return <StatusBadge label={config.label} variant={config.variant} />;
}
