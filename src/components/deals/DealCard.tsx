import Image from "next/image";
import Link from "next/link";

import { Badge, DiscountChip } from "@/components/ui/badge";
import { PriceTag } from "@/components/pricing/PriceTag";
import { StarRating } from "@/components/trust/StarRating";
import {
  VerifiedBadge,
  isVerifiedVendor,
} from "@/components/trust/VerifiedBadge";
import {
  discountPercent,
  formatPickupDay,
  formatPickupWindow,
} from "@/lib/format";
import type { DealWithVendor } from "@/lib/types";

/**
 * Large deal card for the main browse list. Optimised for mobile: full-width
 * image hero with floating discount chip + scarcity badge, tight meta row,
 * prominent price and vendor rating.
 */
export function DealCard({ deal }: { deal: DealWithVendor }) {
  const remaining = deal.quantityTotal - deal.quantitySold;
  const pct = discountPercent(deal.originalPrice, deal.discountedPrice);
  const soldOut = deal.status !== "ACTIVE" || remaining <= 0;

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-card transition-all active:scale-[.995] hover:shadow-float"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-surface-muted">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            quality={72}
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="shimmer absolute inset-0" />
        )}

        {/* Top-left badges: discount + scarcity */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {pct > 0 ? <DiscountChip percent={pct} size="md" /> : null}
          {!soldOut && remaining <= 3 ? (
            <Badge tone="yellow-solid" size="md">
              Only {remaining} left
            </Badge>
          ) : null}
        </div>

        {/* Top-right: rating pill */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-ink shadow-soft">
            <StarRating
              value={deal.vendor.rating}
              count={deal.vendor.ratingCount}
              showCount={false}
              size="sm"
            />
          </span>
        </div>

        {/* Sold-out veil */}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink">
              Sold out
            </span>
          </div>
        ) : null}

        {/* Bottom gradient + pickup pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-soft backdrop-blur">
            <ClockIcon />
            {formatPickupDay(deal.pickupStart)} ·{" "}
            {formatPickupWindow(deal.pickupStart, deal.pickupEnd)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-muted">
          <span className="inline-flex min-w-0 items-center gap-1">
            <span className="truncate font-semibold text-ink">
              {deal.vendor.businessName}
            </span>
            {isVerifiedVendor(deal.vendor) ? (
              <VerifiedBadge size="xs" />
            ) : null}
          </span>
          <span aria-hidden className="text-ink-faint">
            •
          </span>
          <span className="truncate">{deal.vendor.address.split(",")[0]}</span>
        </div>

        <h3 className="line-clamp-1 text-[17px] font-extrabold leading-tight text-ink">
          {deal.title}
        </h3>

        <PriceTag
          original={deal.originalPrice}
          discounted={deal.discountedPrice}
          size="lg"
          layout="inline"
          savingsShow="percent"
          savingsTone="soft"
          className="mt-3"
        />
      </div>
    </Link>
  );
}

/**
 * Compact horizontal card, used in featured rails on the home page.
 */
export function CompactDealCard({ deal }: { deal: DealWithVendor }) {
  const pct = discountPercent(deal.originalPrice, deal.discountedPrice);
  const remaining = deal.quantityTotal - deal.quantitySold;
  const soldOut = deal.status !== "ACTIVE" || remaining <= 0;

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="group block w-[260px] shrink-0 overflow-hidden rounded-3xl bg-white shadow-card transition-all active:scale-[.99] hover:shadow-float"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            sizes="220px"
            quality={72}
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="shimmer absolute inset-0" />
        )}
        <div className="absolute left-2.5 top-2.5">
          {pct > 0 ? <DiscountChip percent={pct} size="sm" /> : null}
        </div>
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              Sold out
            </span>
          </div>
        ) : null}
      </div>
      <div className="p-3.5">
        <div className="mb-1 flex min-w-0 items-center gap-1 text-[11px] text-ink-muted">
          <span className="truncate font-semibold text-ink">
            {deal.vendor.businessName}
          </span>
          {isVerifiedVendor(deal.vendor) ? <VerifiedBadge size="xs" /> : null}
          <span className="ml-auto inline-flex shrink-0 items-center">
            <StarRating
              value={deal.vendor.rating}
              count={deal.vendor.ratingCount}
              showCount={false}
              size="sm"
            />
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-ink">
          {deal.title}
        </h3>
        <PriceTag
          original={deal.originalPrice}
          discounted={deal.discountedPrice}
          size="md"
          layout="stacked"
          savingsShow="percent"
          savingsTone="soft"
          className="mt-2"
        />
      </div>
    </Link>
  );
}

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
