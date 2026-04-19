import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontally-scrolling pill tab used on vendor/admin list pages to filter
 * by status. Matches the category chips on the Customer browse page.
 */
export function TabChip({
  href,
  label,
  active,
  count,
}: {
  href: string;
  label: ReactNode;
  active?: boolean;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-bold active:scale-95 transition shadow-soft",
        active
          ? "border-brand-green bg-brand-green text-white shadow-float"
          : "border-surface-border bg-white text-ink hover:border-brand-green/30",
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold tabular",
            active
              ? "bg-white/20 text-white"
              : "bg-surface-muted text-ink-muted",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function TabBar({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-5 pb-1">{children}</div>
    </div>
  );
}
