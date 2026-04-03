import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ROUTES } from "@/config";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "@/store";
import { canAccessAdmin } from "@/utils/role";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const { user } = useAuth();

  if (user && canAccessAdmin(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  if (user && !canAccessAdmin(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg)] px-6">
        <div className="max-w-md border-2 border-[var(--color-text-heading)] bg-white p-8 text-center">
          <p className="text-sm font-medium leading-relaxed text-[var(--color-text)]">
            This account does not have admin access. Sign in with an admin or support user.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={() => useAuthStore.getState().clearAuth()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign in — Atomic Admin</title>
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="relative w-full max-w-4xl bg-white md:p-12">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Atomic Admin
            </p>
            <h1 className="mb-2 text-4xl font-black uppercase tracking-tight text-[var(--color-text-heading)]">
              Welcome back
            </h1>
            <p className="font-medium text-[var(--color-text-muted)]">
              Sign in with an authorized admin or support account.
            </p>
          </div>

          <LoginForm />

          <div className="mt-12 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-text-muted)]">
            Authorized access only.
          </div>
        </div>
      </div>
    </>
  );
}
