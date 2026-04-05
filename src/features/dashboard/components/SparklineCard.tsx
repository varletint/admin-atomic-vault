import { Sparkline } from "./Sparkline";

export interface SparklineCardProps {
  /** Card title, e.g. "Total Revenue" */
  title: string;
  /** Large display value, e.g. "$12,340" */
  value: string;
  /** Percentage change, e.g. "6.25" */
  change: string;
  /** Direction of the change, drives color */
  trend: "up" | "down";
  /** Sparkline data points */
  data: number[];
  /** Optional label on the sparkline endpoint, e.g. "+$2,956" */
  endLabel?: string;
}

export function SparklineCard({
  title,
  value,
  change,
  trend,
  data,
  endLabel,
}: SparklineCardProps) {
  const isUp = trend === "up";
  const trendColor = isUp ? "var(--color-success)" : "var(--color-error)";
  const lineColor = isUp ? "var(--color-accent)" : "var(--color-error)";

  return (
    <div className='flex flex-col border border-[var(--color-border)] bg-admin-bg/20 overflow-hidden'>
      {/* ── Header ────────────────────────────── */}
      <div className='p-5 pb-3'>
        <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
          {title}
        </p>
        <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink'>
          {value}
        </p>
        <p className='mt-1 flex items-center gap-1.5 text-xs font-semibold'>
          <span
            className='inline-block h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: trendColor }}
          />
          <span style={{ color: trendColor }}>
            {isUp ? "+" : "-"}
            {change}%
          </span>
        </p>
      </div>

      {/* ── Sparkline ─────────────────────────── */}
      <div className='mt-auto'>
        <Sparkline
          data={data}
          color={lineColor}
          endLabel={endLabel}
          height={64}
        />
      </div>
    </div>
  );
}
