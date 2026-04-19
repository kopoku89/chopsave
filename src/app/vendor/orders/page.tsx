import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { TabBar, TabChip } from "@/components/shared/TabChip";
import { ordersRepo } from "@/lib/db";
import { formatGHS, formatRelativeTime } from "@/lib/format";
import { getCurrentVendor } from "@/lib/session";
import type { OrderStatus, OrderWithRelations } from "@/lib/types";

import { updateOrderStatus } from "./actions";

type SearchParams = Promise<{ status?: string }>;

const TABS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PAID", label: "New" },
  { value: "READY_FOR_PICKUP", label: "Ready" },
  { value: "COMPLETED", label: "Done" },
];

export default async function VendorOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { vendor } = getCurrentVendor();
  const { status: filter } = await searchParams;
  const normalised = (filter ?? "ALL") as OrderStatus | "ALL";

  const all = ordersRepo.list({ vendorId: vendor.id });
  const counts: Record<OrderStatus | "ALL", number> = {
    ALL: all.length,
    PAID: all.filter((o) => o.status === "PAID").length,
    READY_FOR_PICKUP: all.filter((o) => o.status === "READY_FOR_PICKUP").length,
    COMPLETED: all.filter((o) => o.status === "COMPLETED").length,
    PENDING: all.filter((o) => o.status === "PENDING").length,
    CANCELLED: all.filter((o) => o.status === "CANCELLED").length,
  };

  const orders =
    normalised === "ALL"
      ? all
      : all.filter((o) => o.status === normalised);

  return (
    <AppShell role="VENDOR" className="bg-surface-cream">
      <TopBar title="Orders" subtitle="Pickup queue" />

      <div className="px-5 pt-4">
        <TabBar>
          {TABS.map((t) => (
            <TabChip
              key={t.value}
              href={`/vendor/orders${t.value === "ALL" ? "" : `?status=${t.value}`}`}
              label={t.label}
              active={t.value === normalised}
              count={counts[t.value]}
            />
          ))}
        </TabBar>
      </div>

      <div className="space-y-3 p-5 pb-8">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders in this tab"
            description="When customers reserve one of your deals, they'll appear here."
          />
        ) : (
          orders.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>
    </AppShell>
  );
}

function OrderRow({ order }: { order: OrderWithRelations }) {
  return (
    <div className="rounded-3xl border border-surface-border bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            {formatRelativeTime(order.createdAt)} · #{order.id.slice(-6).toUpperCase()}
          </div>
          <h3 className="line-clamp-1 text-sm font-extrabold text-ink">
            {order.deal.title}
          </h3>
          <div className="mt-0.5 text-xs text-ink-muted">
            {order.customerName} · {order.customerPhone}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-extrabold tabular text-ink">
            {formatGHS(order.totalAmount)}
          </div>
          <div className="mt-1">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-brand-green-soft px-3.5 py-2.5 text-xs">
        <span className="font-bold uppercase tracking-wider text-brand-green-ink">
          Qty {order.quantity} · Pickup code
        </span>
        <span className="font-mono text-sm font-black tracking-[0.15em] text-brand-green">
          {order.pickupCode}
        </span>
      </div>

      {order.notes ? (
        <div className="mt-2 rounded-2xl bg-brand-yellow-soft px-3.5 py-2.5 text-xs font-medium text-[#7A5A00]">
          <span className="font-extrabold uppercase tracking-wider">Note:</span>{" "}
          {order.notes}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {order.status === "PAID" || order.status === "PENDING" ? (
          <StatusForm
            orderId={order.id}
            next="READY_FOR_PICKUP"
            label="Mark ready"
          />
        ) : null}
        {order.status === "READY_FOR_PICKUP" ? (
          <StatusForm
            orderId={order.id}
            next="COMPLETED"
            label="Mark picked up"
          />
        ) : null}
        {order.status !== "COMPLETED" && order.status !== "CANCELLED" ? (
          <StatusForm
            orderId={order.id}
            next="CANCELLED"
            label="Cancel"
            variant="ghost"
          />
        ) : null}
      </div>
    </div>
  );
}

function StatusForm({
  orderId,
  next,
  label,
  variant = "primary",
}: {
  orderId: string;
  next: OrderStatus;
  label: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={next} />
      <Button size="md" variant={variant === "ghost" ? "outline" : "primary"}>
        {label}
      </Button>
    </form>
  );
}
