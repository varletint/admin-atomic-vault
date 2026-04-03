import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config";
import { useAuthStore } from "@/store";

/**
 * Requires a session user. Uses `user` (not only `isAuthenticated`) so Zustand
 * rehydration from persist stays consistent with partialize.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
