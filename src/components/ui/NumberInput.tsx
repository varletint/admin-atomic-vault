import { forwardRef } from "react";

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

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
          {...props}
        />
        {error && <span className='input-error-text'>{error}</span>}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
