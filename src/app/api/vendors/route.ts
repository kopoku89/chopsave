import { NextRequest } from "next/server";

import { vendorsRepo } from "@/lib/db";
import { ok, serverError } from "@/lib/api";
import type { VendorStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") as
      | VendorStatus
      | null;
    const vendors = vendorsRepo.list({
      status: status ?? undefined,
    });
    return ok(vendors);
  } catch (err) {
    return serverError(err);
  }
}
