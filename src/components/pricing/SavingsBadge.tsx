import { cn } from "@/lib/utils";
import { discountPercent, formatGHS } from "@/lib/format";

type Tone = "solid" | "soft" | "white";
type Size = "xs" | "sm" | "md" | "lg";

/**
 * A unified, attention-grabbing pill that communicates savings.
 *
 * - `solid` — brand orange background, for use on white/cream surfaces.
 * - `soft`  — soft orange chip, for denser rows where we don't want shouting.
 * - `white` — white pill with orange text, for use on photo/hero surfaces.
 *
 * The `show` prop picks which savings facet to render:
 * - `"percent"` → `Save 42%`      (default, most scannable)
 * - `"amount"`  → `Save GHS 25.00`
 * - `"both"`    → `Save 42% · GHS 25.00` (bigger surfaces)
 */
export function SavingsBadge({
  original,
  discounted,
  show = "percent",
  tone = "solid",
  size = "md",
  className,
}: {
  original: number;
  discounted: number;
  show?: "percent" | "amount" | "both";
  tone?: Tone;
  size?: Size;
  className?: string;
}) {
  const pct = discountPercent(original, discounted);
  const savings = original - discounted;
  if (pct <= 0 || savings <= 0) return null;

  const toneCls = {
    solid: "bg-brand-orange text-white shadow-float",
    soft: "bg-brand-orange-soft text-brand-orange-dark",
    white: "bg-white text-brand-orange shadow-soft ring-1 ring-brand-orange/10",
  }[tone];

  const sizeCls = {
    xs: "h-5 px-2 text-[10px] gap-1",
    sm: "h-6 px-2.5 text-[11px] gap-1",
    md: "h-7 px-3 text-xs gap-1.5",
    lg: "h-8 px-3.5 text-sm gap-1.5",
  }[size];

  const label =
    show === "amount"
      ? `Save ${formatGHS(savings)}`
      : show === "both"
        ? `Save ${pct}% · ${formatGHS(savings)}`
        : `Save ${pct}%`;

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full font-extrabold uppercase tracking-wider tabular",
        sizeCls,
        toneCls,
        className,
      )}
      aria-label={`Save ${pct}%, equal to ${formatGHS(savings)}`}
    >
      <TagIcon />
      {label}
    </span>
  );
}

function TagIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}
