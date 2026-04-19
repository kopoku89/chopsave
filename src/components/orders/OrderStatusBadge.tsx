import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/types";

type Tone = Parameters<typeof Badge>[0]["tone"];

const MAP: Record<OrderStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Awaiting payment", tone: "yellow" },
  PAID: { label: "Paid", tone: "green" },
  READY_FOR_PICKUP: { label: "Ready", tone: "green-solid" },
  COMPLETED: { label: "Completed", tone: "neutral" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = MAP[status];
  return <Badge tone={tone}>{label}</Badge>;
}
