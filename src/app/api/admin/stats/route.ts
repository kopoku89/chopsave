import { statsRepo } from "@/lib/db";
import { ok, serverError } from "@/lib/api";

export async function GET() {
  try {
    return ok(statsRepo.platformSummary());
  } catch (err) {
    return serverError(err);
  }
}
