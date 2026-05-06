import { formatDate } from "@/utils/format";
import { RefundStatusBadge } from "./RefundStatusBadge";
import type { RefundStatusHistoryEntry } from "../types";

interface RefundTimelineProps {
  history: RefundStatusHistoryEntry[];
}

export function RefundTimeline({ history }: RefundTimelineProps) {
  if (!history.length) {
    return (
      <p className="text-xs text-admin-faint">No status history recorded.</p>
    );
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative ml-3 space-y-6 border-l border-[var(--color-border)] pb-2">
      {sorted.map((entry, idx) => (
        <div key={idx} className="relative pl-6">
          <div
            className={`absolute -left-[5px] top-1 h-[9px] w-[9px] border border-admin-ink ${
              idx === 0 ? "bg-admin-ink" : "bg-admin-surface"
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <RefundStatusBadge status={entry.status} />
              {entry.actor && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-admin-faint">
                  {entry.actor.type}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap text-[10px] tabular-nums text-admin-faint">
              {formatDate(entry.timestamp)}
            </span>
          </div>
          {entry.note && (
            <p className="mt-1 text-xs text-admin-text">{entry.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
