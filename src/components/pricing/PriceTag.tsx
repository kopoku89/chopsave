import { cn } from "@/lib/utils";
import { formatGHS } from "@/lib/format";
import { SavingsBadge } from "./SavingsBadge";

type Size = "sm" | "md" | "lg" | "xl";
type Layout = "inline" | "stacked" | "hero";

/**
 * Single source of truth for how we display `original → discounted` pricing.
 *
 * Visual rules (kept consistent across every surface):
 *   1. **Discounted price** is always the most prominent element and
 *      always rendered in brand-green — the "pay this" number.
 *   2. **Original price** uses `line-through` and a muted ink colour.
 *   3. **Savings** always appear in brand-orange (`SavingsBadge`) so users
 *      pattern-match "orange = money back in my pocket" across the app.
 *
 * Layouts:
 *   - `inline`  — price row + savings pill beside it. Used in lists.
 *   - `stacked` — discounted on top, original struck out beneath, compact
 *                 savings pill inline. Used in tight thumbnail rows.
 *   - `hero`    — large display used on the deal detail page, with an
 *                 emphasised "You pay" label and "Save X%" badge.
 */
export function PriceTag({
  original,
  discounted,
  size = "md",
  layout = "inline",
  showSavings = true,
  savingsShow = "percent",
  savingsTone,
  className,
}: {
  original: number;
  discounted: number;
  size?: Size;
  layout?: Layout;
  showSavings?: boolean;
  savingsShow?: "percent" | "amount" | "both";
  savingsTone?: "solid" | "soft" | "white";
  className?: string;
}) {
  const discounting = discounted < original;

  const priceSizes = {
    sm: {
      discounted: "text-[15px]",
      original: "text-[11px]",
    },
    md: {
      discounted: "text-lg",
      original: "text-[13px]",
    },
    lg: {
      discounted: "text-xl",
      original: "text-sm",
    },
    xl: {
      discounted: "text-3xl",
      original: "text-base",
    },
  }[size];

  const savingsSize = (
    {
      sm: "xs",
      md: "sm",
      lg: "sm",
      xl: "md",
    } as const
  )[size];

  // Default savings tone per layout so callers rarely have to think about it.
  const resolvedSavingsTone = savingsTone ?? (layout === "hero" ? "solid" : "soft");

  if (layout === "hero") {
    return (
      <div className={cn("flex flex-wrap items-end gap-x-3 gap-y-2", className)}>
        <div className="flex items-baseline gap-2.5">
          <span
            className={cn(
              "font-extrabold tabular leading-none text-brand-green",
              priceSizes.discounted,
            )}
          >
            {formatGHS(discounted)}
          </span>
          {discounting ? (
            <span
              className={cn(
                "font-semibold tabular text-ink-faint line-through",
                priceSizes.original,
              )}
            >
              {formatGHS(original)}
            </span>
          ) : null}
        </div>
        {showSavings && discounting ? (
          <SavingsBadge
            original={original}
            discounted={discounted}
            show={savingsShow}
            size={savingsSize}
            tone={resolvedSavingsTone}
          />
        ) : null}
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col items-start gap-0.5", className)}>
        <span
          className={cn(
            "font-extrabold tabular leading-none text-brand-green",
            priceSizes.discounted,
          )}
        >
          {formatGHS(discounted)}
        </span>
        <div className="flex items-center gap-2">
          {discounting ? (
            <span
              className={cn(
                "font-semibold tabular text-ink-faint line-through",
                priceSizes.original,
              )}
            >
              {formatGHS(original)}
            </span>
          ) : null}
          {showSavings && discounting ? (
            <SavingsBadge
              original={original}
              discounted={discounted}
              show={savingsShow}
              size="xs"
              tone={resolvedSavingsTone}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // `inline` (default)
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1",
        className,
      )}
    >
      <span
        className={cn(
          "font-extrabold tabular text-brand-green",
          priceSizes.discounted,
        )}
      >
        {formatGHS(discounted)}
      </span>
      {discounting ? (
        <span
          className={cn(
            "font-semibold tabular text-ink-faint line-through",
            priceSizes.original,
          )}
        >
          {formatGHS(original)}
        </span>
      ) : null}
      {showSavings && discounting ? (
        <SavingsBadge
          original={original}
          discounted={discounted}
          show={savingsShow}
          size={savingsSize}
          tone={resolvedSavingsTone}
          className="ml-auto"
        />
      ) : null}
    </div>
  );
}
