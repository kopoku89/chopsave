import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline"
  | "dark";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/20";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-6 text-[15px]",
  xl: "h-[56px] px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-green text-white shadow-float hover:bg-brand-green-dark hover:shadow-pop",
  secondary:
    "bg-brand-orange text-white shadow-float hover:bg-brand-orange-dark hover:shadow-pop",
  ghost: "bg-transparent text-ink hover:bg-surface-muted",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline:
    "bg-white text-ink border border-surface-border-strong hover:bg-surface-muted",
  dark: "bg-ink text-white hover:bg-black",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  leading,
  trailing,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
