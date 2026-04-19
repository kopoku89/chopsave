import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Badge, DiscountChip } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/pricing/PriceTag";
import { StarRating } from "@/components/trust/StarRating";
import {
  VerifiedBadge,
  isVerifiedVendor,
} from "@/components/trust/VerifiedBadge";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { dealsRepo } from "@/lib/db";
import {
  discountPercent,
  formatGHS,
  formatPickupDay,
  formatPickupWindow,
} from "@/lib/format";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = dealsRepo.findById(id);
  if (!deal) notFound();

  const remaining = deal.quantityTotal - deal.quantitySold;
  const pct = discountPercent(deal.originalPrice, deal.discountedPrice);
  const soldOut = deal.status !== "ACTIVE" || remaining <= 0;

  return (
    <AppShell role="CUSTOMER" showNav={false} className="bg-surface-cream">
      <TopBar title="" back="/deals" tone="transparent" floating />

      {/* HERO IMAGE */}
      <div className="relative h-[300px] w-full bg-surface-muted">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            quality={78}
            className="object-cover"
            priority
            fetchPriority="high"
          />
        ) : (
          <div className="shimmer absolute inset-0" />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent"
        />

        <div className="absolute left-5 top-20 flex flex-col gap-2">
          {pct > 0 ? <DiscountChip percent={pct} size="lg" /> : null}
          {!soldOut && remaining <= 3 ? (
            <Badge tone="yellow-solid" size="md">
              Only {remaining} left
            </Badge>
          ) : null}
          {soldOut ? (
            <Badge tone="dark" size="md">
              Sold out
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Content sheet */}
      <div className="relative -mt-5 rounded-t-[28px] bg-surface-cream pb-36">
        <div
          aria-hidden
          className="mx-auto mt-2 h-1 w-10 rounded-full bg-surface-border-strong"
        />

        <div className="space-y-6 px-5 pt-4">
          {/* Title + price */}
          <div>
            <div className="flex min-w-0 items-center gap-2">
              {deal.vendor.logoUrl ? (
                <Image
                  src={deal.vendor.logoUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : null}
              <span className="truncate text-sm font-bold text-ink">
                {deal.vendor.businessName}
              </span>
              {isVerifiedVendor(deal.vendor) ? (
                <VerifiedBadge size="sm" />
              ) : null}
            </div>

            <div className="mt-1.5">
              <StarRating
                value={deal.vendor.rating}
                count={deal.vendor.ratingCount}
                size="md"
              />
            </div>

            <h1 className="mt-2 text-[26px] font-extrabold leading-tight text-ink balance">
              {deal.title}
            </h1>

            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
                  You pay
                </span>
              </div>
              <PriceTag
                original={deal.originalPrice}
                discounted={deal.discountedPrice}
                size="xl"
                layout="hero"
                savingsShow="both"
                savingsTone="solid"
              />
            </div>
          </div>

          {/* Short reassurance — answers the "is this old food?" question. */}
          <TrustStrip
            message="Prepared today. Unsold, not expired."
            sub="Chilled or kept hot until pickup."
          />

          {/* Compact pickup strip — replaces the old 4-tile grid */}
          <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-soft">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green">
              <ClockIcon />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                Pickup
              </div>
              <div className="truncate text-sm font-extrabold text-ink">
                {formatPickupDay(deal.pickupStart)} ·{" "}
                {formatPickupWindow(deal.pickupStart, deal.pickupEnd)}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                Left
              </div>
              <div className="text-sm font-extrabold tabular text-ink">
                {soldOut ? "0" : remaining}/{deal.quantityTotal}
              </div>
            </div>
          </div>

          {/* About */}
          <section>
            <h2 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
              About this deal
            </h2>
            <p className="text-[15px] leading-relaxed text-ink">
              {deal.description}
            </p>
          </section>

          {/* Pickup location */}
          <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green">
                <PinIcon />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                  Pickup location
                </div>
                <div className="text-sm font-extrabold text-ink">
                  {deal.vendor.address}
                </div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  {deal.vendor.city} · {deal.vendor.phone}
                </div>
              </div>
            </div>
          </section>

          {/* Tags */}
          {deal.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {deal.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-brand-green-soft px-3 py-1 text-xs font-bold text-brand-green"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Sticky action bar */}
      <div
        className="sticky bottom-0 z-20 border-t border-surface-border bg-white px-5 pt-3"
        style={{ paddingBottom: "max(var(--safe-bottom), 14px)" }}
      >
        {soldOut ? (
          <Button fullWidth size="xl" disabled>
            Sold out
          </Button>
        ) : (
          <Link href={`/checkout/${deal.id}`} className="block">
            <Button fullWidth size="xl" trailing={<ArrowRight />}>
              <span className="tabular">Reserve · {formatGHS(deal.discountedPrice)}</span>
              {pct > 0 ? (
                <span className="ml-1 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  −{pct}%
                </span>
              ) : null}
            </Button>
          </Link>
        )}
      </div>
    </AppShell>
  );
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
