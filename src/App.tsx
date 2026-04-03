import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ROUTES } from "@/config";
import { AuthGuard } from "@/guards/AuthGuard";
import { AdminGuard } from "@/guards/AdminGuard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "./App.css";

function BootGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted">
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="app-shell">
      <Helmet defaultTitle="Atomic Admin" titleTemplate="%s — Atomic Admin" />
      <BootGate>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            element={
              // <AuthGuard>
                // <AdminGuard>
                  <AdminLayout />
                // </AdminGuard>
              // </AuthGuard>
            }
          >
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BootGate>
    </div>
  );
}
