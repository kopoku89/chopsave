import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { SavingsBadge } from "@/components/pricing/SavingsBadge";
import { ordersRepo } from "@/lib/db";
import {
  discountPercent,
  formatGHS,
  formatPickupDay,
  formatPickupWindow,
} from "@/lib/format";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = ordersRepo.findById(id);
  if (!order) notFound();

  const originalTotal = order.deal.originalPrice * order.quantity;
  const savings = originalTotal - order.totalAmount;
  const pct = discountPercent(order.deal.originalPrice, order.deal.discountedPrice);
  const firstName = order.customerName.split(" ")[0];

  return (
    <AppShell role="CUSTOMER" showNav={false} className="bg-surface-cream">
      <TopBar title="Order confirmed" back="/orders" />

      <div className="space-y-5 px-5 pb-10 pt-4">
        {/* Celebration card */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-hero px-5 pb-6 pt-6 text-center text-white shadow-pop">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-yellow/25 blur-2xl" />

          <div className="relative mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-green shadow-pop">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="relative text-xl font-extrabold">
            Nice one, {firstName}!
          </h1>
          <p className="relative mx-auto mt-1 max-w-[28ch] text-sm text-white/90">
            Show this pickup code to the vendor when you arrive.
          </p>

          {/* Pickup code card */}
          <div className="relative mx-auto mt-5 inline-block rounded-3xl bg-white px-8 py-5 shadow-pop ring-1 ring-black/5">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-muted">
              Pickup code
            </div>
            <div className="mt-1 font-mono text-[38px] font-black tracking-[0.18em] leading-none text-brand-green">
              {order.pickupCode}
            </div>
            {savings > 0 ? (
              <div className="mt-2 flex items-center justify-center">
                <SavingsBadge
                  original={originalTotal}
                  discounted={order.totalAmount}
                  show="both"
                  tone="solid"
                  size="sm"
                />
              </div>
            ) : null}
          </div>

          <div className="relative mt-4 text-[11px] font-semibold text-white/85">
            Order #{order.id.slice(-6).toUpperCase()}
          </div>
        </section>

        {/* Deal summary */}
        <section className="rounded-3xl border border-surface-border bg-white p-4 shadow-card">
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
                  <div className="line-clamp-2 text-sm font-extrabold text-ink">
                    {order.deal.title}
                  </div>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {order.vendor.address}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetaTile
              icon={<CalendarIcon />}
              label="Pickup day"
              value={formatPickupDay(order.deal.pickupStart)}
            />
            <MetaTile
              icon={<ClockIcon />}
              label="Window"
              value={formatPickupWindow(
                order.deal.pickupStart,
                order.deal.pickupEnd,
              )}
            />
            <MetaTile
              icon={<BagIcon />}
              label="Quantity"
              value={`${order.quantity} ${order.quantity === 1 ? "meal" : "meals"}`}
            />
            <MetaTile
              icon={<WalletIcon />}
              label="Payment"
              value={order.payment.replace(/_/g, " ").toLowerCase()}
            />
          </div>
        </section>

        {/* Totals */}
        <section className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-card">
          <div className="space-y-1 px-4 pt-4">
            <SummaryRow
              label="Original price"
              value={formatGHS(originalTotal)}
              strikethrough
              muted
            />
            <SummaryRow
              label={`Deal discount (−${pct}%)`}
              value={`− ${formatGHS(savings)}`}
              highlight
            />
          </div>
          <div className="mt-3 border-t border-dashed border-surface-border px-4 py-3">
            <SummaryRow
              label="Total paid"
              value={formatGHS(order.totalAmount)}
              strong
            />
          </div>
          {savings > 0 ? (
            <div className="flex items-center justify-between bg-brand-orange-soft px-4 py-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-brand-orange-dark">
                  You saved
                </div>
                <div className="text-lg font-extrabold tabular text-brand-orange-dark">
                  {formatGHS(savings)}
                </div>
              </div>
              <SavingsBadge
                original={originalTotal}
                discounted={order.totalAmount}
                show="percent"
                tone="solid"
                size="md"
              />
            </div>
          ) : null}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/deals">
            <Button variant="outline" fullWidth size="lg">
              Keep browsing
            </Button>
          </Link>
          <Link href="/orders">
            <Button fullWidth size="lg">
              My orders
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function MetaTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-surface-border bg-surface-cream px-3 py-2.5">
      <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </div>
        <div className="truncate text-sm font-extrabold capitalize text-ink">
          {value}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong,
  highlight,
  muted,
  strikethrough,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
  muted?: boolean;
  strikethrough?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between py-1 text-sm " +
        (muted ? "text-ink-muted" : "text-ink")
      }
    >
      <span className="font-medium">{label}</span>
      <span
        className={
          "tabular " +
          (strong ? "text-lg font-extrabold " : "font-extrabold ") +
          (highlight ? "text-brand-orange-dark " : "") +
          (strikethrough ? "line-through" : "")
        }
      >
        {value}
      </span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7h14l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M16 13h3" />
    </svg>
  );
}
