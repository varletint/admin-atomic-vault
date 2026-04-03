import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`input-group ${className}`}>
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`input-field ${error ? "input-error" : ""}`}
          {...props}
        />
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
