import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

/** Maps pathname segments to human-readable labels */
const SEGMENT_LABELS: Record<string, string> = {
  orders: "Orders",
  refunds: "Refunds",
  products: "Products",
  users: "Users",
  wallets: "Wallets",
  withdrawals: "Withdrawals",
  settlements: "Settlements",
  "audit-logs": "Audit Logs",
  new: "Create",
  edit: "Edit",
  inventory: "Inventory",
};

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    path += `/${seg}`;

    const label = SEGMENT_LABELS[seg];
    if (label) {
      // If this is the last segment, no link
      const isLast = i === segments.length - 1;
      crumbs.push({ label, to: isLast ? undefined : path });
    } else {
      // It's a dynamic ID — show truncated
      crumbs.push({ label: `#${seg.slice(-8).toUpperCase()}` });
    }
  }

  return crumbs;
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-1.5 text-[11px]">
      <Link
        to="/"
        className="text-admin-faint transition-colors hover:text-admin-ink">
        <Home size={12} aria-label="Dashboard" />
      </Link>

      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={10} className="text-admin-faint" aria-hidden />
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="font-semibold text-admin-faint transition-colors hover:text-admin-ink">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-bold text-admin-ink">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
