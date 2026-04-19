import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { StatTile } from "@/components/shared/StatTile";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ordersRepo, statsRepo, vendorsRepo } from "@/lib/db";
import { formatGHS, formatRelativeTime } from "@/lib/format";

export default function AdminOverviewPage() {
  const stats = statsRepo.platformSummary();
  const pendingVendors = vendorsRepo.list({ status: "PENDING" });
  const recentOrders = ordersRepo.list().slice(0, 5);

  return (
    <AppShell role="ADMIN" className="bg-surface-cream">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero px-5 pb-10 pt-5 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
          ChopSave · Admin
        </div>
        <h1 className="mt-1 text-[22px] font-extrabold leading-tight">
          Platform overview
        </h1>
        <p className="mt-2 max-w-[30ch] text-sm text-white/90">
          Monitor vendors, approve new sellers and track the impact in real time.
        </p>
      </section>

      <div className="space-y-6 px-5 pt-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Revenue"
            value={formatGHS(stats.revenuePesewas)}
            tone="green"
          />
          <StatTile
            label="Meals rescued"
            value={stats.mealsRescued}
            tone="orange"
          />
          <StatTile
            label="Active deals"
            value={stats.activeDeals}
            tone="yellow"
          />
          <StatTile
            label="Pending vendors"
            value={stats.vendorsPending}
            hint={`${stats.vendorsApproved} approved`}
          />
        </div>

        <section>
          <SectionHeader
            title="Vendors awaiting approval"
            href="/admin/vendors"
          />
          {pendingVendors.length === 0 ? (
            <EmptyRow message="No vendors waiting. Nice work." />
          ) : (
            <div className="space-y-2.5">
              {pendingVendors.map((v) => (
                <Link
                  key={v.id}
                  href="/admin/vendors"
                  className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-3 shadow-soft transition hover:shadow-card"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-ink">
                      {v.businessName}
                    </div>
                    <div className="truncate text-xs text-ink-muted">
                      {v.address}
                    </div>
                  </div>
                  <Badge tone="yellow">Pending</Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Recent orders" href="/admin/orders" />
          <div className="space-y-2.5">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-3 shadow-soft"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-ink">
                    {o.deal.title}
                  </div>
                  <div className="truncate text-xs text-ink-muted">
                    {o.vendor.businessName} · {formatRelativeTime(o.createdAt)}
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
              </div>
            ))}
          </div>
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
          View all →
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
