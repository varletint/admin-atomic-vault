import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config";
import { useAuthStore } from "@/store";
import { canAccessAdmin } from "@/utils/role";

/** Requires an authenticated user with admin/support role. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user || !canAccessAdmin(user.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
