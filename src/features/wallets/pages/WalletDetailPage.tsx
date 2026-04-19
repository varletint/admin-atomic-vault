import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useLedger } from "../hooks/useWallets";
import { ReverseDialog } from "../components/ReverseDialog";

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(kobo / 100);
}

export function WalletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [reverseTarget, setReverseTarget] = useState<string | null>(null);

  const { data, isLoading, isError } = useLedger(id ?? "", {
    page,
    limit: 25,
  });

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading ledger…
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='p-8'>
        <p className='text-sm font-semibold text-[var(--color-error)]'>
          Failed to load wallet ledger.
        </p>
      </div>
    );
  }

  const { wallet, entries, total, totalPages } = data;

  return (
    <>
      <Helmet>
        <title>Wallet Ledger — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <button
          type='button'
          onClick={() => navigate("/wallets")}
          className='mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-admin-muted transition-colors hover:text-admin-ink'>
          <ArrowLeft size={14} />
          Back to wallets
        </button>

        <div className='border-b border-[var(--color-border)] pb-6'>
          <h3 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
            Wallet Ledger
          </h3>
          <p className='mt-1 text-sm text-admin-muted'>
            {wallet.currency} · {formatKobo(wallet.available)} available ·{" "}
            {total} entries
          </p>
        </div>

        <div className='mt-6 overflow-x-auto border border-[var(--color-border)]'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Type
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Dir
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Amount
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Narration
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Balance After
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Date
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry._id}
                  className='border-b border-[var(--color-border)] bg-admin-surface last:border-b-0'>
                  <td className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-admin-muted'>
                    {entry.entryType}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                        entry.direction === "CREDIT"
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-error)]"
                      }`}>
                      {entry.direction}
                    </span>
                  </td>
                  <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                    {formatKobo(entry.amount)}
                  </td>
                  <td className='max-w-[200px] truncate px-4 py-3 text-xs text-admin-text'>
                    {entry.narration ?? "—"}
                  </td>
                  <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                    {formatKobo(entry.balanceAfterAvailable)}
                  </td>
                  <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className='px-4 py-3'>
                    {entry.entryType !== "REVERSAL" && (
                      <button
                        type='button'
                        title='Reverse this transaction'
                        className='text-admin-muted transition-colors hover:text-[var(--color-error)]'
                        onClick={() => setReverseTarget(entry.transactionId)}>
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {reverseTarget && (
        <ReverseDialog
          transactionId={reverseTarget}
          open={true}
          onClose={() => setReverseTarget(null)}
        />
      )}
    </>
  );
}
