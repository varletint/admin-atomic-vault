import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, X, RotateCcw, Zap, Play } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  useRefund,
  useApproveRefund,
  useRejectRefund,
  useRequeueRefund,
  useForceSettle,
  useDrainOutbox,
} from "../hooks/useRefunds";
import { RefundStatusBadge } from "../components/RefundStatusBadge";
import { RefundTimeline } from "../components/RefundTimeline";
import { ApproveRefundModal } from "../components/ApproveRefundModal";
import { RejectRefundModal } from "../components/RejectRefundModal";

export function RefundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: refund, isLoading, isError } = useRefund(id ?? "");
  const approveRefund = useApproveRefund();
  const rejectRefund = useRejectRefund();
  const requeueRefund = useRequeueRefund();
  const forceSettle = useForceSettle();
  const drainOutbox = useDrainOutbox();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequeueConfirm, setShowRequeueConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted">
          Loading refund…
        </p>
      </div>
    );
  }

  if (isError || !refund) {
    return (
      <div className="p-4 md:p-8">
        <Link
          to={ROUTES.REFUNDS}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink">
          <ArrowLeft size={14} /> Back to Refunds
        </Link>
        <div className="mt-6 border border-[var(--color-border)] bg-admin-surface p-12 text-center">
          <p className="text-sm font-semibold text-[var(--color-error)]">
            Refund not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const canApprove = refund.status === "AWAITING_REVIEW";
  const canReject = refund.status === "AWAITING_REVIEW";
  const canRequeue = refund.status === "FAILED";
  const canForceSettle = refund.status === "GATEWAY_PENDING";

  const customerName =
    refund.userId && typeof refund.userId === "object"
      ? refund.userId.name
      : "—";
  const customerEmail =
    refund.userId && typeof refund.userId === "object"
      ? refund.userId.email
      : "—";

  const reviewerName =
    refund.reviewedBy && typeof refund.reviewedBy === "object"
      ? refund.reviewedBy.name
      : null;

  const orderId =
    typeof refund.orderId === "object" ? refund.orderId._id : refund.orderId;

  return (
    <>
      <Helmet>
        <title>Refund #{id?.slice(-8).toUpperCase()}</title>
      </Helmet>

      <div className="p-4 md:p-8">
        <Link
          to={ROUTES.REFUNDS}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink">
          <ArrowLeft size={14} /> Back to Refunds
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-admin-ink md:text-2xl">
              Refund #{id?.slice(-8).toUpperCase()}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <RefundStatusBadge status={refund.status} />
              <span className="text-xs text-admin-faint">
                {formatDate(refund.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canApprove && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowApproveModal(true)}>
                <Check size={14} />
                Approve
              </button>
            )}
            {canReject && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(true)}>
                <X size={14} />
                Reject
              </button>
            )}
            {canRequeue && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRequeueConfirm(true)}>
                <RotateCcw size={14} />
                Requeue
              </button>
            )}
            {canForceSettle && (
              <button
                type="button"
                className="btn btn-secondary"
                disabled={forceSettle.isPending}
                onClick={() => {
                  forceSettle.mutate(refund._id, {
                    onSuccess: () => toast.success("Refund force-settled."),
                    onError: () => toast.error("Failed to force-settle."),
                  });
                }}>
                <Zap size={14} />
                {forceSettle.isPending ? "Settling…" : "Force Settle"}
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              disabled={drainOutbox.isPending}
              onClick={() => {
                drainOutbox.mutate(undefined, {
                  onSuccess: () => toast.success("Outbox drain scheduled."),
                  onError: () => toast.error("Failed to drain outbox."),
                });
              }}>
              <Play size={14} />
              {drainOutbox.isPending ? "Draining…" : "Drain Outbox"}
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Refund Amounts */}
            <section className="border border-[var(--color-border)] bg-admin-surface">
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                  Refund Details
                </h2>
              </div>
              <div className="space-y-1 px-4 py-3">
                <div className="flex justify-between text-xs text-admin-muted">
                  <span>Original Amount</span>
                  <span className="tabular-nums font-semibold text-admin-ink">
                    {formatCurrency(refund.originalAmount)}
                  </span>
                </div>
                {refund.deductionAmount > 0 && (
                  <>
                    <div className="flex justify-between text-xs text-admin-muted">
                      <span>Deduction</span>
                      <span className="tabular-nums font-semibold text-red-600">
                        −{formatCurrency(refund.deductionAmount)}
                      </span>
                    </div>
                    {refund.deductionReason && (
                      <p className="text-[10px] italic text-admin-faint">
                        {refund.deductionReason}
                      </p>
                    )}
                  </>
                )}
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-sm font-bold text-admin-ink">
                  <span>Net Refund</span>
                  <span className="tabular-nums">
                    {formatCurrency(refund.refundAmount)}
                  </span>
                </div>
              </div>
            </section>

            {/* Error info */}
            {refund.lastError && (
              <section className="border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                  Last Error
                </h2>
                <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                  {refund.lastError}
                </p>
                <p className="mt-1 text-[10px] text-red-500">
                  Retry: {refund.retryCount} · Requeue: {refund.requeueCount}
                </p>
              </section>
            )}

            {/* Rejection reason */}
            {refund.rejectionReason && (
              <section className="border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/20">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                  Rejection Reason
                </h2>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                  {refund.rejectionReason}
                </p>
              </section>
            )}

            {/* Timeline */}
            <section className="border border-[var(--color-border)] bg-admin-surface p-4">
              <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                Status History
              </h2>
              <RefundTimeline history={refund.statusHistory} />
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Customer */}
            <section className="border border-[var(--color-border)] bg-admin-surface p-4">
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                Customer
              </h2>
              <p className="text-sm font-semibold text-admin-ink">
                {customerName}
              </p>
              <p className="mt-0.5 text-xs text-admin-faint">
                {customerEmail}
              </p>
            </section>

            {/* Linked Order */}
            <section className="border border-[var(--color-border)] bg-admin-surface p-4">
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                Linked Order
              </h2>
              <Link
                to={`/orders/${orderId}`}
                className="text-sm font-mono font-semibold text-admin-ink underline hover:no-underline">
                #{orderId.slice(-8).toUpperCase()}
              </Link>
            </section>

            {/* Review Info */}
            {reviewerName && (
              <section className="border border-[var(--color-border)] bg-admin-surface p-4">
                <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                  Reviewed By
                </h2>
                <p className="text-sm font-semibold text-admin-ink">
                  {reviewerName}
                </p>
                {refund.reviewedAt && (
                  <p className="mt-0.5 text-xs text-admin-faint">
                    {formatDate(refund.reviewedAt)}
                  </p>
                )}
              </section>
            )}

            {/* Refund Info */}
            <section className="border border-[var(--color-border)] bg-admin-surface p-4">
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                Refund Info
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-admin-faint">Created</span>
                  <span className="text-admin-text">
                    {formatDate(refund.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-faint">Updated</span>
                  <span className="text-admin-text">
                    {formatDate(refund.updatedAt)}
                  </span>
                </div>
                {refund.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-admin-faint">Completed</span>
                    <span className="text-admin-text">
                      {formatDate(refund.completedAt)}
                    </span>
                  </div>
                )}
                {refund.providerRefundRef && (
                  <div className="flex justify-between">
                    <span className="text-admin-faint">Provider Ref</span>
                    <span className="font-mono text-admin-text">
                      {refund.providerRefundRef}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <ApproveRefundModal
          isLoading={approveRefund.isPending}
          onClose={() => setShowApproveModal(false)}
          onConfirm={(deductionAmount, deductionReason) => {
            approveRefund.mutate(
              { id: refund._id, deductionAmount, deductionReason },
              {
                onSuccess: () => {
                  toast.success("Refund approved");
                  setShowApproveModal(false);
                },
                onError: () => {
                  toast.error("Failed to approve refund");
                },
              }
            );
          }}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectRefundModal
          isLoading={rejectRefund.isPending}
          onClose={() => setShowRejectModal(false)}
          onConfirm={(reason) => {
            rejectRefund.mutate(
              { id: refund._id, reason },
              {
                onSuccess: () => {
                  toast.success("Refund rejected");
                  setShowRejectModal(false);
                },
                onError: () => {
                  toast.error("Failed to reject refund");
                },
              }
            );
          }}
        />
      )}

      {/* Requeue Confirmation */}
      {showRequeueConfirm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setShowRequeueConfirm(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm border border-[var(--color-border)] bg-admin-surface p-6 animate-fadeIn">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-admin-ink">
                Requeue Refund
              </h3>
              <p className="mt-2 text-sm text-admin-text">
                This will reset retry counters and re-dispatch the refund to the
                payment gateway. Requeue count:{" "}
                <strong>{refund.requeueCount}</strong>/3.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequeueConfirm(false)}
                  disabled={requeueRefund.isPending}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={requeueRefund.isPending}
                  onClick={() => {
                    requeueRefund.mutate(refund._id, {
                      onSuccess: () => {
                        toast.success("Refund requeued for processing");
                        setShowRequeueConfirm(false);
                      },
                      onError: () => {
                        toast.error("Failed to requeue refund");
                      },
                    });
                  }}>
                  {requeueRefund.isPending ? "Requeuing…" : "Requeue"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
