import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "green" | "orange" | "yellow";
  icon?: ReactNode;
}) {
  const toneClass = {
    default: "bg-white border-surface-border",
    green: "bg-brand-green-soft border-brand-green/15",
    orange: "bg-brand-orange-soft border-brand-orange/15",
    yellow: "bg-brand-yellow-soft border-brand-yellow/30",
  }[tone];

  const iconTone = {
    default: "bg-surface-muted text-ink-muted",
    green: "bg-white text-brand-green",
    orange: "bg-white text-brand-orange-dark",
    yellow: "bg-white text-[#8a6d00]",
  }[tone];

  return (
    <div className={cn("rounded-2xl border p-4 shadow-soft", toneClass)}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
          {label}
        </span>
        {icon ? (
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-lg",
              iconTone,
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 text-xl font-extrabold tabular text-ink">
        {value}
      </div>
      {hint ? (
        <div className="mt-0.5 text-xs text-ink-muted">{hint}</div>
      ) : null}
    </div>
  );
}
