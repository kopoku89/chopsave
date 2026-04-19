import { cn } from "@/lib/utils";
import type { VendorStatus } from "@/lib/types";

/**
 * Vendor-facing status banner. Tells the vendor, at a glance:
 *  - where they are in the onboarding flow (PENDING), or
 *  - that they are live and verified (APPROVED), or
 *  - that their listing privileges have been limited (SUSPENDED / REJECTED).
 *
 * Designed to sit right under the top bar / greeting, not to replace the small
 * inline badge that appears in lists. Tone is informative, never alarming.
 */
export function VendorStatusBanner({
  status,
  businessName,
  className,
}: {
  status: VendorStatus;
  businessName?: string;
  className?: string;
}) {
  const config = configFor(status, businessName);

  return (
    <section
      role={status === "APPROVED" ? "status" : "note"}
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-3xl border px-4 py-3.5 shadow-soft",
        config.container,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl",
          config.iconWrap,
        )}
      >
        {config.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={cn("text-sm font-extrabold", config.titleCls)}>
            {config.title}
          </h2>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
              config.pill,
            )}
          >
            {config.pillLabel}
          </span>
        </div>
        <p className={cn("mt-1 text-[13px] leading-snug", config.bodyCls)}>
          {config.body}
        </p>
        {config.checklist ? (
          <ul className="mt-2 space-y-1 text-[12px]">
            {config.checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full",
                    c.done
                      ? "bg-brand-green text-white"
                      : "border border-current text-ink-faint",
                  )}
                >
                  {c.done ? (
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    c.done ? "text-ink line-through decoration-ink/30" : "text-ink",
                  )}
                >
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function configFor(status: VendorStatus, businessName?: string) {
  switch (status) {
    case "APPROVED":
      return {
        container: "border-brand-green/20 bg-brand-green-soft",
        iconWrap: "bg-brand-green text-white",
        titleCls: "text-brand-green-ink",
        bodyCls: "text-brand-green-ink/90",
        pill: "bg-brand-green text-white",
        pillLabel: "Verified",
        title: businessName
          ? `You're live, ${businessName}`
          : "You're a verified ChopSave vendor",
        body: "Your store is visible to customers and you can publish deals.",
        icon: <ShieldCheckIcon />,
      } as const;

    case "PENDING":
      return {
        container: "border-brand-yellow/40 bg-brand-yellow-soft",
        iconWrap: "bg-brand-yellow text-[#5A4200]",
        titleCls: "text-[#5A4200]",
        bodyCls: "text-[#5A4200]/85",
        pill: "bg-[#5A4200] text-white",
        pillLabel: "Pending",
        title: "Verification in progress",
        body: "Our team is reviewing your business. You can draft listings now — they'll go live the moment you're approved.",
        icon: <ClockIcon />,
        checklist: [
          { label: "Account created", done: true },
          { label: "Business details submitted", done: true },
          { label: "Awaiting admin review", done: false },
        ],
      } as const;

    case "SUSPENDED":
      return {
        container: "border-red-200 bg-red-50",
        iconWrap: "bg-red-600 text-white",
        titleCls: "text-red-800",
        bodyCls: "text-red-800/85",
        pill: "bg-red-600 text-white",
        pillLabel: "Suspended",
        title: "Listings paused",
        body: "Your store is temporarily hidden from customers. Please contact support to resolve.",
        icon: <PauseIcon />,
      } as const;

    case "REJECTED":
      return {
        container: "border-surface-border bg-surface-muted",
        iconWrap: "bg-ink text-white",
        titleCls: "text-ink",
        bodyCls: "text-ink-muted",
        pill: "bg-ink text-white",
        pillLabel: "Not approved",
        title: "Application not approved",
        body: "Please contact support@chopsave.gh to reapply.",
        icon: <InfoIcon />,
      } as const;
  }
}

function ShieldCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l8 3v6c0 5-3.5 8.3-8 9-4.5-.7-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}
