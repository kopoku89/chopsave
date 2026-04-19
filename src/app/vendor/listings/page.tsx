import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { PriceTag } from "@/components/pricing/PriceTag";
import { dealsRepo } from "@/lib/db";
import { discountPercent, formatPickupDay } from "@/lib/format";
import { getCurrentVendor } from "@/lib/session";
import type { DealStatus } from "@/lib/types";

export default function VendorListingsPage() {
  const { vendor } = getCurrentVendor();
  const deals = dealsRepo.list({ vendorId: vendor.id });

  return (
    <AppShell role="VENDOR" className="bg-surface-cream">
      <TopBar
        title="My listings"
        subtitle={`${deals.length} total`}
        right={
          <Link href="/vendor/listings/new">
            <Button size="sm">+ New</Button>
          </Link>
        }
      />

      <div className="space-y-3 p-5 pb-8">
        {deals.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first deal to start selling surplus food."
            action={
              <Link href="/vendor/listings/new">
                <Button>Create deal</Button>
              </Link>
            }
          />
        ) : (
          deals.map((deal) => {
            const pct = discountPercent(deal.originalPrice, deal.discountedPrice);
            return (
              <div
                key={deal.id}
                className="flex gap-3 rounded-3xl border border-surface-border bg-white p-3 shadow-card"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-muted">
                  {deal.imageUrl ? (
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : null}
                  {pct > 0 ? (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-extrabold text-white shadow-soft">
                      −{pct}%
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-extrabold text-ink">
                      {deal.title}
                    </h3>
                    <StatusBadge status={deal.status} />
                  </div>
                  <div className="mt-0.5 text-xs text-ink-muted">
                    {formatPickupDay(deal.pickupStart)} ·{" "}
                    {deal.quantitySold}/{deal.quantityTotal} sold
                  </div>
                  <PriceTag
                    original={deal.originalPrice}
                    discounted={deal.discountedPrice}
                    size="md"
                    layout="inline"
                    savingsShow="percent"
                    savingsTone="soft"
                    className="mt-2"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: DealStatus }) {
  const map: Record<
    DealStatus,
    { label: string; tone: Parameters<typeof Badge>[0]["tone"] }
  > = {
    ACTIVE: { label: "Active", tone: "green" },
    DRAFT: { label: "Draft", tone: "neutral" },
    SOLD_OUT: { label: "Sold out", tone: "orange" },
    EXPIRED: { label: "Expired", tone: "red" },
    ARCHIVED: { label: "Archived", tone: "neutral" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}
