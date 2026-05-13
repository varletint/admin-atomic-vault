import { StatusBadge } from "@/components/ui/StatusBadge";
import type { SettlementStatus } from "../types";

const STATUS_VARIANTS: Record<
  SettlementStatus,
  { variant: "success" | "error" | "warning" | "info" | "neutral" }
> = {
  PENDING: { variant: "warning" },
  RECONCILED: { variant: "success" },
  PARTIAL: { variant: "info" },
  FAILED: { variant: "error" },
};

export function SettlementStatusBadge({ status }: { status: SettlementStatus }) {
  const config = STATUS_VARIANTS[status] ?? { variant: "neutral" as const };
  return <StatusBadge label={status} variant={config.variant} />;
}
