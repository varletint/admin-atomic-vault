import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const MAX_WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Escape key ─────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  /* ── Focus trap (basic) ─────────────────────── */
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current.focus();
    return () => prev?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering wrapper */}
      <div className="modal-center">
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`modal-panel w-full ${MAX_WIDTH_MAP[maxWidth]}`}
        >
          {title && (
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-admin-ink">
              {title}
            </h3>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
