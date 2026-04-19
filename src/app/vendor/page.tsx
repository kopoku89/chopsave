import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { StatTile } from "@/components/shared/StatTile";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { VendorStatusBanner } from "@/components/vendor/StatusBanner";
import { VerifiedBadge } from "@/components/trust/VerifiedBadge";
import { dealsRepo, ordersRepo, statsRepo } from "@/lib/db";
import { formatGHS, formatRelativeTime } from "@/lib/format";
import { getCurrentVendor } from "@/lib/session";

export default function VendorDashboardPage() {
  const { vendor } = getCurrentVendor();
  const summary = statsRepo.vendorSummary(vendor.id);
  const recentOrders = ordersRepo.list({ vendorId: vendor.id }).slice(0, 4);
  const activeDeals = dealsRepo
    .list({ vendorId: vendor.id })
    .filter((d) => d.status === "ACTIVE")
    .slice(0, 3);

  return (
    <AppShell role="VENDOR" className="bg-surface-cream">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero px-5 pb-10 pt-5 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          {vendor.logoUrl ? (
            <Image
              src={vendor.logoUrl}
              alt={vendor.businessName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/60"
            />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-white/30" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
              Vendor dashboard
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-lg font-extrabold">
                {vendor.businessName}
              </span>
              {vendor.status === "APPROVED" ? (
                <VerifiedBadge size="sm" className="ring-2 ring-white/60" />
              ) : null}
            </div>
            {vendor.status === "APPROVED" && vendor.ratingCount > 0 ? (
              <div className="mt-0.5 text-xs font-semibold text-white/85">
                {vendor.rating.toFixed(1)} ★ · {vendor.ratingCount} reviews
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="space-y-5 px-5 pt-5 pb-8">
        {/* Status banner — explicit "where am I?" for the vendor. */}
        <VendorStatusBanner
          status={vendor.status}
          businessName={vendor.businessName}
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Revenue"
            value={formatGHS(summary.revenuePesewas)}
            tone="green"
          />
          <StatTile
            label="Meals rescued"
            value={summary.mealsRescued}
            tone="orange"
          />
          <StatTile
            label="Active deals"
            value={summary.activeDeals}
            tone="yellow"
          />
          <StatTile label="Pending pickups" value={summary.pendingPickups} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/vendor/listings/new">
            <Button fullWidth size="lg">
              + New deal
            </Button>
          </Link>
          <Link href="/vendor/orders">
            <Button fullWidth size="lg" variant="outline">
              View orders
            </Button>
          </Link>
        </div>

        {/* Active deals */}
        <section>
          <SectionHeader title="Active deals" href="/vendor/listings" />
          {activeDeals.length === 0 ? (
            <EmptyRow message="No active deals. Create one to start rescuing food." />
          ) : (
            <div className="space-y-2.5">
              {activeDeals.map((d) => {
                const remaining = d.quantityTotal - d.quantitySold;
                const pct = Math.round(
                  ((d.originalPrice - d.discountedPrice) / d.originalPrice) *
                    100,
                );
                return (
                  <Link
                    key={d.id}
                    href="/vendor/listings"
                    className="flex gap-3 rounded-2xl border border-surface-border bg-white p-3 shadow-soft transition hover:shadow-card"
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                      {d.imageUrl ? (
                        <Image
                          src={d.imageUrl}
                          alt={d.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-ink">
                        {d.title}
                      </div>
                      <div className="text-xs text-ink-muted">
                        {d.quantitySold}/{d.quantityTotal} sold
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold tabular text-brand-green">
                          {formatGHS(d.discountedPrice)}
                        </span>
                        <span className="text-[11px] text-ink-faint line-through tabular">
                          {formatGHS(d.originalPrice)}
                        </span>
                        {pct > 0 ? (
                          <span className="rounded-full bg-brand-orange-soft px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-orange-dark">
                            −{pct}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 self-center">
                      <Badge tone={remaining <= 3 ? "yellow" : "green"}>
                        {remaining} left
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent orders */}
        <section>
          <SectionHeader title="Recent orders" href="/vendor/orders" />
          {recentOrders.length === 0 ? (
            <EmptyRow message="No orders yet." />
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/vendor/orders"
                  className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-3 shadow-soft transition hover:shadow-card"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-ink">
                      {o.deal.title}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {o.customerName} · {formatRelativeTime(o.createdAt)}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-sm font-extrabold tabular text-ink">
                      {formatGHS(o.totalAmount)}
                    </div>
                    <div className="mt-1">
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green"
        >
          Manage →
        </Link>
      ) : null}
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-surface-border bg-white/60 px-4 py-6 text-center text-xs text-ink-muted">
      {message}
    </p>
  );
}
