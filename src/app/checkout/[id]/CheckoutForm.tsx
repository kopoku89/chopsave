"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { PriceTag } from "@/components/pricing/PriceTag";
import { SavingsBadge } from "@/components/pricing/SavingsBadge";
import type { DealWithVendor, PaymentMethod } from "@/lib/types";
import { discountPercent, formatGHS } from "@/lib/format";

import { placeOrder, type CheckoutState } from "./actions";

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  hint: string;
  emoji: string;
}[] = [
  {
    value: "MOBILE_MONEY",
    label: "Mobile Money",
    hint: "MTN, Telecel, AirtelTigo",
    emoji: "📱",
  },
  {
    value: "CARD",
    label: "Card",
    hint: "Visa, Mastercard",
    emoji: "💳",
  },
  {
    value: "CASH_ON_PICKUP",
    label: "Pay on pickup",
    hint: "Cash at vendor",
    emoji: "💵",
  },
];

export function CheckoutForm({
  deal,
  defaultName,
  defaultPhone,
}: {
  deal: DealWithVendor;
  defaultName: string;
  defaultPhone: string;
}) {
  const initial: CheckoutState = {};
  const [state, formAction] = useActionState(placeOrder, initial);
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState<PaymentMethod>("MOBILE_MONEY");

  const remaining = deal.quantityTotal - deal.quantitySold;
  const max = Math.min(5, remaining);
  const subtotal = deal.discountedPrice * quantity;
  const originalSubtotal = deal.originalPrice * quantity;
  const savings = originalSubtotal - subtotal;
  const pct = discountPercent(deal.originalPrice, deal.discountedPrice);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="dealId" value={deal.id} />

      {/* Order line */}
      <section className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-card">
        <div className="flex gap-3 p-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-muted">
            {deal.imageUrl ? (
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {deal.vendor.businessName}
            </div>
            <div className="line-clamp-2 text-sm font-extrabold leading-tight text-ink">
              {deal.title}
            </div>
            <PriceTag
              original={deal.originalPrice}
              discounted={deal.discountedPrice}
              size="md"
              layout="stacked"
              savingsShow="percent"
              savingsTone="soft"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-surface-border bg-surface-cream px-4 py-3">
          <span className="text-sm font-bold text-ink">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-white text-xl font-bold text-ink shadow-soft active:scale-95 transition disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-10 text-center text-lg font-extrabold tabular">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(max, q + 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-white text-xl font-bold text-ink shadow-soft active:scale-95 transition disabled:opacity-40"
              aria-label="Increase quantity"
              disabled={quantity >= max}
            >
              +
            </button>
            <input type="hidden" name="quantity" value={quantity} />
          </div>
        </div>
      </section>

      {/* Pickup contact */}
      <section className="space-y-3">
        <SectionLabel>Pickup contact</SectionLabel>
        <Field label="Full name" htmlFor="customerName">
          <Input
            id="customerName"
            name="customerName"
            defaultValue={defaultName}
            placeholder="Jane Doe"
            required
          />
        </Field>
        <Field label="Phone number" htmlFor="customerPhone">
          <Input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            defaultValue={defaultPhone}
            placeholder="+233 24 000 0000"
            required
          />
        </Field>
        <Field label="Notes for the vendor" htmlFor="notes" hint="Optional">
          <Textarea
            id="notes"
            name="notes"
            placeholder="e.g. extra shito, less pepper"
          />
        </Field>
      </section>

      {/* Payment method */}
      <section>
        <SectionLabel>Payment method</SectionLabel>
        <input type="hidden" name="payment" value={payment} />
        <div className="mt-3 space-y-2.5">
          {PAYMENT_OPTIONS.map((opt) => {
            const active = opt.value === payment;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setPayment(opt.value)}
                className={
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all " +
                  (active
                    ? "border-brand-green bg-brand-green-soft shadow-soft"
                    : "border-surface-border bg-white hover:border-brand-green/30")
                }
              >
                <span
                  className={
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg " +
                    (active ? "bg-white" : "bg-surface-muted")
                  }
                >
                  {opt.emoji}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-ink">
                    {opt.label}
                  </div>
                  <div className="text-xs text-ink-muted">{opt.hint}</div>
                </div>
                <span
                  className={
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border-2 transition " +
                    (active
                      ? "border-brand-green bg-brand-green text-white"
                      : "border-surface-border bg-white")
                  }
                >
                  {active ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Summary */}
      <section className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-card">
        <div className="space-y-1 px-4 pt-4">
          <SummaryRow
            label="Original price"
            value={formatGHS(originalSubtotal)}
            strikethrough
            muted
          />
          <SummaryRow
            label={`Deal discount (−${pct}%)`}
            value={`− ${formatGHS(savings)}`}
            highlight
          />
          <SummaryRow label="Service fee" value="Free" muted />
        </div>
        <div className="mt-3 border-t border-dashed border-surface-border px-4 py-3">
          <SummaryRow label="Total" value={formatGHS(subtotal)} strong />
        </div>
        {savings > 0 ? (
          <div className="flex items-center justify-between bg-brand-orange-soft px-4 py-3">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-brand-orange-dark">
                Your total savings
              </div>
              <div className="text-lg font-extrabold tabular text-brand-orange-dark">
                {formatGHS(savings)}
              </div>
            </div>
            <SavingsBadge
              original={originalSubtotal}
              discounted={subtotal}
              show="percent"
              tone="solid"
              size="md"
            />
          </div>
        ) : null}
      </section>

      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div
        className="sticky bottom-0 -mx-5 border-t border-surface-border bg-white px-5 pt-3"
        style={{ paddingBottom: "max(var(--safe-bottom), 14px)" }}
      >
        <SubmitButton total={subtotal} />
      </div>
    </form>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
      {children}
    </h2>
  );
}

function SummaryRow({
  label,
  value,
  strong,
  muted,
  highlight,
  strikethrough,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
  highlight?: boolean;
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

function SubmitButton({ total }: { total: number }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth size="xl" disabled={pending}>
      {pending ? "Reserving…" : `Confirm · ${formatGHS(total)}`}
    </Button>
  );
}
