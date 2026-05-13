import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { UserDropdown } from "./UserDropdown";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── Header ─────────────────────────────── */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-admin-surface px-4 md:px-6">
          {/* Left: Mobile hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="shrink-0 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu">
              <Menu size={22} />
            </button>
            <Breadcrumbs />
          </div>

          {/* Right: User dropdown */}
          <UserDropdown />
        </header>

        {/* ── Content ────────────────────────────── */}
        <main className="min-h-0 flex-1 overflow-auto bg-admin-surface">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
