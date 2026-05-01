import type { TransactionStatus } from "../types";

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; color: string; bg: string }
> = {
  INITIATED: {
    label: "Initializing",
    color: "var(--color-text-muted)",
    bg: "var(--color-bg-muted)",
  },
  RESERVED: {
    label: "Funds Reserved",
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
  },
  PROCESSING: {
    label: "Transfer in Progress",
    color: "var(--color-info)",
    bg: "var(--color-info-bg)",
  },
  UNKNOWN: {
    label: "Needs Attention",
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
  },
  CONFIRMED: {
    label: "Transfer Complete",
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
  },
  FAILED: {
    label: "Transfer Failed",
    color: "var(--color-error)",
    bg: "var(--color-error-bg)",
  },
  REVERSED: {
    label: "Reversed",
    color: "var(--color-info)",
    bg: "var(--color-info-bg)",
  },
};

interface WithdrawalStatusBadgeProps {
  status: TransactionStatus;
}

export function WithdrawalStatusBadge({ status }: WithdrawalStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      style={{
        color: config.color,
        backgroundColor: config.bg,
      }}
      className='inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]'>
      {config.label}
    </span>
  );
}
