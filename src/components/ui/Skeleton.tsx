interface SkeletonProps {
  className?: string;
}

/** Base animated placeholder block */
export function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  );
}

/** Card-shaped skeleton placeholder */
function Card({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton h-[180px] border border-[var(--color-border)] ${className}`}
      aria-hidden="true"
    />
  );
}

/** Renders N skeleton table rows */
function TableRows({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="border border-[var(--color-border)] bg-admin-surface divide-y divide-[var(--color-border)]">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-3 ${c === 0 ? "w-24" : "flex-1"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Renders a full-width loading banner (used for page-level loading) */
function Banner({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="border border-[var(--color-border)] bg-admin-surface p-12 text-center">
      <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted">
        {text}
      </p>
    </div>
  );
}

Skeleton.Card = Card;
Skeleton.TableRows = TableRows;
Skeleton.Banner = Banner;
