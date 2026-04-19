import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-surface-border bg-white/70 px-6 py-14 text-center shadow-soft">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-soft text-brand-green">
        {icon ?? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 7h14l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-extrabold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-xs text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
