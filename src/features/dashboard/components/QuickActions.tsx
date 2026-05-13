import { useNavigate } from "react-router-dom";
import {
  Plus,
  RotateCcw,
  Landmark,
  ArrowDownToLine,
} from "lucide-react";

const ACTIONS = [
  {
    label: "New Product",
    icon: Plus,
    to: "/products/new",
  },
  {
    label: "View Refunds",
    icon: RotateCcw,
    to: "/refunds",
  },
  {
    label: "View Wallets",
    icon: Landmark,
    to: "/wallets",
  },
  {
    label: "Withdrawals",
    icon: ArrowDownToLine,
    to: "/withdrawals",
  },
] as const;

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="border border-[var(--color-border)] bg-admin-surface">
      <div className="border-b border-[var(--color-border)] px-5 py-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-admin-muted">
          Quick Actions
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[var(--color-border)]">
        {ACTIONS.map(({ label, icon: Icon, to }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="flex items-center gap-3 bg-admin-surface px-4 py-4 text-left transition-colors hover:bg-admin-bg/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-border)] bg-admin-bg/30">
              <Icon size={14} className="text-admin-ink" strokeWidth={2.25} />
            </div>
            <span className="text-xs font-semibold text-admin-text">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
