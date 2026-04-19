import { NextRequest } from "next/server";

import { vendorsRepo } from "@/lib/db";
import { notFound, ok, serverError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const vendor = vendorsRepo.findById(id);
    if (!vendor) return notFound("Vendor not found");
    return ok(vendor);
  } catch (err) {
    return serverError(err);
  }
}
