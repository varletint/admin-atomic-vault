import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ROUTES } from "@/config";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { OrderDetailPage } from "@/features/orders/pages/OrderDetailPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { CreateProductPage } from "@/features/products/pages/CreateProductPage";
import { EditProductPage } from "@/features/products/pages/EditProductPage";
import { InventoryPage } from "@/features/inventory/pages/InventoryPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { UserDetailPage } from "@/features/users/pages/UserDetailPage";
import { WalletsPage } from "@/features/wallets/pages/WalletsPage";
import { WalletDetailPage } from "@/features/wallets/pages/WalletDetailPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "./App.css";
import { AuthGuard } from "./guards/AuthGuard";
import { AdminGuard } from "./guards/AdminGuard";

function BootGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-admin-bg'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className='app-shell'>
      <Helmet defaultTitle='Atomic Admin' titleTemplate='%s — Atomic Admin' />
      <BootGate>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            element={
              <AuthGuard>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </AuthGuard>
            }>
            <Route index element={<DashboardPage />} />
            <Route path='orders' element={<OrdersPage />} />
            <Route path='orders/:id' element={<OrderDetailPage />} />
            <Route path='products' element={<ProductsPage />} />
            <Route path='products/new' element={<CreateProductPage />} />
            <Route path='products/:id' element={<ProductDetailPage />} />
            <Route path='products/:id/edit' element={<EditProductPage />} />
            <Route
              path='products/:productId/inventory'
              element={<InventoryPage />}
            />
            <Route path='users' element={<UsersPage />} />
            <Route path='users/:id' element={<UserDetailPage />} />
            <Route path='wallets' element={<WalletsPage />} />
            <Route path='wallets/:id' element={<WalletDetailPage />} />
          </Route>
          <Route path='*' element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BootGate>
    </div>
  );
}
