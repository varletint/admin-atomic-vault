import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useWithdrawal } from "../hooks/useWithdrawals";
import { WithdrawalStatusBadge } from "../components/WithdrawalStatusBadge";
import { WithdrawalTimeline } from "../components/WithdrawalTimeline";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import { TERMINAL_STATUSES } from "../types";
import type { TransactionStatus } from "../types";

export function WithdrawalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: withdrawal,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWithdrawal(id ?? "");

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading withdrawal…
        </p>
      </div>
    );
  }

  if (isError || !withdrawal) {
    return (
      <div className='p-8'>
        <p className='text-sm font-semibold text-[var(--color-error)]'>
          Withdrawal not found.
        </p>
        <button
          type='button'
          className='btn btn-secondary mt-4'
          onClick={() => navigate("/withdrawals")}>
          <ArrowLeft size={14} />
          Back to Withdrawals
        </button>
      </div>
    );
  }

  const isPolling = !TERMINAL_STATUSES.includes(
    withdrawal.status as TransactionStatus
  );

  return (
    <>
      <Helmet>
        <title>Withdrawal {truncateId(withdrawal._id)} — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        {/* Header */}
        <div className='flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <button
              type='button'
              className='mb-3 flex items-center gap-1.5 text-xs font-semibold text-admin-muted transition-colors hover:text-admin-ink'
              onClick={() => navigate("/withdrawals")}>
              <ArrowLeft size={12} />
              Withdrawals
            </button>
            <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Withdrawal {truncateId(withdrawal._id)}
            </h1>
            <div className='mt-2 flex items-center gap-3'>
              <WithdrawalStatusBadge
                status={withdrawal.status as TransactionStatus}
              />
              {isPolling && (
                <span className='flex items-center gap-1 text-[10px] font-semibold text-admin-faint'>
                  <RefreshCw size={10} className='animate-spin' />
                  Live
                </span>
              )}
            </div>
          </div>
          <button
            type='button'
            className='btn btn-secondary'
            disabled={isFetching}
            onClick={() => void refetch()}>
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className='mt-6 grid gap-8 lg:grid-cols-3'>
          {/* Left: Summary Cards */}
          <div className='lg:col-span-2'>
            <div className='grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2'>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Amount
                </p>
                <p className='mt-2 text-xl font-bold tabular-nums text-admin-ink'>
                  {formatCurrency(withdrawal.amount)}
                </p>
              </div>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Currency
                </p>
                <p className='mt-2 text-lg font-bold text-admin-ink'>
                  {withdrawal.currency}
                </p>
              </div>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Account Name
                </p>
                <p className='mt-2 text-sm font-semibold text-admin-ink'>
                  {withdrawal.metadata.accountName}
                </p>
              </div>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Account Number
                </p>
                <p className='mt-2 text-sm font-semibold tabular-nums text-admin-ink'>
                  {withdrawal.metadata.accountNumber}
                </p>
              </div>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Bank Code
                </p>
                <p className='mt-2 text-sm font-semibold tabular-nums text-admin-ink'>
                  {withdrawal.metadata.bankCode}
                </p>
              </div>
              <div className='bg-admin-surface p-5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Provider Reference
                </p>
                <p className='mt-2 text-sm font-semibold text-admin-ink'>
                  {withdrawal.providerRef ?? "—"}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className='mt-6 border border-[var(--color-border)] bg-admin-surface'>
              <div className='border-b border-[var(--color-border)] px-5 py-3'>
                <h4 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Details
                </h4>
              </div>
              <div className='space-y-3 p-5'>
                <div className='flex items-baseline justify-between'>
                  <span className='text-xs font-semibold text-admin-muted'>
                    Transaction ID
                  </span>
                  <span className='font-mono text-xs text-admin-text'>
                    {withdrawal._id}
                  </span>
                </div>
                <div className='flex items-baseline justify-between'>
                  <span className='text-xs font-semibold text-admin-muted'>
                    Idempotency Key
                  </span>
                  <span className='font-mono text-xs text-admin-text'>
                    {withdrawal.idempotencyKey}
                  </span>
                </div>
                <div className='flex items-baseline justify-between'>
                  <span className='text-xs font-semibold text-admin-muted'>
                    Created
                  </span>
                  <span className='text-xs tabular-nums text-admin-text'>
                    {formatDate(withdrawal.createdAt)}
                  </span>
                </div>
                <div className='flex items-baseline justify-between'>
                  <span className='text-xs font-semibold text-admin-muted'>
                    Last Updated
                  </span>
                  <span className='text-xs tabular-nums text-admin-text'>
                    {formatDate(withdrawal.updatedAt)}
                  </span>
                </div>
                {withdrawal.paidAt && (
                  <div className='flex items-baseline justify-between'>
                    <span className='text-xs font-semibold text-admin-muted'>
                      Paid At
                    </span>
                    <span className='text-xs tabular-nums text-admin-text'>
                      {formatDate(withdrawal.paidAt)}
                    </span>
                  </div>
                )}
                {withdrawal.metadata.reason && (
                  <div className='flex items-baseline justify-between'>
                    <span className='text-xs font-semibold text-admin-muted'>
                      Reason
                    </span>
                    <span className='text-xs text-admin-text'>
                      {withdrawal.metadata.reason}
                    </span>
                  </div>
                )}
                {withdrawal.failureReason && (
                  <div className='border-t border-[var(--color-border)] pt-3'>
                    <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-error)]'>
                      Failure Reason
                    </p>
                    <p className='mt-1 text-xs text-[var(--color-error)]'>
                      {withdrawal.failureReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <div className='border border-[var(--color-border)] bg-admin-surface'>
              <div className='border-b border-[var(--color-border)] px-5 py-3'>
                <h4 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
                  Status Timeline
                </h4>
              </div>
              <div className='p-5'>
                <WithdrawalTimeline
                  status={withdrawal.status as TransactionStatus}
                  createdAt={withdrawal.createdAt}
                  updatedAt={withdrawal.updatedAt}
                  paidAt={withdrawal.paidAt}
                  failureReason={withdrawal.failureReason}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
