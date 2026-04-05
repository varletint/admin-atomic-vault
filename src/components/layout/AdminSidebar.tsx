import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, X } from "lucide-react";
import { ROUTES } from "@/config";

const nav = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.PRODUCTS, label: "Products", icon: ShoppingBag },
  { to: ROUTES.ORDERS, label: "Orders", icon: Package },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <aside
      className={`admin-sidebar ${open ? "admin-sidebar--open" : ""}`}
      aria-label='Main navigation'>
      <div className='flex items-center justify-between border-b border-[var(--color-border)] px-5 py-5'>
        <div>
          <span className='text-[11px] font-bold uppercase tracking-[0.18em] text-admin-muted'>
            Console
          </span>
          <p className='mt-1 text-base font-bold tracking-tight text-admin-ink'>
            Atomic Admin
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          type='button'
          className='md:hidden'
          onClick={onClose}
          aria-label='Close menu'>
          <X size={20} />
        </button>
      </div>

      <div className='px-3 pt-4'>
        <p className='px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-faint'>
          Menu
        </p>
        <nav className='flex flex-col'>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-3 text-sm font-semibold transition-colors last:border-b-0",
                  isActive
                    ? "bg-admin-bg/20 text-admin-ink"
                    : "text-admin-text hover:bg-admin-bg/20 hover:text-admin-ink",
                ].join(" ")
              }>
              <Icon className='size-4 shrink-0 stroke-2' aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
