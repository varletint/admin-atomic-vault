import { Link } from "react-router-dom";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "../types";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
interface OrdersTableProps {
  orders: Order[];
}

function getCustomerName(user: Order["user"]): string {
  if (!user) return "Guest";
  if (typeof user === "string") return user;
  return user.name || user.email;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
        <p className='text-sm font-semibold text-admin-muted'>
          No orders found
        </p>
        <p className='mt-1 text-xs text-admin-faint'>
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className='hidden md:block border border-[var(--color-border)] bg-admin-surface'>
        <table className='w-full text-left'>
          <thead>
            <tr className='border-b border-[var(--color-border)]'>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Order
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Customer
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Items
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Total
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Status
              </th>
              <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className='border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-bg-subtle)]'>
                <td className='px-4 py-3'>
                  <Link
                    to={`/orders/${order._id}`}
                    className='text-sm font-bold text-admin-ink no-underline hover:underline'>
                    {truncateId(order._id)}
                  </Link>
                </td>
                <td className='px-4 py-3 text-sm text-admin-text'>
                  {getCustomerName(order.user)}
                </td>
                <td className='px-4 py-3 text-sm text-admin-text tabular-nums'>
                  {order.items?.length || 0} item
                  {(order.items?.length || 0) !== 1 ? "s" : ""}
                </td>
                <td className='px-4 py-3 text-sm font-semibold text-admin-ink tabular-nums'>
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className='px-4 py-3'>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className='px-4 py-3 text-xs text-admin-faint'>
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className='flex flex-col gap-3 md:hidden'>
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className='block border border-[var(--color-border)] bg-admin-surface p-4 no-underline transition-colors hover:bg-[var(--color-bg-subtle)]'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-bold text-admin-ink'>
                {truncateId(order._id)}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className='mt-2 flex items-center justify-between text-xs text-admin-muted'>
              <span>{getCustomerName(order.user)}</span>
              <span className='font-semibold text-admin-ink tabular-nums'>
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className='mt-1 flex items-center justify-between text-xs text-admin-faint'>
              <span>
                {order.items?.length || 0} item
                {(order.items?.length || 0) !== 1 ? "s" : ""}
              </span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
