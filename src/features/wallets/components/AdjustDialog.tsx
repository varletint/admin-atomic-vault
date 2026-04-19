import { useState } from "react";
import { useAdjustWallet } from "../hooks/useWallets";

interface AdjustDialogProps {
  walletId: string;
  open: boolean;
  onClose: () => void;
}

export function AdjustDialog({ walletId, open, onClose }: AdjustDialogProps) {
  const [direction, setDirection] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const mutation = useAdjustWallet();

  if (!open) return null;

  const canSubmit =
    amount !== "" &&
    Number(amount) > 0 &&
    reason.trim().length >= 5 &&
    !mutation.isPending;

  function handleSubmit() {
    mutation.mutate(
      {
        walletId,
        direction,
        amount: Math.round(Number(amount) * 100),
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          setAmount("");
          setReason("");
          onClose();
        },
      }
    );
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={onClose}>
      <div
        className='w-full max-w-md border border-[var(--color-border)] bg-admin-surface p-6'
        onClick={(e) => e.stopPropagation()}>
        <h2 className='text-lg font-bold tracking-tight text-admin-ink'>
          Adjust Wallet Balance
        </h2>
        <p className='mt-1 text-xs text-admin-muted'>
          Credit or debit the store wallet. Amount is in naira.
        </p>

        <div className='mt-6 space-y-4'>
          <div className='flex gap-2'>
            {(["CREDIT", "DEBIT"] as const).map((d) => (
              <button
                key={d}
                type='button'
                onClick={() => setDirection(d)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  direction === d
                    ? "bg-admin-ink text-admin-surface"
                    : "border border-[var(--color-border)] text-admin-muted hover:text-admin-ink"
                }`}>
                {d}
              </button>
            ))}
          </div>

          <div className='input-group'>
            <label className='input-label'>Amount (₦)</label>
            <input
              type='number'
              min='0.01'
              step='0.01'
              placeholder='0.00'
              className='input-field'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <label className='input-label'>Reason</label>
            <textarea
              rows={3}
              placeholder='Describe the reason for this adjustment…'
              className='input-field resize-none'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {mutation.isError && (
            <p className='text-xs font-semibold text-[var(--color-error)]'>
              Adjustment failed. Please try again.
            </p>
          )}
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <button type='button' className='btn btn-secondary' onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            className='btn btn-primary'
            disabled={!canSubmit}
            onClick={handleSubmit}>
            {mutation.isPending ? "Processing…" : "Confirm Adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
}
