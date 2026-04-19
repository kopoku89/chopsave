import Image from "next/image";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TabBar, TabChip } from "@/components/shared/TabChip";
import { vendorsRepo } from "@/lib/db";
import type { Vendor, VendorStatus } from "@/lib/types";

import { updateVendorStatus } from "./actions";

type SearchParams = Promise<{ status?: string }>;

const TABS: { value: VendorStatus | "ALL"; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "ALL", label: "All" },
];

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const normalised = (status ?? "PENDING") as VendorStatus | "ALL";

  const all = vendorsRepo.list();
  const counts: Record<VendorStatus | "ALL", number> = {
    ALL: all.length,
    PENDING: all.filter((v) => v.status === "PENDING").length,
    APPROVED: all.filter((v) => v.status === "APPROVED").length,
    SUSPENDED: all.filter((v) => v.status === "SUSPENDED").length,
    REJECTED: all.filter((v) => v.status === "REJECTED").length,
  };

  const vendors =
    normalised === "ALL"
      ? all
      : vendorsRepo.list({ status: normalised });

  return (
    <AppShell role="ADMIN" className="bg-surface-cream">
      <TopBar title="Vendors" subtitle="Approval & moderation" />

      <div className="px-5 pt-4">
        <TabBar>
          {TABS.map((t) => (
            <TabChip
              key={t.value}
              href={`/admin/vendors${t.value === "PENDING" ? "" : `?status=${t.value}`}`}
              label={t.label}
              active={t.value === normalised}
              count={counts[t.value]}
            />
          ))}
        </TabBar>
      </div>

      <div className="space-y-3 p-5 pb-8">
        {vendors.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-surface-border bg-white/60 px-4 py-8 text-center text-sm text-ink-muted">
            Nothing here right now.
          </p>
        ) : (
          vendors.map((v) => <VendorRow key={v.id} vendor={v} />)
        )}
      </div>
    </AppShell>
  );
}

function VendorRow({ vendor }: { vendor: Vendor }) {
  return (
    <div className="rounded-3xl border border-surface-border bg-white p-4 shadow-card">
      <div className="flex items-start gap-3">
        {vendor.logoUrl ? (
          <Image
            src={vendor.logoUrl}
            alt={vendor.businessName}
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-2xl bg-brand-green-soft" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-extrabold text-ink">
              {vendor.businessName}
            </h3>
            <StatusBadge status={vendor.status} />
          </div>
          <div className="truncate text-xs text-ink-muted">{vendor.address}</div>
          <div className="truncate text-xs text-ink-muted">{vendor.phone}</div>
        </div>
      </div>

      {vendor.description ? (
        <p className="mt-3 text-xs text-ink-muted">{vendor.description}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {vendor.status === "PENDING" ? (
          <>
            <StatusForm vendorId={vendor.id} next="APPROVED" label="Approve" />
            <StatusForm
              vendorId={vendor.id}
              next="REJECTED"
              label="Reject"
              variant="ghost"
            />
          </>
        ) : null}
        {vendor.status === "APPROVED" ? (
          <StatusForm
            vendorId={vendor.id}
            next="SUSPENDED"
            label="Suspend"
            variant="ghost"
          />
        ) : null}
        {vendor.status === "SUSPENDED" || vendor.status === "REJECTED" ? (
          <StatusForm
            vendorId={vendor.id}
            next="APPROVED"
            label="Reinstate"
          />
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VendorStatus }) {
  const map: Record<
    VendorStatus,
    { label: string; tone: Parameters<typeof Badge>[0]["tone"] }
  > = {
    PENDING: { label: "Pending", tone: "yellow" },
    APPROVED: { label: "Approved", tone: "green" },
    SUSPENDED: { label: "Suspended", tone: "red" },
    REJECTED: { label: "Rejected", tone: "neutral" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

function StatusForm({
  vendorId,
  next,
  label,
  variant = "primary",
}: {
  vendorId: string;
  next: VendorStatus;
  label: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <form action={updateVendorStatus}>
      <input type="hidden" name="vendorId" value={vendorId} />
      <input type="hidden" name="status" value={next} />
      <Button size="md" variant={variant === "ghost" ? "outline" : "primary"}>
        {label}
      </Button>
    </form>
  );
}
