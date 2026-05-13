type BadgeVariant = "success" | "error" | "warning" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Custom color + bg overrides (takes precedence over variant) */
  color?: string;
  bg?: string;
  /** Custom className appended to defaults */
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  error: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info)]",
  neutral: "bg-[var(--color-bg-muted)] text-[var(--color-text)]",
};

export function StatusBadge({
  label,
  variant = "neutral",
  color,
  bg,
  className = "",
}: StatusBadgeProps) {
  /* If custom color/bg provided, use inline styles instead of variant classes */
  const useCustom = color || bg;

  return (
    <span
      style={useCustom ? { color, backgroundColor: bg } : undefined}
      className={[
        "inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
        useCustom ? "" : VARIANT_STYLES[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}
