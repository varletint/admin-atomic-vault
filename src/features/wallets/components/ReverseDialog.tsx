import { useState } from "react";
import { useReverseTransaction } from "../hooks/useWallets";

interface ReverseDialogProps {
  transactionId: string;
  open: boolean;
  onClose: () => void;
}

export function ReverseDialog({
  transactionId,
  open,
  onClose,
}: ReverseDialogProps) {
  const [reason, setReason] = useState("");
  const mutation = useReverseTransaction();

  if (!open) return null;

  const canSubmit = reason.trim().length >= 5 && !mutation.isPending;

  function handleSubmit() {
    mutation.mutate(
      { transactionId, reason: reason.trim() },
      {
        onSuccess: () => {
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
          Reverse Transaction
        </h2>
        <p className='mt-1 text-xs text-admin-muted'>
          This will create opposite ledger entries and mark the original as
          refunded. This action cannot be undone.
        </p>

        <div className='mt-4 border border-[var(--color-border)] bg-admin-bg/30 p-3'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
            Transaction
          </p>
          <p className='mt-1 font-mono text-xs text-admin-ink'>
            {transactionId}
          </p>
        </div>

        <div className='mt-4 input-group'>
          <label className='input-label'>Reason</label>
          <textarea
            rows={3}
            placeholder='Describe why this transaction is being reversed…'
            className='input-field resize-none'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {mutation.isError && (
          <p className='mt-3 text-xs font-semibold text-[var(--color-error)]'>
            Reversal failed. The transaction may already be reversed.
          </p>
        )}

        <div className='mt-6 flex justify-end gap-3'>
          <button type='button' className='btn btn-secondary' onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            className='btn btn-primary'
            disabled={!canSubmit}
            onClick={handleSubmit}>
            {mutation.isPending ? "Reversing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
