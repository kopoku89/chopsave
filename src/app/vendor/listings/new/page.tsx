import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";

import { NewListingForm } from "./NewListingForm";

function toLocalInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export default function NewListingPage() {
  const now = new Date();
  const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 5 * 60 * 60 * 1000);

  return (
    <AppShell role="VENDOR" showNav={false} className="bg-surface-cream">
      <TopBar title="New deal" subtitle="Rescue surplus food" back="/vendor/listings" />
      <div className="p-5 pb-10">
        <NewListingForm
          defaultPickupStart={toLocalInput(start)}
          defaultPickupEnd={toLocalInput(end)}
        />
      </div>
    </AppShell>
  );
}
