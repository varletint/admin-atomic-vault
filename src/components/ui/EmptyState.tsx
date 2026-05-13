import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-[var(--color-border)] bg-admin-surface px-6 py-16 text-center">
      {Icon && (
        <Icon
          size={32}
          className="mb-4 text-admin-faint"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      <p className="text-sm font-semibold text-admin-muted">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-admin-faint">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
