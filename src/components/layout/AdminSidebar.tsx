import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/config";

const nav = [{ to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard }];

export function AdminSidebar() {
  return (
    <aside
      className="flex w-sidebar shrink-0 flex-col border-r-2 border-admin-ink bg-admin-surface"
      aria-label="Main navigation"
    >
      <div className="border-b-2 border-admin-ink px-5 py-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-admin-muted">
          Console
        </span>
        <p className="mt-1 text-base font-bold tracking-tight text-admin-ink">Atomic Admin</p>
      </div>
      <div className="px-3 pt-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-faint">
          Menu
        </p>
        <nav className="flex flex-col border border-admin-border bg-admin-bg">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 border-b border-admin-border px-3 py-3 text-sm font-semibold transition-colors last:border-b-0",
                  isActive
                    ? "bg-admin-ink text-admin-surface"
                    : "text-admin-text hover:bg-admin-surface hover:text-admin-ink",
                ].join(" ")
              }
            >
              <Icon className="size-4 shrink-0 stroke-[2]" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
