import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRefunds } from "../hooks/useRefunds";
import { RefundsTable } from "../components/RefundsTable";
import type { RefundStatus, RefundFilters } from "../types";

const STATUS_TABS: { label: string; value: RefundStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Awaiting Review", value: "AWAITING_REVIEW" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Retrying", value: "RETRYING" },
  { label: "Failed", value: "FAILED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

export function RefundsPage() {
  const [filters, setFilters] = useState<RefundFilters>({
    page: 1,
    limit: 20,
    status: "",
  });

  const { data, isLoading } = useRefunds(filters);

  return (
    <>
      <Helmet>
        <title>Refunds</title>
      </Helmet>

      <div className="p-4 md:p-8">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-admin-ink md:text-2xl">
              Refund Requests
            </h1>
            <p className="mt-1 text-xs text-admin-faint">
              {data?.total ?? 0} total refunds
            </p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="mt-4 flex flex-wrap gap-1 border-b border-[var(--color-border)] pb-3">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  status: tab.value,
                }))
              }
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                filters.status === tab.value
                  ? "bg-admin-ink text-admin-surface"
                  : "text-admin-muted hover:text-admin-ink"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6">
          <RefundsTable
            refunds={data?.refunds ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-admin-faint">
              Page {data.page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={data.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page ?? 1) - 1,
                  }))
                }>
                Previous
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={data.page >= data.totalPages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page ?? 1) + 1,
                  }))
                }>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
