import { useNavigate } from "react-router-dom";
import { Package, Clock } from "lucide-react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { formatCurrency, formatRelativeDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function RecentActivity() {
  const navigate = useNavigate();
  const { data, isLoading } = useOrders({ page: 1, limit: 5 });
  const orders = data?.orders ?? [];

  return (
    <div className="border border-[var(--color-border)] bg-admin-surface">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-admin-muted">
          Recent Orders
        </h3>
        <button
          type="button"
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint transition-colors hover:text-admin-ink"
          onClick={() => navigate("/orders")}>
          View All →
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Orders will appear here as they come in"
        />
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {orders.map((order) => {
            const customerName =
              order.user && typeof order.user === "object"
                ? order.user.name
                : "Guest";

            return (
              <button
                key={order._id}
                type="button"
                onClick={() => navigate(`/orders/${order._id}`)}
                className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-admin-bg/20">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-admin-ink truncate">
                      {customerName}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-admin-faint">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-admin-faint">
                    <Clock size={10} aria-hidden />
                    <span>{formatRelativeDate(order.createdAt)}</span>
                    <span className="text-admin-border">·</span>
                    <span className="font-mono">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-bold tabular-nums text-admin-ink">
                  {formatCurrency(order.totalAmount)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
