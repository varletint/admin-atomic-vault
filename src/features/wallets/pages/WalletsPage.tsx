import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useStoreWallet, useLedger } from "../hooks/useWallets";
import { AdjustDialog } from "../components/AdjustDialog";

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(kobo / 100);
}

export function WalletsPage() {
  const navigate = useNavigate();
  const { data: wallet, isLoading, isError, refetch } = useStoreWallet();
  const [adjustOpen, setAdjustOpen] = useState(false);

  const { data: ledgerData } = useLedger(wallet?._id ?? "", {
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading wallet…
        </p>
      </div>
    );
  }

  if (isError || !wallet) {
    return (
      <div className='p-8'>
        <p className='text-sm font-semibold text-[var(--color-error)]'>
          Failed to load wallet.
        </p>
      </div>
    );
  }

  const entries = ledgerData?.entries ?? [];

  return (
    <>
      <Helmet>
        <title>Wallets — Atomic Admin</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <div className='flex items-start justify-between border-b border-[var(--color-border)] pb-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Wallets
            </h1>
            <p className='mt-1 text-sm text-admin-muted'>
              Store wallet balance and recent ledger activity.
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
              onClick={() => setAdjustOpen(true)}>
              <Plus size={14} />
              Adjust
            </button>
          </div>
        </div>

        <div className='mt-6 grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4'>
          <div className='bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Currency
            </p>
            <p className='mt-2 text-lg font-bold text-admin-ink'>
              {wallet.currency}
            </p>
          </div>
          <div className='bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Available
            </p>
            <p className='mt-2 text-lg font-bold tabular-nums text-admin-ink'>
              {formatKobo(wallet.available)}
            </p>
          </div>
          <div className='bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Pending
            </p>
            <p className='mt-2 text-lg font-bold tabular-nums text-admin-ink'>
              {formatKobo(wallet.pending)}
            </p>
          </div>
          <div className='bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Status
            </p>
            <p
              className={`mt-2 text-lg font-bold ${
                wallet.status === "ACTIVE"
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-error)]"
              }`}>
              {wallet.status}
            </p>
          </div>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Recent Ledger Entries
            </h2>
            <button
              type='button'
              className='text-xs font-semibold text-admin-muted transition-colors hover:text-admin-ink'
              onClick={() => navigate(`/wallets/${wallet._id}`)}>
              View all →
            </button>
          </div>

          <div className='mt-3 overflow-x-auto border border-[var(--color-border)]'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Type
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Direction
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Amount
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Narration
                  </th>
                  <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-4 py-8 text-center text-sm text-admin-muted'>
                      No ledger entries yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
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
                      <td className='px-4 py-3 text-xs text-admin-text'>
                        {entry.narration ?? "—"}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdjustDialog
        walletId={wallet._id}
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
      />
    </>
  );
}
