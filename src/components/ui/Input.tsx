import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-error focus:ring-2 focus:ring-error/20"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
        } ${className}`}
        {...props}
      />

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}