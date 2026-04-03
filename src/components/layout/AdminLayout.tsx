import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminLayout() {
  const { logout, isLoggingOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b-2 border-admin-ink bg-admin-surface px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-faint">
              Signed in
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="border-2 border-admin-ink bg-admin-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-admin-ink transition-colors hover:bg-admin-ink hover:text-admin-surface disabled:pointer-events-none disabled:opacity-40"
          >
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-auto bg-admin-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
