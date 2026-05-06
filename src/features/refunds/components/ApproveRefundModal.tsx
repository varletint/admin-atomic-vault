import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";

interface ApproveRefundModalProps {
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (deductionAmount: number, deductionReason: string) => void;
}

export function ApproveRefundModal({
  isLoading,
  onClose,
  onConfirm,
}: ApproveRefundModalProps) {
  const [deductionRaw, setDeductionRaw] = useState("");
  const [deductionReason, setDeductionReason] = useState("");

  // NumberInput emits naira (e.g. "15000"), backend expects kobo (× 100)
  const deductionNaira = deductionRaw ? Number(deductionRaw) : 0;
  const deductionKobo = Math.round(deductionNaira * 100);
  const hasDeduction = deductionKobo > 0;

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
            Approve Refund
          </h3>
          <p className="mt-2 text-sm text-admin-text">
            Optionally apply a deduction before approving this refund.
          </p>

          <div className="mt-4 space-y-4">
            <NumberInput
              label="Deduction Amount"
              currency
              value={deductionRaw}
              onChange={(e) => setDeductionRaw(e.target.value)}
              disabled={isLoading}
              min={0}
            />

            {hasDeduction && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">
                  Deduction Reason
                </label>
                <textarea
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  rows={2}
                  className="mt-1 w-full resize-none border border-[var(--color-border)] bg-admin-bg px-3 py-2 text-sm text-admin-ink outline-none focus:border-admin-ink"
                  placeholder="Reason for deduction…"
                  disabled={isLoading}
                />
              </div>
            )}
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
              disabled={isLoading || (hasDeduction && !deductionReason.trim())}
              onClick={() => onConfirm(deductionKobo, deductionReason)}>
              {isLoading ? "Approving…" : "Approve Refund"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
