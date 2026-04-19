import { cn } from "@/lib/utils";
import type { Vendor, VendorStatus } from "@/lib/types";

/**
 * A vendor is "verified" once ChopSave admins have approved them. Vendors in
 * any other state are either unverified (PENDING) or untrusted (SUSPENDED /
 * REJECTED) and should NOT be shown with a verified mark.
 */
export function isVerifiedVendor(
  input: Pick<Vendor, "status"> | VendorStatus,
): boolean {
  const status = typeof input === "string" ? input : input.status;
  return status === "APPROVED";
}

type Size = "xs" | "sm" | "md";

/**
 * "Verified Vendor" mark. Defaults to a compact icon-only tick so it can sit
 * tight against a vendor name. Pass `variant="pill"` for a labelled pill on
 * surfaces that need a little more explanation (like the deal detail page).
 */
export function VerifiedBadge({
  size = "sm",
  variant = "icon",
  className,
  label = "Verified vendor",
}: {
  size?: Size;
  variant?: "icon" | "pill";
  className?: string;
  label?: string;
}) {
  const px = size === "xs" ? 12 : size === "sm" ? 14 : 16;

  if (variant === "icon") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-brand-green text-white",
          size === "xs" && "h-3.5 w-3.5",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-5 w-5",
          className,
        )}
        aria-label={label}
        title={label}
      >
        <CheckIcon size={px - 4} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-green-soft px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-green",
        className,
      )}
      aria-label={label}
    >
      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-green text-white">
        <CheckIcon size={9} />
      </span>
      Verified
    </span>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
