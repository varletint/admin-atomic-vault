import type { StatusHistoryEntry, OrderStatus } from "../types";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

function formatTime(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

interface OrderTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: OrderStatus;
}

export function OrderTimeline({ history, currentStatus }: OrderTimelineProps) {
  const completedStatuses = new Set(history.map((h) => h.status));
  const isCancelledOrFailed =
    currentStatus === "CANCELLED" || currentStatus === "FAILED";

  const historyMap = new Map(history.map((h) => [h.status, h]));

  const steps = isCancelledOrFailed
    ? history
    : ALL_STATUSES.map((status) => ({
        status,
        timestamp: historyMap.get(status)?.timestamp ?? "",
        note: historyMap.get(status)?.note,
      }));

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isCompleted = completedStatuses.has(step.status);
        const isLast = i === steps.length - 1;

        return (
          <div key={step.status + i} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`size-3 shrink-0 rounded-full border-2 ${
                  isCompleted
                    ? "border-admin-ink bg-admin-ink"
                    : "border-[var(--color-border-strong)] bg-[var(--color-bg)]"
                }`}
              />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-6 ${
                    isCompleted
                      ? "bg-admin-ink"
                      : "bg-[var(--color-border)]"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 ${!isLast ? "" : ""}`}>
              <p
                className={`text-xs font-bold uppercase tracking-[0.12em] ${
                  isCompleted ? "text-admin-ink" : "text-admin-faint"
                }`}
              >
                {step.status}
              </p>
              {step.timestamp && (
                <p className="mt-0.5 text-[11px] text-admin-faint">
                  {formatTime(step.timestamp)}
                </p>
              )}
              {step.note && (
                <p className="mt-1 text-xs text-admin-muted">{step.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
