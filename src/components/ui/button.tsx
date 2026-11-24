import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-action-green text-white hover:bg-action-green-hover disabled:opacity-50",
  secondary:
    "bg-surface text-forest-ink border border-border-soft hover:bg-warm-cream disabled:opacity-50",
  ghost: "bg-transparent text-forest-ink hover:bg-warm-cream/70 disabled:opacity-50",
  danger: "bg-danger text-warm-cream hover:opacity-90 disabled:opacity-50",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] px-5 text-[17px] font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-green focus-visible:ring-offset-2 ${VARIANT[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
