import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  subtitle,
  back,
  right,
  tone = "default",
  floating = false,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: string;
  right?: ReactNode;
  tone?: "default" | "brand" | "transparent";
  floating?: boolean;
}) {
  const toneCls = {
    default: "bg-white border-b border-surface-border text-ink",
    brand: "bg-brand-green text-white border-b border-brand-green-dark",
    transparent: "bg-transparent text-white border-b-0",
  }[tone];

  return (
    <header
      className={cn(
        "z-30 flex items-center gap-3 px-4 pt-3 pb-3",
        floating ? "absolute inset-x-0 top-0" : "sticky top-0",
        toneCls,
      )}
      style={{ paddingTop: "max(var(--safe-top), 12px)" }}
    >
      {back ? (
        <Link
          href={back}
          aria-label="Back"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full -ml-1 shrink-0 active:scale-95 transition",
            tone === "default"
              ? "bg-surface-muted hover:bg-surface-muted-2 text-ink"
              : "bg-white/20 hover:bg-white/30 text-white",
          )}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[17px] font-extrabold leading-tight">
          {title}
        </div>
        {subtitle ? (
          <div
            className={cn(
              "truncate text-xs font-medium",
              tone === "default" ? "text-ink-muted" : "text-white/80",
            )}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      {right}
    </header>
  );
}
