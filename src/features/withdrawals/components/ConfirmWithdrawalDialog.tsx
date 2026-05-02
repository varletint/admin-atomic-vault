import { formatCurrency } from "@/utils/format";

interface ConfirmWithdrawalDialogProps {
  open: boolean;
  amount: number;
  bankLabel: string;
  accountNumber: string;
  accountName: string;
  reason: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmWithdrawalDialog({
  open,
  amount,
  bankLabel,
  accountNumber,
  accountName,
  reason,
  isPending,
  onConfirm,
  onCancel,
}: ConfirmWithdrawalDialogProps) {
  if (!open) return null;

  const koboAmount = Math.round(amount * 100);

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40'
      onClick={onCancel}>
      <div
        className='w-full max-w-md border border-[var(--color-border)] bg-admin-surface p-6'
        onClick={(e) => e.stopPropagation()}>
        <h2 className='text-lg font-bold tracking-tight text-admin-ink'>
          Confirm Withdrawal
        </h2>
        <p className='mt-1 text-xs text-admin-muted'>
          Please review the details before confirming.
        </p>

        <div className='mt-6 border border-[var(--color-border)] bg-admin-bg/40'>
          <div className='grid grid-cols-2 gap-px bg-[var(--color-border)]'>
            <div className='bg-admin-surface p-4'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                Amount
              </p>
              <p className='mt-1 text-lg font-bold tabular-nums text-admin-ink'>
                {formatCurrency(koboAmount)}
              </p>
            </div>
            <div className='bg-admin-surface p-4'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                Bank
              </p>
              <p className='mt-1 text-sm font-semibold text-admin-ink'>
                {bankLabel}
              </p>
            </div>
            <div className='bg-admin-surface p-4'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                Account Number
              </p>
              <p className='mt-1 text-sm font-semibold tabular-nums text-admin-ink'>
                {accountNumber}
              </p>
            </div>
            <div className='bg-admin-surface p-4'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                Account Name
              </p>
              <p className='mt-1 text-sm font-semibold text-admin-ink'>
                {accountName}
              </p>
            </div>
          </div>
          {reason && (
            <div className='border-t border-[var(--color-border)] bg-admin-surface p-4'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                Reason
              </p>
              <p className='mt-1 text-sm text-admin-text'>{reason}</p>
            </div>
          )}
        </div>

        <p className='mt-4 text-xs font-medium text-[var(--color-warning)]'>
          Funds will be reserved immediately. The bank transfer will be
          processed asynchronously.
        </p>

        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={onCancel}
            disabled={isPending}>
            Go Back
          </button>
          <button
            type='button'
            className='btn btn-primary'
            disabled={isPending}
            onClick={onConfirm}>
            {isPending ? "Processing…" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
