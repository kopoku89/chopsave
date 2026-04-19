import { cn } from "@/lib/utils";

type Size = "sm" | "md";

/**
 * Visual 5-star rating with optional review count.
 *
 * Shows a filled star for each whole point, a half-filled star for .5+, and
 * an empty outline otherwise. Designed to sit inline next to a vendor name or
 * in a pill on a deal card without shouting for attention.
 */
export function StarRating({
  value,
  count,
  size = "sm",
  showValue = true,
  showCount = true,
  className,
}: {
  value: number;
  count?: number;
  size?: Size;
  showValue?: boolean;
  showCount?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(5, value));
  const hasRating = clamped > 0;

  const starPx = size === "sm" ? 12 : 14;
  const textCls = size === "sm" ? "text-[11px]" : "text-xs";

  if (!hasRating) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-semibold text-ink-faint",
          textCls,
          className,
        )}
      >
        <StarOutline size={starPx} />
        New
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1 font-semibold", textCls, className)}
      aria-label={`Rated ${clamped.toFixed(1)} out of 5${
        count ? ` from ${count} reviews` : ""
      }`}
    >
      <Stars value={clamped} size={starPx} />
      {showValue ? (
        <span className="tabular font-extrabold text-ink">
          {clamped.toFixed(1)}
        </span>
      ) : null}
      {showCount && typeof count === "number" && count > 0 ? (
        <span className="tabular text-ink-muted">
          ({formatCount(count)})
        </span>
      ) : null}
    </span>
  );
}

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="inline-flex items-center" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const diff = value - i;
        if (diff >= 1) return <StarFilled key={i} size={size} />;
        if (diff >= 0.5) return <StarHalf key={i} size={size} />;
        return <StarOutline key={i} size={size} />;
      })}
    </span>
  );
}

function StarFilled({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#FFC83D"
      stroke="#FFC83D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  );
}

function StarOutline({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D7D4CB"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  );
}

function StarHalf({ size }: { size: number }) {
  const gradId = `half-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="#FFC83D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="#FFC83D" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(n / 1000)}k`;
}
