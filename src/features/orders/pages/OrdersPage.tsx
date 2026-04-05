import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { OrdersTable } from "../components/OrdersTable";
import type { OrderStatus } from "../types";

const STATUSES: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useOrders({
    page,
    limit: 15,
    status: status || undefined,
    search: search || undefined,
  });

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <Helmet>
        <title>Orders — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        {/* Header */}
        <div className='border-b border-[var(--color-border)] pb-6'>
          <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
            Orders
          </h1>
          <p className='mt-1 text-sm text-admin-muted'>
            Manage and track all customer orders.
          </p>
        </div>

        {/* Filters */}
        <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          {/* Search */}
          <div className='relative flex-1 sm:max-w-xs'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-admin-faint'
            />
            <input
              type='text'
              placeholder='Search orders...'
              className='input-field pl-9'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Status filter */}
          <div className='flex flex-wrap gap-1'>
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type='button'
                onClick={() => {
                  setStatus(s.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  status === s.value
                    ? "bg-admin-bg text-admin-ink"
                    : "bg-[var(--color-bg-muted)] text-admin-muted hover:text-admin-ink"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className='mt-6'>
          {isLoading ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
                Loading orders…
              </p>
            </div>
          ) : isError ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='text-sm font-semibold text-[var(--color-error)]'>
                Failed to load orders. Please try again.
              </p>
            </div>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4'>
            <p className='text-xs text-admin-faint'>
              Page {page} of {totalPages}
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
                <span className='hidden sm:inline'>Prev</span>
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}>
                <span className='hidden sm:inline'>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
