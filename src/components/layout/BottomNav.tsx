"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  iconActive?: ReactNode;
  matchPrefix?: string;
};

const HomeIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 11.5l9-8 9 8" />
    <path d="M5 10.5v10h14v-10" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const BagIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 2l1.5 3h9L18 2" />
    <path d="M4 7h16l-1.5 13a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M3 10h18" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h10" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const ChartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 4 4 5-5" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const customerItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    matchPrefix: "/",
    icon: <HomeIcon />,
    iconActive: <HomeIcon filled />,
  },
  { href: "/deals", label: "Browse", matchPrefix: "/deals", icon: <SearchIcon /> },
  {
    href: "/orders",
    label: "Orders",
    matchPrefix: "/orders",
    icon: <BagIcon />,
    iconActive: <BagIcon filled />,
  },
];

const vendorItems: NavItem[] = [
  { href: "/vendor", label: "Home", matchPrefix: "/vendor", icon: <DashboardIcon /> },
  {
    href: "/vendor/listings",
    label: "Listings",
    matchPrefix: "/vendor/listings",
    icon: <ListIcon />,
  },
  {
    href: "/vendor/orders",
    label: "Orders",
    matchPrefix: "/vendor/orders",
    icon: <CheckIcon />,
  },
];

const adminItems: NavItem[] = [
  { href: "/admin", label: "Overview", matchPrefix: "/admin", icon: <ChartIcon /> },
  {
    href: "/admin/vendors",
    label: "Vendors",
    matchPrefix: "/admin/vendors",
    icon: <UsersIcon />,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    matchPrefix: "/admin/orders",
    icon: <ListIcon />,
  },
];

export function BottomNav({
  role,
}: {
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}) {
  const pathname = usePathname();
  const items =
    role === "VENDOR"
      ? vendorItems
      : role === "ADMIN"
        ? adminItems
        : customerItems;

  const activeHref = items
    .slice()
    .sort((a, b) => (b.matchPrefix?.length ?? 0) - (a.matchPrefix?.length ?? 0))
    .find((item) => {
      const p = item.matchPrefix ?? item.href;
      if (p === "/") return pathname === "/";
      return pathname === p || pathname.startsWith(`${p}/`);
    })?.href;

  return (
    <nav
      className="sticky bottom-0 z-20 border-t border-surface-border bg-white"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-3">
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "relative flex h-[64px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold active:scale-95 transition-transform",
                  active ? "text-brand-green" : "text-ink-faint",
                )}
              >
                <span aria-hidden>
                  {active ? (item.iconActive ?? item.icon) : item.icon}
                </span>
                <span>{item.label}</span>
                {active ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-10 rounded-b-full bg-brand-green"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
