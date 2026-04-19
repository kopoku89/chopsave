import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "green"
  | "green-solid"
  | "orange"
  | "orange-solid"
  | "yellow"
  | "yellow-solid"
  | "neutral"
  | "dark"
  | "red";

const tones: Record<Tone, string> = {
  green: "bg-brand-green-tint text-brand-green-ink",
  "green-solid": "bg-brand-green text-white",
  orange: "bg-brand-orange-soft text-brand-orange-dark",
  "orange-solid": "bg-brand-orange text-white",
  yellow: "bg-brand-yellow-soft text-[#7A5A00]",
  "yellow-solid": "bg-brand-yellow text-[#3A2A00]",
  neutral: "bg-surface-muted text-ink-muted",
  dark: "bg-ink text-white",
  red: "bg-red-50 text-red-700",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  size = "md",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-2 py-0.5 text-[10px] leading-4",
    md: "px-2.5 py-0.5 text-[11px] leading-4",
    lg: "px-3 py-1 text-xs leading-4",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide",
        sizes,
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Larger, attention-grabbing discount chip (e.g. "-50%").
 * Inspired by the hero badges in Uber Eats / Glovo deal cards.
 */
export function DiscountChip({
  percent,
  className,
  size = "md",
}: {
  percent: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-6 px-2 text-[11px]",
    md: "h-7 px-2.5 text-xs",
    lg: "h-8 px-3 text-sm",
  }[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded-full bg-brand-orange text-white font-extrabold shadow-float",
        sizes,
        className,
      )}
    >
      <span>−{percent}%</span>
    </span>
  );
}
