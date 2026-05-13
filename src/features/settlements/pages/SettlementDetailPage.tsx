import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useSettlement } from "../hooks/useSettlements";
import { SettlementStatusBadge } from "../components/SettlementStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";
import type { SettlementItemMatch } from "../types";

const MATCH_VARIANTS: Record<
  SettlementItemMatch,
  { variant: "success" | "error" | "warning" }
> = {
  MATCHED: { variant: "success" },
  UNMATCHED: { variant: "error" },
  AMOUNT_MISMATCH: { variant: "warning" },
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-[160px]'>
      <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
        {label}
      </p>
      <p className='mt-0.5 break-all font-mono text-xs text-admin-ink'>
        {value || "—"}
      </p>
    </div>
  );
}

export function SettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: settlement, isLoading, isError } = useSettlement(id ?? "");

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading settlement…
        </p>
      </div>
    );
  }

  if (isError || !settlement) {
    return (
      <div className='p-8'>
        <p className='text-sm font-semibold text-[var(--color-error)]'>
          Failed to load settlement.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settlement {settlement.paystackId}</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <button
          type='button'
          onClick={() => navigate("/settlements")}
          className='mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-admin-muted transition-colors hover:text-admin-ink'>
          <ArrowLeft size={14} />
          Back to settlements
        </button>

        {/* ── Header ────────────────────── */}
        <div className='border-b border-[var(--color-border)] pb-6'>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
              Settlement
            </h1>
            <SettlementStatusBadge status={settlement.status} />
          </div>
          <p className='mt-1 font-mono text-sm text-admin-muted'>
            {settlement.paystackId}
          </p>
        </div>

        {/* ── Summary Grid ──────────────── */}
        <div className='mt-6 grid grid-cols-2 gap-6 border border-[var(--color-border)] bg-admin-surface p-6 md:grid-cols-4'>
          <DetailField
            label='Total Amount'
            value={formatCurrency(settlement.totalAmount)}
          />
          <DetailField
            label='Total Fees'
            value={formatCurrency(settlement.totalFees)}
          />
          <DetailField
            label='Net Amount'
            value={formatCurrency(settlement.netAmount)}
          />
          <DetailField label='Currency' value={settlement.currency} />
          <DetailField
            label='Settled At'
            value={formatDate(settlement.settledAt)}
          />
          <DetailField
            label='Reconciled At'
            value={
              settlement.reconciledAt
                ? formatDate(settlement.reconciledAt)
                : "—"
            }
          />
          <DetailField
            label='Unmatched'
            value={String(settlement.unmatchedCount)}
          />
          <DetailField
            label='Mismatched'
            value={String(settlement.mismatchCount)}
          />
        </div>

        {/* ── Items Table ────────────────── */}
        <h2 className='mt-8 text-sm font-bold uppercase tracking-widest text-admin-ink'>
          Settlement Items ({settlement.items.length})
        </h2>
        <div className='mt-4 overflow-x-auto border border-[var(--color-border)]'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Paystack Ref
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Gross
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Fee
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Net
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Match
                </th>
                <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {settlement.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='py-8 text-center text-sm text-admin-muted'>
                    No items in this settlement.
                  </td>
                </tr>
              ) : (
                settlement.items.map((item, idx) => {
                  const match =
                    MATCH_VARIANTS[item.matchStatus] ?? { variant: "neutral" as const };
                  return (
                    <tr
                      key={idx}
                      className='border-b border-[var(--color-border)] bg-admin-surface transition-colors hover:bg-admin-bg/60 last:border-b-0'>
                      <td className='px-4 py-3 font-mono text-xs text-admin-ink'>
                        {item.paystackRef}
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(item.grossAmount)}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {formatCurrency(item.fee)}
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(item.netAmount)}
                      </td>
                      <td className='px-4 py-3'>
                        <StatusBadge
                          label={item.matchStatus.replace("_", " ")}
                          variant={match.variant}
                        />
                      </td>
                      <td className='px-4 py-3 font-mono text-xs text-admin-faint'>
                        {item.transactionId ?? "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
