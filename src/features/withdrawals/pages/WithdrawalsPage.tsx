import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useWithdrawals } from "../hooks/useWithdrawals";
import { WithdrawalStatusBadge } from "../components/WithdrawalStatusBadge";
import { WithdrawalInitiateDialog } from "../components/WithdrawalInitiateDialog";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import type { TransactionStatus, WithdrawalListParams } from "../types";

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Reserved", value: "RESERVED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Failed", value: "FAILED" },
  { label: "Unknown", value: "UNKNOWN" },
];

export function WithdrawalsPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [params, setParams] = useState<WithdrawalListParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isError, refetch } = useWithdrawals(params);

  const withdrawals = data?.withdrawals ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  function handleStatusFilter(status: string) {
    setParams((prev) => ({
      ...prev,
      status: status || undefined,
      page: 1,
    }));
  }

  function handlePageChange(newPage: number) {
    setParams((prev) => ({ ...prev, page: newPage }));
  }

  return (
    <>
      <Helmet>
        <title>Withdrawals — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        {/* Header */}
        <div className='flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Withdrawals
            </h1>
            <p className='mt-1 text-sm text-admin-muted'>
              Manage store wallet withdrawals to bank accounts.
            </p>
          </div>
          <div className='flex gap-2'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => void refetch()}>
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => setDialogOpen(true)}>
              <Plus size={14} />
              New Withdrawal
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className='mt-6 flex flex-wrap gap-1'>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type='button'
              onClick={() => handleStatusFilter(f.value)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                (params.status ?? "") === f.value
                  ? "bg-admin-ink text-admin-surface"
                  : "border border-[var(--color-border)] text-admin-muted hover:text-admin-ink"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className='flex min-h-[30vh] items-center justify-center'>
            <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
              Loading withdrawals…
            </p>
          </div>
        )}

        {isError && (
          <div className='mt-8 p-4'>
            <p className='text-sm font-semibold text-[var(--color-error)]'>
              Failed to load withdrawals.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <div className='mt-4 overflow-x-auto border border-[var(--color-border)]'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Amount
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Bank / Account
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-4 py-8 text-center text-sm text-admin-muted'>
                      No withdrawals found.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr
                      key={w._id}
                      onClick={() => navigate(`/withdrawals/${w._id}`)}
                      className='cursor-pointer border-b border-[var(--color-border)] bg-admin-surface transition-colors last:border-b-0 hover:bg-admin-bg/20'>
                      <td className='px-4 py-3 font-mono text-xs font-semibold text-admin-muted'>
                        {truncateId(w._id)}
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(w.amount)}
                      </td>
                      <td className='px-4 py-3'>
                        <p className='text-xs font-semibold text-admin-ink'>
                          {w.metadata.accountName}
                        </p>
                        <p className='text-[10px] tabular-nums text-admin-faint'>
                          {w.metadata.accountNumber}
                        </p>
                      </td>
                      <td className='px-4 py-3'>
                        <WithdrawalStatusBadge
                          status={w.status as TransactionStatus}
                        />
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {formatDate(w.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className='mt-4 flex items-center justify-between'>
            <p className='text-xs tabular-nums text-admin-faint'>
              Page {currentPage} of {totalPages}
              {data?.total != null && (
                <span className='ml-2'>({data.total} total)</span>
              )}
            </p>
            <div className='flex gap-1'>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <WithdrawalInitiateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={(txId) => {
          setDialogOpen(false);
          navigate(`/withdrawals/${txId}`);
        }}
      />
    </>
  );
}
