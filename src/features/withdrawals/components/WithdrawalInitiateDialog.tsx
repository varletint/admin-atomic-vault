import { useState } from "react";
import {
  useInitiateWithdrawal,
  useResolveAccount,
} from "../hooks/useWithdrawals";
import { useStoreWallet } from "@/features/wallets/hooks/useWallets";
import { NumberInput } from "@/components/ui/NumberInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmWithdrawalDialog } from "./ConfirmWithdrawalDialog";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

const BANKS = [
  { value: "044", label: "Access Bank" },
  { value: "023", label: "Citibank Nigeria" },
  { value: "063", label: "Diamond Bank" },
  { value: "050", label: "Ecobank Nigeria" },
  { value: "084", label: "Enterprise Bank" },
  { value: "070", label: "Fidelity Bank" },
  { value: "011", label: "First Bank of Nigeria" },
  { value: "214", label: "First City Monument Bank" },
  { value: "058", label: "Guaranty Trust Bank" },
  { value: "030", label: "Heritage Bank" },
  { value: "301", label: "Jaiz Bank" },
  { value: "082", label: "Keystone Bank" },
  { value: "076", label: "Polaris Bank" },
  { value: "101", label: "Providus Bank" },
  { value: "221", label: "Stanbic IBTC Bank" },
  { value: "068", label: "Standard Chartered Bank" },
  { value: "232", label: "Sterling Bank" },
  { value: "100", label: "Suntrust Bank" },
  { value: "032", label: "Union Bank of Nigeria" },
  { value: "033", label: "United Bank for Africa" },
  { value: "215", label: "Unity Bank" },
  { value: "035", label: "Wema Bank" },
  { value: "057", label: "Zenith Bank" },
  { value: "999992", label: "OPay" },
  { value: "999991", label: "PalmPay" },
  { value: "120004", label: "SmartCash" },
];

interface WithdrawalInitiateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export function WithdrawalInitiateDialog({
  open,
  onClose,
  onSuccess,
}: WithdrawalInitiateDialogProps) {
  const { data: wallet } = useStoreWallet();
  const mutation = useInitiateWithdrawal();

  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [manualAccountName, setManualAccountName] = useState<string | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolveQuery = useResolveAccount(bankCode, accountNumber);

  // Derived state to avoid useEffect
  const accountName =
    manualAccountName !== null
      ? manualAccountName
      : resolveQuery.data?.accountName ?? "";

  if (!open) return null;

  const bankLabel = BANKS.find((b) => b.value === bankCode)?.label ?? bankCode;

  function validate(): boolean {
    const next: Record<string, string> = {};
    const numAmount = Number(amount);

    if (!amount || numAmount <= 0) {
      next.amount = "Amount must be greater than 0.";
    } else if (wallet && Math.round(numAmount * 100) > wallet.available) {
      next.amount = `Exceeds available balance (${formatCurrency(
        wallet.available
      )}).`;
    }

    if (!bankCode) next.bankCode = "Select a bank.";

    if (!accountNumber || !/^\d{10}$/.test(accountNumber)) {
      next.accountNumber = "Account number must be exactly 10 digits.";
    }

    if (!accountName.trim()) {
      next.accountName = "Account name is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    setShowConfirm(true);
  }

  function handleConfirm() {
    if (!wallet) return;

    const idempotencyKey = crypto.randomUUID();
    const koboAmount = Math.round(Number(amount) * 100);

    mutation.mutate(
      {
        walletId: wallet._id,
        amount: koboAmount,
        bankCode,
        accountNumber,
        accountName: accountName.trim(),
        reason: reason.trim() || undefined,
        idempotencyKey,
      },
      {
        onSuccess: (result) => {
          toast.success("Withdrawal initiated. Funds have been reserved.");
          resetForm();
          onSuccess(result.transactionId);
        },
        onError: (err) => {
          setShowConfirm(false);
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Withdrawal failed. Please try again.";
          toast.error(message);
        },
      }
    );
  }

  function resetForm() {
    setAmount("");
    setBankCode("");
    setAccountNumber("");
    setManualAccountName(null);
    setReason("");
    setErrors({});
    setShowConfirm(false);
  }

  function handleClose() {
    if (mutation.isPending) return;
    resetForm();
    onClose();
  }

  /* ── Confirmation step ── */
  if (showConfirm) {
    return (
      <ConfirmWithdrawalDialog
        open
        amount={Number(amount)}
        bankLabel={bankLabel}
        accountNumber={accountNumber}
        accountName={accountName.trim()}
        reason={reason.trim()}
        isPending={mutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    );
  }

  /* ── Form step ── */
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={handleClose}>
      <div
        className='w-full max-w-lg border border-[var(--color-border)] bg-admin-surface p-6'
        onClick={(e) => e.stopPropagation()}>
        <h2 className='text-lg font-bold tracking-tight text-admin-ink'>
          New Withdrawal
        </h2>
        <p className='mt-1 text-xs text-admin-muted'>
          Transfer funds from the store wallet to a bank account.
          {wallet && (
            <span className='ml-1 font-semibold tabular-nums text-admin-ink'>
              Available: {formatCurrency(wallet.available)}
            </span>
          )}
        </p>

        <div className='mt-6 space-y-4'>
          <NumberInput
            label='Amount (₦)'
            currency
            placeholder='0.00'
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            error={errors.amount}
          />

          <Input
            label='Account Number'
            placeholder='0123456789'
            maxLength={10}
            inputMode='numeric'
            value={accountNumber}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
              setAccountNumber(v);
              setManualAccountName(null);
              setErrors((prev) => ({ ...prev, accountNumber: "" }));
            }}
            error={errors.accountNumber}
          />

          <Select
            label='Bank'
            options={BANKS}
            placeholder='Select bank…'
            value={bankCode}
            onChange={(e) => {
              setBankCode(String(e.target.value));
              setManualAccountName(null);
              setErrors((prev) => ({ ...prev, bankCode: "" }));
            }}
            error={errors.bankCode}
          />

          <Input
            label='Account Name'
            placeholder={
              resolveQuery.isFetching ? "Resolving..." : "Account holder name"
            }
            value={accountName}
            disabled={resolveQuery.isFetching}
            onChange={(e) => {
              setManualAccountName(e.target.value);
              setErrors((prev) => ({ ...prev, accountName: "" }));
            }}
            error={errors.accountName}
          />

          <div className='input-group'>
            <label className='input-label'>Reason (optional)</label>
            <textarea
              rows={2}
              placeholder='What is this withdrawal for?'
              className='input-field resize-none'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {mutation.isError && (
            <p className='text-xs font-semibold text-[var(--color-error)]'>
              Withdrawal failed. Please try again.
            </p>
          )}
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleClose}>
            Cancel
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleNext}>
            Review & Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
