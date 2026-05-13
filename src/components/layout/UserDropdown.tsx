import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function UserDropdown() {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoggingOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2.5 transition-colors hover:opacity-80"
        aria-label="User menu"
        aria-expanded={isOpen}>
        {/* Avatar circle */}
        <div className="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] bg-admin-bg text-[11px] font-bold tracking-wider text-admin-ink">
          {initials}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-tight text-admin-ink">
            {user?.name ?? "Admin"}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-faint">
            {user?.role ?? "ADMIN"}
          </p>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 border border-[var(--color-border)] bg-admin-surface shadow-sm animate-fadeIn">
          {/* User Info */}
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="text-xs font-bold text-admin-ink">
              {user?.name ?? "Admin"}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-admin-faint">
              {user?.email ?? "—"}
            </p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-admin-text transition-colors hover:bg-admin-bg/30 hover:text-admin-ink">
              <UserIcon size={14} />
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-admin-text transition-colors hover:bg-admin-bg/30 hover:text-[var(--color-error)]">
              <LogOut size={14} />
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
