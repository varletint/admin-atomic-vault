import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Landmark,
  ArrowDownToLine,
  RotateCcw,
  Banknote,
  FileText,
  X,
} from "lucide-react";
import { ROUTES } from "@/config";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Commerce",
    items: [
      { to: ROUTES.PRODUCTS, label: "Products", icon: ShoppingBag },
      { to: ROUTES.ORDERS, label: "Orders", icon: Package },
      { to: ROUTES.REFUNDS, label: "Refunds", icon: RotateCcw },
    ],
  },
  {
    title: "Finance",
    items: [
      { to: ROUTES.WALLETS, label: "Wallets", icon: Landmark },
      { to: ROUTES.WITHDRAWALS, label: "Withdrawals", icon: ArrowDownToLine },
      { to: ROUTES.SETTLEMENTS, label: "Settlements", icon: Banknote },
    ],
  },
  {
    title: "People",
    items: [{ to: ROUTES.USERS, label: "Users", icon: Users }],
  },
  {
    title: "System",
    items: [{ to: ROUTES.AUDIT_LOGS, label: "Audit Logs", icon: FileText }],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const location = useLocation();

  /** Check if any item in the group is currently active */
  function isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => {
      if (item.to === "/") return location.pathname === "/";
      return location.pathname.startsWith(item.to);
    });
  }

  return (
    <aside
      className={`admin-sidebar ${open ? "admin-sidebar--open" : ""}`}
      aria-label="Main navigation">
      {/* ── Brand ──────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-admin-muted">
            Console
          </span>
          <p className="mt-1 text-base font-bold tracking-tight text-admin-ink">
            Atomic Admin
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          type="button"
          className="md:hidden"
          onClick={onClose}
          aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      {/* ── Navigation Groups ─────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
        {NAV_GROUPS.map((group) => {
          const active = isGroupActive(group);

          return (
            <div key={group.title} className="mb-5 last:mb-0">
              {/* Section label */}
              <p
                className={[
                  "px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]",
                  active ? "text-admin-ink" : "text-admin-faint",
                ].join(" ")}>
                {group.title}
              </p>

              {/* Items */}
              <nav className="flex flex-col gap-0.5">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === ROUTES.DASHBOARD}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-admin-ink text-white"
                          : "text-admin-text hover:bg-admin-bg/30 hover:text-admin-ink",
                      ].join(" ")
                    }>
                    <Icon className="size-4 shrink-0 stroke-[2.25]" aria-hidden />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      {/* ── Footer ─────────────────────────────── */}
      <div className="border-t border-[var(--color-border)] px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-admin-faint">
          v1.0.0 · Admin
        </p>
      </div>
    </aside>
  );
}
