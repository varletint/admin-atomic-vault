import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { useLedger } from "../hooks/useWallets";
import { ReverseDialog } from "../components/ReverseDialog";
import type { LedgerEntry } from "../types";
import { formatCurrency } from "@/utils/format";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-[180px]'>
      <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
        {label}
      </p>
      <p className='mt-0.5 break-all font-mono text-xs text-admin-ink'>
        {value || "—"}
      </p>
    </div>
  );
}

function EntryDetailPanel({ entry }: { entry: LedgerEntry }) {
  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-4 border-t border-dashed border-[var(--color-border)] bg-admin-bg/30 px-6 py-4 md:grid-cols-3 lg:grid-cols-4'>
      <DetailField label='Transaction ID' value={entry.transactionId} />
      <DetailField label='Entry ID' value={entry._id} />
      <DetailField label='Bucket' value={entry.bucket} />
      <DetailField label='Direction' value={entry.direction} />
      <DetailField label='Entry Type' value={entry.entryType} />
      <DetailField label='Amount' value={formatCurrency(entry.amount)} />
      <DetailField
        label='Balance After (Available)'
        value={formatCurrency(entry.balanceAfterAvailable)}
      />
      <DetailField
        label='Balance After (Pending)'
        value={formatCurrency(entry.balanceAfterPending)}
      />
      <DetailField
        label='Actor'
        value={`${entry.actor.type}${
          entry.actor.id ? ` · ${entry.actor.id}` : ""
        }`}
      />
      <DetailField label='Source' value={entry.source} />
      <DetailField label='Trace ID' value={entry.traceId} />
      <DetailField label='Dedupe Key' value={entry.dedupeKey ?? "—"} />
      <DetailField label='Narration' value={entry.narration ?? "—"} />
      <DetailField
        label='Created'
        value={new Date(entry.createdAt).toLocaleString()}
      />
    </div>
  );
}

export function WalletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [reverseTarget, setReverseTarget] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            {wallet.currency} · {formatCurrency(wallet.available)} available ·{" "}
            {total} entries
          </p>
        </div>

        <div className='mt-6 overflow-x-auto border border-[var(--color-border)]'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                <th className='w-8 px-2 py-3' />
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
              {entries.map((entry) => {
                const isExpanded = expandedId === entry._id;
                return (
                  <>
                    <tr
                      key={entry._id}
                      className={`cursor-pointer border-b border-[var(--color-border)] bg-admin-surface transition-colors hover:bg-admin-bg/60 ${
                        isExpanded ? "bg-admin-bg/60" : ""
                      } last:border-b-0`}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : entry._id)
                      }>
                      <td className='px-2 py-3 text-admin-muted'>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </td>
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
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className='max-w-[200px] truncate px-4 py-3 text-xs text-admin-text'>
                        {entry.narration ?? "—"}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {formatCurrency(entry.balanceAfterAvailable)}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setReverseTarget(entry.transactionId);
                            }}>
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${entry._id}-detail`}>
                        <td colSpan={8} className='p-0'>
                          <EntryDetailPanel entry={entry} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
