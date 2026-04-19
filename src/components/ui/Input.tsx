import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// 16 px font-size prevents iOS auto-zoom on focus. Height is 48 px so
// the control meets comfortable thumb-reach guidelines.
const fieldBase =
  "w-full rounded-2xl border border-surface-border bg-white px-4 py-3 text-[16px] leading-5 text-ink placeholder:text-ink-faint transition focus:outline-none focus:ring-4 focus:ring-brand-green/15 focus:border-brand-green min-h-[48px]";

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...rest} />;
}

export function Textarea({
  className,
  rows = 3,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldBase, "min-h-[96px] resize-y", className)}
      {...rest}
    />
  );
}

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted"
    >
      <span>{children}</span>
      {hint ? (
        <span className="font-medium normal-case tracking-normal text-ink-faint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function Field({
  children,
  label,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  label: string;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} hint={hint}>
        {label}
      </Label>
      {children}
    </div>
  );
}
