import { NextRequest } from "next/server";
import { z } from "zod";

import { ordersRepo } from "@/lib/db";
import { badRequest, created, ok, parseJson, serverError } from "@/lib/api";

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  dealId: z.string().min(1),
  quantity: z.number().int().positive().max(20),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  payment: z.enum(["MOBILE_MONEY", "CARD", "CASH_ON_PICKUP"]),
  notes: z.string().max(280).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const orders = ordersRepo.list({
      customerId: searchParams.get("customerId") ?? undefined,
      vendorId: searchParams.get("vendorId") ?? undefined,
    });
    return ok(orders);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, createOrderSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const order = ordersRepo.create(parsed.data);
    return created(order);
  } catch (err) {
    if (err instanceof Error) return badRequest(err.message);
    return serverError(err);
  }
}
