import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Landmark } from "lucide-react";
import { useSettlements } from "../hooks/useSettlements";
import { SettlementStatusBadge } from "../components/SettlementStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";
import type { SettlementStatus } from "../types";

export function SettlementsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | "">("");

  const { data, isLoading, isError } = useSettlements({
    page,
    limit: 20,
    ...(statusFilter ? { status: statusFilter as SettlementStatus } : {}),
  });

  return (
    <>
      <Helmet>
        <title>Settlements</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--color-border)] pb-6'>
          <div>
            <h1 className='text-2xl font-black uppercase tracking-tight text-admin-ink md:text-3xl'>
              Settlements
            </h1>
            <p className='mt-1 text-sm text-admin-muted'>
              Paystack settlement reconciliation records
            </p>
          </div>
          <div className='w-48'>
            <Select
              label=''
              options={[
                { value: "", label: "All Statuses" },
                { value: "PENDING", label: "Pending" },
                { value: "RECONCILED", label: "Reconciled" },
                { value: "PARTIAL", label: "Partial" },
                { value: "FAILED", label: "Failed" },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as SettlementStatus | "");
                setPage(1);
              }}
              name='statusFilter'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='mt-6'>
            <Skeleton.TableRows rows={8} cols={7} />
          </div>
        ) : isError || !data ? (
          <div className='mt-6 p-8 text-center'>
            <p className='text-sm font-semibold text-[var(--color-error)]'>
              Failed to load settlements.
            </p>
          </div>
        ) : data.settlements.length === 0 ? (
          <div className='mt-6'>
            <EmptyState
              icon={Landmark}
              title='No settlements found'
              description='Settlements will appear here once Paystack processes payouts.'
            />
          </div>
        ) : (
          <>
            <div className='mt-6 overflow-x-auto border border-[var(--color-border)]'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Paystack ID
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Total
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Fees
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Net
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Unmatched
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Settled At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.settlements.map((s) => (
                    <tr
                      key={s._id}
                      className='border-b border-[var(--color-border)] bg-admin-surface transition-colors hover:bg-admin-bg/60 last:border-b-0'>
                      <td className='px-4 py-3'>
                        <Link
                          to={`/settlements/${s._id}`}
                          className='font-mono text-xs font-semibold text-admin-ink underline-offset-2 hover:underline'>
                          {s.paystackId}
                        </Link>
                      </td>
                      <td className='px-4 py-3'>
                        <SettlementStatusBadge status={s.status} />
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(s.totalAmount)}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {formatCurrency(s.totalFees)}
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(s.netAmount)}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        {s.unmatchedCount > 0 ? (
                          <span className='text-xs font-bold text-[var(--color-error)]'>
                            {s.unmatchedCount}
                          </span>
                        ) : (
                          <span className='text-xs text-admin-faint'>0</span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {formatDate(s.settledAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}
