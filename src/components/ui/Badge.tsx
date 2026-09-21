type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "info";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 ring-green-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  error: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
  info: "bg-primary-light text-primary-dark ring-primary/20",
};

export function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}