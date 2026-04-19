import { NextRequest } from "next/server";
import { z } from "zod";

import { vendorsRepo } from "@/lib/db";
import { notFound, ok, parseJson, serverError } from "@/lib/api";

const schema = z.object({
  status: z.enum(["PENDING", "APPROVED", "SUSPENDED", "REJECTED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;
  try {
    const vendor = vendorsRepo.updateStatus(id, parsed.data.status);
    if (!vendor) return notFound("Vendor not found");
    return ok(vendor);
  } catch (err) {
    return serverError(err);
  }
}
