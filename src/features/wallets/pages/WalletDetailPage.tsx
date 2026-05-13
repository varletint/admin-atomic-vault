import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronDown,
  RotateCcw,
  Search,
  Wrench,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Select } from "@/components/ui/Select";
import { useLedger, useReconcile, useRepair } from "../hooks/useWallets";
import { ReverseDialog } from "../components/ReverseDialog";
import type { LedgerEntry, ReconciliationReport } from "../types";
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

function ReconciliationModal({
  report,
  open,
  onClose,
}: {
  report: ReconciliationReport;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title='Reconciliation Report' maxWidth='lg'>
      <div className='space-y-4'>
        {/* Status banner */}
        <div
          className={`flex items-center gap-3 border p-4 ${
            report.balanced
              ? "border-[var(--color-success)] bg-[var(--color-success)]/5"
              : "border-[var(--color-error)] bg-[var(--color-error)]/5"
          }`}>
          {report.balanced ? (
            <CheckCircle size={20} className='text-[var(--color-success)]' />
          ) : (
            <AlertTriangle size={20} className='text-[var(--color-error)]' />
          )}
          <p className='text-sm font-bold'>
            {report.balanced
              ? "Wallet is balanced"
              : "Wallet has discrepancies"}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          <DetailField
            label='Wallet Available'
            value={formatCurrency(report.walletAvailable)}
          />
          <DetailField
            label='Computed Available'
            value={formatCurrency(report.computedAvailable)}
          />
          <DetailField
            label='Difference'
            value={formatCurrency(
              Math.abs(report.walletAvailable - report.computedAvailable)
            )}
          />
          <DetailField
            label='Wallet Pending'
            value={formatCurrency(report.walletPending)}
          />
          <DetailField
            label='Computed Pending'
            value={formatCurrency(report.computedPending)}
          />
          <DetailField
            label='Unposted Txns'
            value={String(report.unpostedTransactions)}
          />
          <DetailField
            label='Credit Count'
            value={String(report.creditCount)}
          />
          <DetailField label='Debit Count' value={String(report.debitCount)} />
          <DetailField
            label='Last Posted'
            value={
              report.lastPostedAt
                ? new Date(report.lastPostedAt).toLocaleString()
                : "—"
            }
          />
        </div>
      </div>
    </Modal>
  );
}

export function WalletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [reverseTarget, setReverseTarget] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Ledger filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [directionFilter, setDirectionFilter] = useState<"" | "CREDIT" | "DEBIT">("");

  // Reconciliation
  const [reconReport, setReconReport] = useState<ReconciliationReport | null>(null);
  const [showReconModal, setShowReconModal] = useState(false);
  const [showRepairConfirm, setShowRepairConfirm] = useState(false);

  const reconcileQuery = useReconcile(id ?? "");
  const repairMutation = useRepair();

  const { data, isLoading, isError } = useLedger(id ?? "", {
    page,
    limit: 25,
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
  });

  const handleReconcile = async () => {
    try {
      const result = await reconcileQuery.refetch();
      if (result.data) {
        setReconReport(result.data);
        setShowReconModal(true);
      }
    } catch {
      toast.error("Failed to run reconciliation");
    }
  };

  const handleRepair = () => {
    if (!id) return;
    repairMutation.mutate(
      { walletId: id, body: { dryRun: false, confirm: true } },
      {
        onSuccess: () => {
          toast.success("Repair completed successfully");
          setShowRepairConfirm(false);
          setShowReconModal(false);
        },
        onError: () => {
          toast.error("Repair failed");
        },
      }
    );
  };

  // Client-side direction filter on entries
  const filteredEntries = data?.entries.filter((e) => {
    if (!directionFilter) return true;
    return e.direction === directionFilter;
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

  const { wallet, total, totalPages } = data;

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

        {/* ── Header with actions ──────── */}
        <div className='flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-end md:justify-between'>
          <div>
            <h3 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Wallet Ledger
            </h3>
            <p className='mt-1 text-sm text-admin-muted'>
              {wallet.currency} · {formatCurrency(wallet.available)} available ·{" "}
              {total} entries
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={handleReconcile}
              disabled={reconcileQuery.isFetching}
              className='flex items-center gap-2 border border-[var(--color-border)] bg-admin-surface px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-ink transition-colors hover:bg-admin-bg/60 disabled:opacity-50'>
              <Search size={14} />
              {reconcileQuery.isFetching ? "Checking…" : "Reconcile"}
            </button>
            <button
              type='button'
              onClick={() => setShowRepairConfirm(true)}
              className='flex items-center gap-2 border border-[var(--color-border)] bg-admin-surface px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-ink transition-colors hover:bg-admin-bg/60'>
              <Wrench size={14} />
              Repair
            </button>
          </div>
        </div>

        {/* ── Filters ─────────────────── */}
        <div className='mt-6 flex flex-wrap items-end gap-4 border border-[var(--color-border)] bg-admin-surface p-4'>
          <div>
            <label className='input-label'>From</label>
            <input
              type='date'
              className='input-field'
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className='input-label'>To</label>
            <input
              type='date'
              className='input-field'
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className='w-40'>
            <Select
              label='Direction'
              options={[
                { value: "", label: "All" },
                { value: "CREDIT", label: "Credit" },
                { value: "DEBIT", label: "Debit" },
              ]}
              value={directionFilter}
              onChange={(e) =>
                setDirectionFilter(e.target.value as "" | "CREDIT" | "DEBIT")
              }
              name='direction'
            />
          </div>
          {(fromDate || toDate || directionFilter) && (
            <button
              type='button'
              onClick={() => {
                setFromDate("");
                setToDate("");
                setDirectionFilter("");
                setPage(1);
              }}
              className='mb-[2px] text-xs font-bold uppercase tracking-wide text-admin-muted hover:text-admin-ink'>
              Clear
            </button>
          )}
        </div>

        {/* ── Table ───────────────────── */}
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
              {(filteredEntries ?? []).map((entry) => {
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

      {/* ── Dialogs ─────────────────── */}
      {reverseTarget && (
        <ReverseDialog
          transactionId={reverseTarget}
          open={true}
          onClose={() => setReverseTarget(null)}
        />
      )}

      {reconReport && (
        <ReconciliationModal
          report={reconReport}
          open={showReconModal}
          onClose={() => {
            setShowReconModal(false);
            setReconReport(null);
          }}
        />
      )}

      <ConfirmDialog
        open={showRepairConfirm}
        onClose={() => setShowRepairConfirm(false)}
        onConfirm={handleRepair}
        title='Confirm Repair'
        description='This will attempt to repair unposted transactions by re-posting them to the ledger. This is a destructive operation. Are you sure?'
        confirmLabel='Run Repair'
        isLoading={repairMutation.isPending}
      />
    </>
  );
}
