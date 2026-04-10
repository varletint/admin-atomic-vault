import { forwardRef, useState, useCallback } from "react";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  label: string;
  error?: string;
  currency?: boolean;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number;
  name?: string;
}

/**
 * Format a raw numeric string into ₦-prefixed, comma-separated display.
 * e.g. "99999" → "₦99,999"  |  "1250.5" → "₦1,250.5"
 */
function formatNaira(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return "";

  const [intPart, decPart] = cleaned.split(".");
  const formatted = Number(intPart).toLocaleString("en-NG");

  if (decPart !== undefined) {
    return `₦${formatted}.${decPart}`;
  }
  return `₦${formatted}`;
}

/**
 * Strip formatting back to raw numeric string.
 * "₦99,999.50" → "99999.50"
 */
function stripToRaw(display: string): string {
  return display.replace(/[₦,\s]/g, "");
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      error,
      currency = false,
      className = "",
      id,
      name,
      onChange,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    // For currency mode: maintain a display string internally
    const [displayValue, setDisplayValue] = useState(() => {
      if (!currency) return "";
      const initial = value !== undefined && value !== "" ? String(value) : "";
      return initial ? formatNaira(initial) : "";
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currency) {
          // Plain number mode — pass through
          onChange?.({ target: { name, value: e.target.value } });
          return;
        }

        const raw = stripToRaw(e.target.value);

        // Validate: allow empty, digits, and one decimal point
        if (raw && !/^\d*\.?\d*$/.test(raw)) return;

        setDisplayValue(raw ? formatNaira(raw) : "");

        // Emit the raw numeric string so react-hook-form / zod can coerce it
        onChange?.({ target: { name, value: raw } });
      },
      [currency, onChange, name]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (currency) {
          // Clean up trailing dots on blur: "₦99,999." → "₦99,999"
          const raw = stripToRaw(displayValue);
          if (raw.endsWith(".")) {
            setDisplayValue(formatNaira(raw.slice(0, -1)));
          }
        }
        onBlur?.(e);
      },
      [currency, displayValue, onBlur]
    );

    // Determine what to show
    const inputValue = currency
      ? displayValue
      : value !== undefined
      ? value
      : undefined;

    if (currency) {
      return (
        <div className={`input-group ${className}`}>
          <label htmlFor={inputId} className='input-label'>
            {label}
          </label>
          <input
            id={inputId}
            ref={ref}
            type='text'
            inputMode='decimal'
            className={`input-field ${error ? "input-error" : ""}`}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            name={name}
            autoComplete='off'
            {...props}
          />
          {error && <span className='input-error-text'>{error}</span>}
        </div>
      );
    }

    // Non-currency: plain number input
    return (
      <div className={`input-group ${className}`}>
        <label htmlFor={inputId} className='input-label'>
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          type='number'
          className={`input-field ${error ? "input-error" : ""}`}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          name={name}
          {...props}
        />
        {error && <span className='input-error-text'>{error}</span>}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
