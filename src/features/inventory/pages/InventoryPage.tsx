import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useInventory,
  useStockMovements,
  useAdjustStock,
} from "../hooks/useInventory";
import type { StockMovementType } from "../types";

/* ── Helpers ──────────────────────────────────── */

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

const MOVEMENT_STYLES: Record<
  StockMovementType,
  { label: string; color: string; sign: string }
> = {
  INBOUND: {
    label: "Inbound",
    color: "text-[var(--color-success)]",
    sign: "+",
  },
  OUTBOUND: {
    label: "Outbound",
    color: "text-[var(--color-error)]",
    sign: "−",
  },
  RESERVE: {
    label: "Reserved",
    color: "text-[var(--color-warning)]",
    sign: "−",
  },
  RELEASE: {
    label: "Released",
    color: "text-[var(--color-info)]",
    sign: "+",
  },
  COMMIT: {
    label: "Committed",
    color: "text-[var(--color-error)]",
    sign: "−",
  },
  ADJUSTMENT: {
    label: "Adjustment",
    color: "text-admin-ink",
    sign: "±",
  },
};

/* ── Adjust Stock Modal ──────────────────────── */

function AdjustStockModal({
  productId,
  currentStock,
  onClose,
}: {
  productId: string;
  currentStock: number;
  onClose: () => void;
}) {
  const adjustStock = useAdjustStock();
  const [quantity, setQuantity] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [reason, setReason] = useState("");

  const numQty = Number(quantity) || 0;
  const adjustmentValue = mode === "add" ? numQty : -numQty;
  const newStock = currentStock + adjustmentValue;

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/40'
        onClick={onClose}
        aria-hidden='true'
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md border border-[var(--color-border)] bg-admin-surface p-6 animate-fadeIn'>
          <h3 className='text-sm font-bold uppercase tracking-[0.12em] text-admin-ink'>
            Adjust Stock
          </h3>

          {/* Mode toggle */}
          <div className='mt-4 flex gap-2'>
            <button
              type='button'
              onClick={() => setMode("add")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === "add"
                  ? "bg-admin-ink text-admin-surface"
                  : "bg-[var(--color-bg-muted)] text-admin-muted"
              }`}>
              <Plus size={14} /> Add Stock
            </button>
            <button
              type='button'
              onClick={() => setMode("remove")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === "remove"
                  ? "bg-admin-ink text-admin-surface"
                  : "bg-[var(--color-bg-muted)] text-admin-muted"
              }`}>
              <Minus size={14} /> Remove Stock
            </button>
          </div>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='input-label' htmlFor='adjust-qty'>
                Quantity
              </label>
              <input
                id='adjust-qty'
                type='number'
                className='input-field mt-1'
                min='1'
                placeholder='Enter quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className='input-label' htmlFor='adjust-reason'>
                Reason (optional)
              </label>
              <textarea
                id='adjust-reason'
                className='input-field mt-1 resize-none'
                rows={2}
                placeholder='e.g. Restocked from supplier'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Preview */}
            {numQty > 0 && (
              <div className='border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-xs'>
                <div className='flex justify-between text-admin-muted'>
                  <span>Current stock</span>
                  <span className='tabular-nums font-semibold'>
                    {currentStock}
                  </span>
                </div>
                <div className='flex justify-between text-admin-muted mt-1'>
                  <span>{mode === "add" ? "Adding" : "Removing"}</span>
                  <span
                    className={`tabular-nums font-semibold ${
                      mode === "add"
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-error)]"
                    }`}>
                    {mode === "add" ? "+" : "−"}
                    {numQty}
                  </span>
                </div>
                <div className='flex justify-between text-admin-ink mt-1 pt-1 border-t border-[var(--color-border)]'>
                  <span className='font-bold'>New stock</span>
                  <span className='tabular-nums font-bold'>{newStock}</span>
                </div>
              </div>
            )}
          </div>

          <div className='mt-6 flex gap-3 justify-end'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
              disabled={adjustStock.isPending}>
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              disabled={adjustStock.isPending || numQty <= 0 || newStock < 0}
              onClick={() => {
                adjustStock.mutate(
                  {
                    productId,
                    quantity: adjustmentValue,
                    reason: reason || undefined,
                  },
                  {
                    onSuccess: () => {
                      toast.success(
                        `Stock ${
                          mode === "add" ? "added" : "removed"
                        } successfully`
                      );
                      onClose();
                    },
                    onError: () => {
                      toast.error("Failed to adjust stock");
                    },
                  }
                );
              }}>
              {adjustStock.isPending ? "Adjusting…" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Page ─────────────────────────────────────── */

export function InventoryPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: inventory, isLoading, isError } = useInventory(productId ?? "");
  const [movementPage, setMovementPage] = useState(1);
  const { data: movementsData, isLoading: movementsLoading } =
    useStockMovements(productId ?? "", movementPage);
  const [showAdjust, setShowAdjust] = useState(false);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading inventory…
        </p>
      </div>
    );
  }

  if (isError || !inventory) {
    return (
      <div className='p-4 md:p-8'>
        <Link
          to={`/products/${productId}`}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Product
        </Link>
        <div className='mt-6 border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
          <p className='text-sm font-semibold text-[var(--color-error)]'>
            Inventory not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const available = inventory.stock - inventory.reserved;
  const isLowStock = available <= inventory.lowStockThreshold;

  const movements = movementsData?.movements ?? [];
  const totalPages = movementsData?.totalPages ?? 1;

  return (
    <>
      <Helmet>
        <title>Inventory — Atomic Admin</title>
      </Helmet>

      <div className='p-4 md:p-8'>
        {/* Back link */}
        <Link
          to={`/products/${productId}`}
          className='inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted no-underline hover:text-admin-ink'>
          <ArrowLeft size={14} /> Back to Product
        </Link>

        {/* Header */}
        <div className='mt-4 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-admin-ink md:text-2xl'>
              Inventory
            </h1>
            <p className='mt-1 text-xs text-admin-faint'>
              Product ID: {productId}
            </p>
          </div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => setShowAdjust(true)}>
            Adjust Stock
          </button>
        </div>

        {/* Stock metrics */}
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='border border-[var(--color-border)] bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Total Stock
            </p>
            <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink'>
              {inventory.stock}
            </p>
          </div>
          <div className='border border-[var(--color-border)] bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Reserved
            </p>
            <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-[var(--color-warning)]'>
              {inventory.reserved}
            </p>
          </div>
          <div className='border border-[var(--color-border)] bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Available
            </p>
            <p
              className={`mt-3 text-2xl font-bold tabular-nums tracking-tight ${
                isLowStock
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-success)]"
              }`}>
              {available}
            </p>
            {isLowStock && (
              <p className='mt-1 text-[10px] font-bold uppercase text-[var(--color-error)]'>
                Low Stock
              </p>
            )}
          </div>
          <div className='border border-[var(--color-border)] bg-admin-surface p-5'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Low Stock Threshold
            </p>
            <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink'>
              {inventory.lowStockThreshold}
            </p>
          </div>
        </div>

        {/* Stock Movement History */}
        <section className='mt-8'>
          <h2 className='text-sm font-bold uppercase tracking-widest text-admin-ink mb-4 pb-3 border-b border-[var(--color-border)]'>
            Movement History
          </h2>

          {movementsLoading ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
                Loading movements…
              </p>
            </div>
          ) : movements.length === 0 ? (
            <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
              <p className='text-sm font-semibold text-admin-muted'>
                No stock movements yet.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className='hidden md:block border border-[var(--color-border)] bg-admin-surface'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='border-b border-[var(--color-border)]'>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Type
                      </th>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Quantity
                      </th>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Balance After
                      </th>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Reserved After
                      </th>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Reason
                      </th>
                      <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m) => {
                      const style =
                        MOVEMENT_STYLES[m.type] ?? MOVEMENT_STYLES.ADJUSTMENT;
                      return (
                        <tr
                          key={m._id}
                          className='border-b border-[var(--color-border)] last:border-b-0'>
                          <td className='px-4 py-3'>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-[0.12em] ${style.color}`}>
                              {style.label}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 text-sm font-semibold tabular-nums ${style.color}`}>
                            {style.sign}
                            {m.quantity}
                          </td>
                          <td className='px-4 py-3 text-sm tabular-nums text-admin-text'>
                            {m.balanceAfter}
                          </td>
                          <td className='px-4 py-3 text-sm tabular-nums text-admin-text'>
                            {m.reservedAfter}
                          </td>
                          <td className='px-4 py-3 text-xs text-admin-faint max-w-[200px] truncate'>
                            {m.reference?.reason || "—"}
                          </td>
                          <td className='px-4 py-3 text-xs text-admin-faint'>
                            {formatDate(m.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className='flex flex-col gap-3 md:hidden'>
                {movements.map((m) => {
                  const style =
                    MOVEMENT_STYLES[m.type] ?? MOVEMENT_STYLES.ADJUSTMENT;
                  return (
                    <div
                      key={m._id}
                      className='border border-[var(--color-border)] bg-admin-surface p-4'>
                      <div className='flex items-center justify-between'>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.12em] ${style.color}`}>
                          {style.label}
                        </span>
                        <span
                          className={`text-sm font-bold tabular-nums ${style.color}`}>
                          {style.sign}
                          {m.quantity}
                        </span>
                      </div>
                      <div className='mt-2 flex items-center justify-between text-xs text-admin-muted'>
                        <span>
                          Balance: {m.balanceAfter} · Reserved:{" "}
                          {m.reservedAfter}
                        </span>
                      </div>
                      {m.reference?.reason && (
                        <p className='mt-1 text-xs text-admin-faint truncate'>
                          {m.reference.reason}
                        </p>
                      )}
                      <p className='mt-1 text-[11px] text-admin-faint'>
                        {formatDate(m.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4'>
                  <p className='text-xs text-admin-faint'>
                    Page {movementPage} of {totalPages}
                  </p>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      disabled={movementPage <= 1}
                      onClick={() => setMovementPage((p) => p - 1)}>
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      disabled={movementPage >= totalPages}
                      onClick={() => setMovementPage((p) => p + 1)}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjust && (
        <AdjustStockModal
          productId={productId ?? ""}
          currentStock={inventory.stock}
          onClose={() => setShowAdjust(false)}
        />
      )}
    </>
  );
}
