import { Check, Clock, AlertTriangle, X, RotateCcw } from "lucide-react";
import type { TransactionStatus } from "../types";
import { formatDate } from "@/utils/format";

interface TimelineStep {
  status: TransactionStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const STEPS: TimelineStep[] = [
  {
    status: "RESERVED",
    label: "Funds Reserved",
    icon: <Clock size={14} />,
    color: "var(--color-warning)",
  },
  {
    status: "PROCESSING",
    label: "Transfer Initiated",
    icon: <Clock size={14} />,
    color: "var(--color-info)",
  },
  {
    status: "CONFIRMED",
    label: "Transfer Complete",
    icon: <Check size={14} />,
    color: "var(--color-success)",
  },
];

const STATUS_ORDER: TransactionStatus[] = [
  "INITIATED",
  "RESERVED",
  "PROCESSING",
  "CONFIRMED",
];

function getStepIndex(status: TransactionStatus): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? -1 : idx;
}

interface WithdrawalTimelineProps {
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  failureReason?: string;
}

export function WithdrawalTimeline({
  status,
  createdAt,
  updatedAt,
  paidAt,
  failureReason,
}: WithdrawalTimelineProps) {
  const currentIdx = getStepIndex(status);
  const isFailed = status === "FAILED";
  const isUnknown = status === "UNKNOWN";
  const isReversed = status === "REVERSED";

  return (
    <div className='space-y-0'>
      {/* Happy-path steps */}
      {STEPS.map((step, i) => {
        const stepIdx = getStepIndex(step.status);
        const isComplete = currentIdx >= stepIdx;
        const isCurrent = status === step.status;

        return (
          <div key={step.status} className='flex gap-3'>
            {/* Connector */}
            <div className='flex flex-col items-center'>
              <div
                style={{
                  borderColor: isComplete ? step.color : "var(--color-border)",
                  color: isComplete ? step.color : "var(--color-text-muted)",
                }}
                className={`flex size-7 shrink-0 items-center justify-center border-2 ${
                  isCurrent ? "animate-pulse" : ""
                }`}>
                {step.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    backgroundColor: isComplete
                      ? step.color
                      : "var(--color-border)",
                  }}
                  className='h-8 w-px'
                />
              )}
            </div>

            {/* Content */}
            <div className='pb-6'>
              <p
                style={{
                  color: isComplete
                    ? "var(--color-text-heading)"
                    : "var(--color-text-muted)",
                }}
                className='text-sm font-semibold'>
                {step.label}
              </p>
              {isComplete && (
                <p className='mt-0.5 text-xs tabular-nums text-admin-faint'>
                  {step.status === "CONFIRMED" && paidAt
                    ? formatDate(paidAt)
                    : step.status === "RESERVED"
                    ? formatDate(createdAt)
                    : formatDate(updatedAt)}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Failed state */}
      {isFailed && (
        <div className='flex gap-3'>
          <div className='flex flex-col items-center'>
            <div
              style={{
                borderColor: "var(--color-error)",
                color: "var(--color-error)",
              }}
              className='flex size-7 shrink-0 items-center justify-center border-2'>
              <X size={14} />
            </div>
          </div>
          <div>
            <p className='text-sm font-semibold text-[var(--color-error)]'>
              Transfer Failed
            </p>
            <p className='mt-0.5 text-xs tabular-nums text-admin-faint'>
              {formatDate(updatedAt)}
            </p>
            {failureReason && (
              <p className='mt-1 text-xs text-[var(--color-error)]'>
                {failureReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Unknown state */}
      {isUnknown && (
        <div className='flex gap-3'>
          <div className='flex flex-col items-center'>
            <div
              style={{
                borderColor: "var(--color-warning)",
                color: "var(--color-warning)",
              }}
              className='flex size-7 shrink-0 animate-pulse items-center justify-center border-2'>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div>
            <p className='text-sm font-semibold text-[var(--color-warning)]'>
              Needs Attention
            </p>
            <p className='mt-0.5 text-xs text-admin-faint'>
              The system will retry automatically.
            </p>
          </div>
        </div>
      )}

      {/* Reversed state */}
      {isReversed && (
        <div className='flex gap-3'>
          <div className='flex flex-col items-center'>
            <div
              style={{
                borderColor: "var(--color-info)",
                color: "var(--color-info)",
              }}
              className='flex size-7 shrink-0 items-center justify-center border-2'>
              <RotateCcw size={14} />
            </div>
          </div>
          <div>
            <p className='text-sm font-semibold text-[var(--color-info)]'>
              Reversed
            </p>
            <p className='mt-0.5 text-xs tabular-nums text-admin-faint'>
              {formatDate(updatedAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
