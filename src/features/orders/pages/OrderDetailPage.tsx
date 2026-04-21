import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  useOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from "../hooks/useOrders";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTimeline } from "../components/OrderTimeline";
import { UpdateStatusModal } from "../components/UpdateStatusModal";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id ?? "");
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading order…
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className='p-4 md:p-8'>
        <Link
          to={ROUTES.ORDERS}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <div className='mt-6 border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
          <p className='text-sm font-semibold text-[var(--color-error)]'>
            Order not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const customerName =
    order.user && typeof order.user === "object" ? order.user.name : "Guest";
  const customerEmail =
    order.user && typeof order.user === "object" ? order.user.email : "—";

  const canUpdateStatus = !["DELIVERED", "CANCELLED", "FAILED"].includes(
    order.status
  );
  const canCancel = !["DELIVERED", "CANCELLED", "FAILED"].includes(
    order.status
  );

  return (
    <>
      <Helmet>
        <title>Order #{id?.slice(-8).toUpperCase()} — Atomic Admin</title>
      </Helmet>

      <div className='p-4 md:p-8'>
        {/* Back link */}
        <Link
          to={ROUTES.ORDERS}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Orders
        </Link>

        {/* Header */}
        <div className='mt-4 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-admin-ink md:text-2xl'>
              Order #{id?.slice(-8).toUpperCase()}
            </h1>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <OrderStatusBadge status={order.status} />
              <span className='text-xs text-admin-faint'>
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-2'>
            {canUpdateStatus && (
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => setShowStatusModal(true)}>
                <RefreshCw size={14} />
                Update Status
              </button>
            )}
            {canCancel && (
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => setShowCancelConfirm(true)}>
                <XCircle size={14} />
                <span className='hidden sm:inline'>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className='mt-6 grid gap-6 lg:grid-cols-3'>
          {/* Left column: Items */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Order Items */}
            <section className='border border-[var(--color-border)] bg-admin-surface'>
              <div className='border-b border-[var(--color-border)] px-4 py-3'>
                <h2 className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Order Items
                </h2>
              </div>
              <div className='divide-y divide-[var(--color-border)]'>
                {(order.items || []).map((item, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between px-4 py-3'>
                    <div>
                      <p className='text-sm font-semibold text-admin-ink'>
                        {item.productName}
                      </p>
                      <p className='text-xs text-admin-faint'>
                        {formatCurrency(item.pricePerUnit)} × {item.quantity}
                      </p>
                    </div>
                    <p className='text-sm font-bold tabular-nums text-admin-ink'>
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className='border-t border-[var(--color-border)] px-4 py-3 space-y-1'>
                <div className='flex justify-between text-xs text-admin-muted'>
                  <span>Subtotal</span>
                  <span className='tabular-nums'>
                    {formatCurrency(order.totalAmount - order.deliveryFee)}
                  </span>
                </div>
                <div className='flex justify-between text-xs text-admin-muted'>
                  <span>Delivery</span>
                  <span className='tabular-nums'>
                    {formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <div className='flex justify-between text-sm font-bold text-admin-ink pt-1 border-t border-[var(--color-border)]'>
                  <span>Total</span>
                  <span className='tabular-nums'>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Status History
              </h2>
              <OrderTimeline
                history={order.statusHistory}
                currentStatus={order.status}
              />
            </section>
          </div>

          {/* Right column: Customer + Shipping */}
          <div className='space-y-6'>
            {/* Customer */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Customer
              </h2>
              <p className='text-sm font-semibold text-admin-ink'>
                {customerName}
              </p>
              <p className='mt-0.5 text-xs text-admin-faint'>{customerEmail}</p>
              <p className='mt-1 text-[10px] font-bold uppercase tracking-wider text-admin-muted'>
                {order.checkoutType}
              </p>
            </section>

            {/* Shipping */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Shipping Address
              </h2>
              <p className='text-sm text-admin-text'>
                {order.shippingAddress.street}
              </p>
              <p className='text-sm text-admin-text'>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              {order.shippingAddress.zip && (
                <p className='text-sm text-admin-text'>
                  {order.shippingAddress.zip}
                </p>
              )}
              <p className='text-sm text-admin-text'>
                {order.shippingAddress.country}
              </p>
            </section>

            {/* Order Info */}
            <section className='border border-[var(--color-border)] bg-admin-surface p-4'>
              <h2 className='mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Order Info
              </h2>
              <div className='space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-admin-faint'>Created</span>
                  <span className='text-admin-text'>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-admin-faint'>Updated</span>
                  <span className='text-admin-text'>
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <UpdateStatusModal
          currentStatus={order.status}
          isLoading={updateStatus.isPending}
          onClose={() => setShowStatusModal(false)}
          onConfirm={(status, note) => {
            updateStatus.mutate(
              { id: order._id, status, note },
              {
                onSuccess: () => {
                  toast.success(`Order marked as ${status}`);
                  setShowStatusModal(false);
                },
                onError: () => {
                  toast.error("Failed to update order status");
                },
              }
            );
          }}
        />
      )}

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <>
          <div
            className='fixed inset-0 z-50 bg-black/40'
            onClick={() => setShowCancelConfirm(false)}
            aria-hidden='true'
          />
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-sm border border-[var(--color-border)] bg-admin-surface p-6 animate-fadeIn'>
              <h3 className='text-sm font-bold uppercase tracking-[0.12em] text-admin-ink'>
                Cancel Order
              </h3>
              <p className='mt-2 text-sm text-admin-text'>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className='mt-6 flex flex-col sm:flex-row  gap-3 justify-end'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelOrder.isPending}>
                  Keep Order
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  disabled={cancelOrder.isPending}
                  onClick={() => {
                    cancelOrder.mutate(order._id, {
                      onSuccess: () => {
                        toast.success("Order cancelled");
                        setShowCancelConfirm(false);
                      },
                      onError: () => {
                        toast.error("Failed to cancel order");
                      },
                    });
                  }}>
                  {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
