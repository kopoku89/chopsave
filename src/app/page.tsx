import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { DealCard } from "@/components/deals/DealCard";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { dealsRepo, statsRepo } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/session";
import { formatGHS } from "@/lib/format";

const CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "", label: "All", emoji: "🍽️" },
  { key: "Main", label: "Mains", emoji: "🍛" },
  { key: "Snack", label: "Snacks", emoji: "🍢" },
  { key: "Bakery", label: "Bakery", emoji: "🥐" },
  { key: "Drinks", label: "Drinks", emoji: "🥤" },
  { key: "Dessert", label: "Desserts", emoji: "🍰" },
];

export default function HomePage() {
  const customer = getCurrentCustomer();
  const deals = dealsRepo.list({ activeOnly: true });
  const stats = statsRepo.platformSummary();
  const firstName = customer.name.split(" ")[0];

  return (
    <AppShell role="CUSTOMER" className="bg-surface-cream">
      {/* HERO — compact, one clear message */}
      <section className="relative overflow-hidden bg-gradient-hero px-5 pb-12 pt-5 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative flex items-center justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
              <LocationPin />
              Accra, Ghana
            </div>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight balance">
              Hey {firstName}, save{" "}
              <span className="text-brand-yellow">dinner</span> tonight?
            </h1>
          </div>
          <Link
            href="/orders"
            className="ml-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 active:scale-95 transition"
            aria-label="Your orders"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2l1.5 3h9L18 2" />
              <path d="M4 7h16l-1.5 13a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z" />
            </svg>
          </Link>
        </div>

        <p className="relative mt-2 text-sm leading-snug text-white/90">
          Up to 70% off surplus meals ·{" "}
          <span className="font-bold text-white">
            {stats.mealsRescued.toLocaleString()}
          </span>{" "}
          rescued so far
        </p>
      </section>

      {/* Search bar — floating over hero */}
      <div className="relative -mt-8 px-5">
        <Link
          href="/deals"
          className="flex items-center gap-3 rounded-full bg-white px-4 py-3.5 shadow-pop ring-1 ring-black/5 active:scale-[.99] transition"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-soft text-brand-green">
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
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <span className="flex-1 truncate text-[15px] font-medium text-ink-muted">
            Search meals near you
          </span>
        </Link>
      </div>

      {/* One-line reassurance — present but quiet. */}
      <div className="mt-3 px-5">
        <TrustStrip
          variant="soft"
          message="Prepared today. Unsold, not expired."
          sub="Only verified ChopSave vendors. Safe to eat, kind to the planet."
        />
      </div>

      {/* Category rail */}
      <section className="mt-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-5 pb-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={
                c.key ? `/deals?category=${encodeURIComponent(c.key)}` : "/deals"
              }
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border border-surface-border bg-white px-4 text-sm font-bold text-ink shadow-soft active:scale-95 transition"
            >
              <span aria-hidden>{c.emoji}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Deals feed — single vertical list, no duplicate rail */}
      <section className="mt-6 px-5 pb-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-[17px] font-extrabold text-ink">
              Deals near you
            </h2>
            <p className="text-xs text-ink-muted">
              {deals.length} active · saving up to{" "}
              {formatGHS(
                deals.reduce(
                  (acc, d) => acc + (d.originalPrice - d.discountedPrice),
                  0,
                ),
              )}
            </p>
          </div>
          <Link
            href="/deals"
            className="text-xs font-extrabold uppercase tracking-wider text-brand-green"
          >
            View all →
          </Link>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">
            No deals right now. Check back soon.
          </p>
        )}
      </section>

      {/* Slim role switcher */}
      <RoleSwitcher />
    </AppShell>
  );
}

function LocationPin() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function RoleSwitcher() {
  return (
    <section className="mx-5 mb-8 rounded-3xl border border-surface-border bg-white p-4 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-faint">
        Demo — switch role
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <RoleLink href="/" label="Customer" emoji="🛒" active />
        <RoleLink href="/vendor" label="Vendor" emoji="🧑‍🍳" />
        <RoleLink href="/admin" label="Admin" emoji="🛠️" />
      </div>
    </section>
  );
}

function RoleLink({
  href,
  label,
  emoji,
  active,
}: {
  href: string;
  label: string;
  emoji: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl border px-3 text-center text-xs font-extrabold transition active:scale-95 " +
        (active
          ? "border-brand-green bg-brand-green-soft text-brand-green"
          : "border-surface-border bg-white text-ink hover:border-ink/20 hover:bg-surface-muted")
      }
    >
      <span className="text-base" aria-hidden>
        {emoji}
      </span>
      {label}
    </Link>
  );
}
