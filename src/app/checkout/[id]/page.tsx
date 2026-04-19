import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { dealsRepo } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/session";

import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = dealsRepo.findById(id);
  if (!deal) notFound();

  const customer = getCurrentCustomer();

  return (
    <AppShell role="CUSTOMER" showNav={false} className="bg-surface-cream">
      <TopBar title="Checkout" subtitle="Review your order" back={`/deals/${deal.id}`} />
      <div className="px-5 pt-5">
        <CheckoutForm
          deal={deal}
          defaultName={customer.name}
          defaultPhone={customer.phone ?? ""}
        />
      </div>
    </AppShell>
  );
}
