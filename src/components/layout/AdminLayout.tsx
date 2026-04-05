import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminLayout() {
  const { logout, isLoggingOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen'>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className='admin-sidebar-backdrop'
          onClick={() => setSidebarOpen(false)}
          aria-hidden='true'
        />
      )}

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-admin-surface px-4 md:px-6'>
          {/* Mobile hamburger */}
          <button
            type='button'
            className='mr-3 md:hidden'
            onClick={() => setSidebarOpen(true)}
            aria-label='Open menu'>
            <Menu size={22} />
          </button>

          <div className='min-w-0'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-faint'>
              Signed in
            </p>
          </div>
          <button
            type='button'
            onClick={() => logout()}
            disabled={isLoggingOut}
            className='btn btn-secondary'>
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </header>
        <main className='min-h-0 flex-1 overflow-auto bg-admin-surface'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
