import { cn } from "@/lib/utils";

/**
 * A slim reassurance strip that explains *why* discounted food is still great.
 *
 * Deliberately understated: no heavy colours, no icons larger than 20 px. It's
 * meant to answer the unspoken "is this old / unsafe food?" question on both
 * the home feed and the deal detail page without stealing focus from the deal.
 *
 * Variants:
 * - `soft`  — brand-green soft chip on white pages
 * - `white` — white pill for coloured hero backgrounds
 * - `inline` — zero chrome, for dense screens
 */
export function TrustStrip({
  message = "Prepared today. Unsold, not expired.",
  sub,
  variant = "soft",
  className,
}: {
  message?: string;
  sub?: string;
  variant?: "soft" | "white" | "inline";
  className?: string;
}) {
  const container = {
    soft: "bg-brand-green-soft text-brand-green-ink",
    white: "bg-white text-ink shadow-soft",
    inline: "bg-transparent text-ink-muted",
  }[variant];

  const iconTone = {
    soft: "bg-brand-green text-white",
    white: "bg-brand-green text-white",
    inline: "bg-brand-green-soft text-brand-green",
  }[variant];

  return (
    <div
      role="note"
      className={cn(
        "flex items-center gap-2.5 rounded-2xl px-3 py-2",
        container,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
          iconTone,
        )}
      >
        <ShieldIcon />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="text-[13px] font-extrabold">{message}</div>
        {sub ? (
          <div className="text-[11px] font-medium text-ink-muted">{sub}</div>
        ) : null}
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l8 3v6c0 5-3.5 8.3-8 9-4.5-.7-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
