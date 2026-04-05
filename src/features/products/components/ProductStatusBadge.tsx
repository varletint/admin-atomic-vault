export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        isActive
          ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
          : "bg-[var(--color-error-bg)] text-[var(--color-error)]"
      }`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
