import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="border border-[var(--color-border)] bg-admin-bg/20 p-5 transition-colors hover:bg-admin-bg/40">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
          {label}
        </p>
        {Icon && (
          <Icon
            size={16}
            className="shrink-0 text-admin-faint"
            strokeWidth={2}
            aria-hidden
          />
        )}
      </div>

      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span
            className={[
              "inline-flex items-center gap-1 text-xs font-semibold",
              trend.direction === "up"
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]",
            ].join(" ")}>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  trend.direction === "up"
                    ? "var(--color-success)"
                    : "var(--color-error)",
              }}
            />
            {trend.direction === "up" ? "+" : "-"}
            {trend.value}%
          </span>
        )}
        {hint && (
          <span className="text-xs text-admin-faint">{hint}</span>
        )}
      </div>
    </div>
  );
}
