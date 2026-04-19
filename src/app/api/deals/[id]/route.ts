import { NextRequest } from "next/server";
import { z } from "zod";

import { dealsRepo } from "@/lib/db";
import { notFound, ok, parseJson, serverError } from "@/lib/api";

const patchSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().min(5).max(1000).optional(),
  imageUrl: z.string().url().optional(),
  discountedPrice: z.number().int().positive().optional(),
  quantityTotal: z.number().int().positive().optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "SOLD_OUT", "EXPIRED", "ARCHIVED"])
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deal = dealsRepo.findById(id);
  if (!deal) return notFound("Deal not found");
  return ok(deal);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = await parseJson(request, patchSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const deal = dealsRepo.update(id, parsed.data);
    if (!deal) return notFound("Deal not found");
    return ok(deal);
  } catch (err) {
    return serverError(err);
  }
}
