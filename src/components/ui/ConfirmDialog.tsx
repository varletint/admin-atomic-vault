import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="sm">
      <p className="mt-2 text-sm text-admin-text">{description}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`btn ${variant === "danger" ? "btn-primary" : "btn-primary"}`}
          disabled={isLoading}
          onClick={onConfirm}
        >
          {isLoading ? "Processing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
