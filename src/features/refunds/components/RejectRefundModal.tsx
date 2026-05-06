import { useState } from "react";

interface RejectRefundModalProps {
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectRefundModal({
  isLoading,
  onClose,
  onConfirm,
}: RejectRefundModalProps) {
  const [reason, setReason] = useState("");

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-[var(--color-border)] bg-admin-surface p-6 animate-fadeIn">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-admin-ink">
            Reject Refund
          </h3>
          <p className="mt-2 text-sm text-admin-text">
            Provide a reason for rejecting this refund request.
          </p>

          <div className="mt-4">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none border border-[var(--color-border)] bg-admin-bg px-3 py-2 text-sm text-admin-ink outline-none focus:border-admin-ink"
              placeholder="Why is this refund being rejected?"
              disabled={isLoading}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isLoading || !reason.trim()}
              onClick={() => onConfirm(reason)}>
              {isLoading ? "Rejecting…" : "Reject Refund"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
