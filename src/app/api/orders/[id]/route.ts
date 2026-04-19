import { NextRequest } from "next/server";
import { z } from "zod";

import { ordersRepo } from "@/lib/db";
import { notFound, ok, parseJson, serverError } from "@/lib/api";

const patchSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = ordersRepo.findById(id);
  if (!order) return notFound("Order not found");
  return ok(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = await parseJson(request, patchSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const order = ordersRepo.updateStatus(id, parsed.data.status);
    if (!order) return notFound("Order not found");
    return ok(order);
  } catch (err) {
    return serverError(err);
  }
}
