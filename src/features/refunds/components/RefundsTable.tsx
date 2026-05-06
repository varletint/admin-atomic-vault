import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/format";
import { RefundStatusBadge } from "./RefundStatusBadge";
import type { RefundRequest } from "../types";

interface RefundsTableProps {
  refunds: RefundRequest[];
  isLoading?: boolean;
}

export function RefundsTable({ refunds, isLoading }: RefundsTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted">
          Loading refunds…
        </p>
      </div>
    );
  }

  if (!refunds.length) {
    return (
      <div className="border border-[var(--color-border)] bg-admin-surface p-12 text-center">
        <p className="text-sm font-semibold text-admin-muted">
          No refund requests found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Order
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Customer
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Amount
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Status
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {refunds.map((refund) => {
            const orderId =
              typeof refund.orderId === "object"
                ? refund.orderId._id
                : refund.orderId;
            const customerName =
              refund.userId && typeof refund.userId === "object"
                ? refund.userId.name
                : "—";

            return (
              <tr
                key={refund._id}
                className="cursor-pointer transition-colors hover:bg-admin-bg/40"
                onClick={() => navigate(`/refunds/${refund._id}`)}>
                <td className="px-4 py-3 font-mono text-xs text-admin-text">
                  #{orderId.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-admin-ink">
                  {customerName}
                </td>
                <td className="px-4 py-3 tabular-nums text-sm font-bold text-admin-ink">
                  {formatCurrency(refund.refundAmount)}
                </td>
                <td className="px-4 py-3">
                  <RefundStatusBadge status={refund.status} />
                </td>
                <td className="px-4 py-3 text-xs text-admin-faint">
                  {formatDate(refund.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
