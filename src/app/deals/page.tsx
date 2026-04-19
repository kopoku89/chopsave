import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { DealCard } from "@/components/deals/DealCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { dealsRepo } from "@/lib/db";

const CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "", label: "All", emoji: "🍽️" },
  { key: "Main", label: "Mains", emoji: "🍛" },
  { key: "Snack", label: "Snacks", emoji: "🍢" },
  { key: "Bakery", label: "Bakery", emoji: "🥐" },
  { key: "Drinks", label: "Drinks", emoji: "🥤" },
  { key: "Dessert", label: "Desserts", emoji: "🍰" },
];

type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function DealsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category } = await searchParams;
  const deals = dealsRepo.list({ activeOnly: true, search: q });
  const visible = category
    ? deals.filter((d) => d.category?.toLowerCase() === category.toLowerCase())
    : deals;

  return (
    <AppShell role="CUSTOMER" className="bg-surface-cream">
      <TopBar title="Browse deals" subtitle="Accra, Ghana" back="/" />

      <div className="space-y-5 p-5 pb-8">
        <form action="/deals" method="GET" className="relative">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search meals, vendors or tags"
            className="h-12 w-full rounded-full border border-surface-border bg-white pl-11 pr-12 text-[16px] font-medium shadow-soft focus:outline-none focus:ring-4 focus:ring-brand-green/15 focus:border-brand-green"
            autoComplete="off"
            enterKeyHint="search"
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          {q ? (
            <a
              href="/deals"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface-muted text-lg text-ink-muted active:scale-95 transition hover:bg-surface-muted-2"
            >
              ×
            </a>
          ) : null}
        </form>

        <div className="-mx-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-5 pb-1">
            {CATEGORIES.map((c) => {
              const active =
                (!category && !c.key) ||
                category?.toLowerCase() === c.key.toLowerCase();
              return (
                <CategoryChip
                  key={c.label}
                  label={c.label}
                  emoji={c.emoji}
                  href={
                    c.key
                      ? `/deals?category=${encodeURIComponent(c.key)}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                      : q
                        ? `/deals?q=${encodeURIComponent(q)}`
                        : "/deals"
                  }
                  active={active}
                />
              );
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="No deals match your search"
            description="Try a different keyword or remove filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visible.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function CategoryChip({
  label,
  emoji,
  href,
  active,
}: {
  label: string;
  emoji: string;
  href: string;
  active?: boolean;
}) {
  const cls = active
    ? "bg-brand-green text-white border-brand-green shadow-float"
    : "bg-white text-ink border-surface-border hover:border-brand-green/30";
  return (
    <a
      href={href}
      className={`inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-bold active:scale-95 transition ${cls}`}
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </a>
  );
}
