import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { SavingsBadge } from "@/components/pricing/SavingsBadge";
import { ordersRepo } from "@/lib/db";
import { formatGHS, formatRelativeTime } from "@/lib/format";
import { DEFAULT_CUSTOMER_ID } from "@/lib/session";

export default function OrdersPage() {
  const orders = ordersRepo.list({ customerId: DEFAULT_CUSTOMER_ID });

  return (
    <AppShell role="CUSTOMER" className="bg-surface-cream">
      <TopBar title="My orders" subtitle={`${orders.length} total`} />
      <div className="space-y-3 p-5 pb-8">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Find a deal and reserve your first rescued meal."
            action={
              <Link href="/deals">
                <Button>Browse deals</Button>
              </Link>
            }
          />
        ) : (
          orders.map((order) => {
            const originalTotal = order.deal.originalPrice * order.quantity;
            const savings = originalTotal - order.totalAmount;
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-3xl border border-surface-border bg-white p-4 shadow-card transition active:scale-[.995] hover:shadow-float"
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-muted">
                    {order.deal.imageUrl ? (
                      <Image
                        src={order.deal.imageUrl}
                        alt={order.deal.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                          {order.vendor.businessName}
                        </div>
                        <h3 className="line-clamp-1 text-sm font-extrabold text-ink">
                          {order.deal.title}
                        </h3>
                        <div className="mt-0.5 text-xs text-ink-muted">
                          {order.quantity} ×{" "}
                          <span className="tabular font-semibold text-ink">
                            {formatGHS(order.unitPrice)}
                          </span>{" "}
                          · {formatRelativeTime(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          {savings > 0 ? (
                            <span className="text-[11px] text-ink-faint line-through tabular">
                              {formatGHS(originalTotal)}
                            </span>
                          ) : null}
                          <span className="text-sm font-extrabold tabular text-ink">
                            {formatGHS(order.totalAmount)}
                          </span>
                        </div>
                        <div className="mt-1 flex justify-end">
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center justify-between rounded-2xl bg-brand-green-soft px-3.5 py-2.5 text-xs">
                    <span className="font-bold uppercase tracking-wider text-brand-green-ink">
                      Pickup code
                    </span>
                    <span className="font-mono text-sm font-black tracking-[0.15em] text-brand-green">
                      {order.pickupCode}
                    </span>
                  </div>
                  {savings > 0 ? (
                    <SavingsBadge
                      original={originalTotal}
                      discounted={order.totalAmount}
                      show="percent"
                      tone="soft"
                      size="sm"
                    />
                  ) : null}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
