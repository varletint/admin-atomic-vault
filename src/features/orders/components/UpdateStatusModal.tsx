import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { OrderStatus } from "../types";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPED",
  SHIPPED: "DELIVERED",
};

interface UpdateStatusModalProps {
  currentStatus: OrderStatus;
  isLoading: boolean;
  onConfirm: (status: OrderStatus, note?: string) => void;
  onClose: () => void;
}

export function UpdateStatusModal({
  currentStatus,
  isLoading,
  onConfirm,
  onClose,
}: UpdateStatusModalProps) {
  const nextStatus = NEXT_STATUS[currentStatus];
  const [note, setNote] = useState("");

  if (!nextStatus) return null;

  return (
    <Modal open={true} onClose={onClose} title="Update Status">
      <p className="mt-2 text-sm text-admin-text">
        Move this order from{" "}
        <span className="font-bold">{currentStatus}</span> to{" "}
        <span className="font-bold">{nextStatus}</span>?
      </p>

      <div className="mt-4">
        <label className="input-label" htmlFor="status-note">
          Note (optional)
        </label>
        <textarea
          id="status-note"
          className="input-field mt-1 resize-none"
          rows={2}
          placeholder="Add a note about this status change..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isLoading}
          onClick={() => onConfirm(nextStatus, note || undefined)}
        >
          {isLoading ? "Updating…" : `Mark as ${nextStatus}`}
        </button>
      </div>
    </Modal>
  );
}
