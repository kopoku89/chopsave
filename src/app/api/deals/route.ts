import { NextRequest } from "next/server";
import { z } from "zod";

import { dealsRepo } from "@/lib/db";
import { created, ok, parseJson, serverError } from "@/lib/api";

const createDealSchema = z.object({
  vendorId: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().min(5).max(1000),
  imageUrl: z.string().url().optional(),
  originalPrice: z.number().int().positive(),
  discountedPrice: z.number().int().positive(),
  quantityTotal: z.number().int().positive().max(500),
  pickupStart: z.string().datetime(),
  pickupEnd: z.string().datetime(),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const deals = dealsRepo.list({
      vendorId: searchParams.get("vendorId") ?? undefined,
      search: searchParams.get("q") ?? undefined,
      activeOnly: searchParams.get("activeOnly") === "true",
    });
    return ok(deals);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, createDealSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const deal = dealsRepo.create(parsed.data);
    return created(deal);
  } catch (err) {
    return serverError(err);
  }
}
