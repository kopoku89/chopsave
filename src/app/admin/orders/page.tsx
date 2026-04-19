import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { TabBar, TabChip } from "@/components/shared/TabChip";
import { ordersRepo } from "@/lib/db";
import { formatGHS, formatRelativeTime } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

type SearchParams = Promise<{ status?: string }>;

const TABS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PAID", label: "Paid" },
  { value: "READY_FOR_PICKUP", label: "Ready" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const normalised = (status ?? "ALL") as OrderStatus | "ALL";

  const all = ordersRepo.list();
  const counts: Record<OrderStatus | "ALL", number> = {
    ALL: all.length,
    PAID: all.filter((o) => o.status === "PAID").length,
    READY_FOR_PICKUP: all.filter((o) => o.status === "READY_FOR_PICKUP").length,
    COMPLETED: all.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: all.filter((o) => o.status === "CANCELLED").length,
    PENDING: all.filter((o) => o.status === "PENDING").length,
  };

  const orders =
    normalised === "ALL"
      ? all
      : all.filter((o) => o.status === normalised);

  return (
    <AppShell role="ADMIN" className="bg-surface-cream">
      <TopBar title="All orders" subtitle={`${orders.length} shown`} />

      <div className="px-5 pt-4">
        <TabBar>
          {TABS.map((t) => (
            <TabChip
              key={t.value}
              href={`/admin/orders${t.value === "ALL" ? "" : `?status=${t.value}`}`}
              label={t.label}
              active={t.value === normalised}
              count={counts[t.value]}
            />
          ))}
        </TabBar>
      </div>

      <div className="space-y-3 p-5 pb-8">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-3xl border border-surface-border bg-white p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {formatRelativeTime(o.createdAt)} · #
                  {o.id.slice(-6).toUpperCase()}
                </div>
                <h3 className="truncate text-sm font-extrabold text-ink">
                  {o.deal.title}
                </h3>
                <div className="truncate text-xs text-ink-muted">
                  {o.vendor.businessName} → {o.customerName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold tabular text-ink">
                  {formatGHS(o.totalAmount)}
                </div>
                <div className="mt-1">
                  <OrderStatusBadge status={o.status} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface-cream px-3.5 py-2.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-ink-muted">
                Qty {o.quantity} · Pickup code
              </span>
              <span className="font-mono text-sm font-black tracking-[0.15em] text-ink">
                {o.pickupCode}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
