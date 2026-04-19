"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { vendorsRepo } from "@/lib/db";

const schema = z.object({
  vendorId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "SUSPENDED", "REJECTED"]),
});

export async function updateVendorStatus(formData: FormData) {
  const parsed = schema.safeParse({
    vendorId: formData.get("vendorId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  vendorsRepo.updateStatus(parsed.data.vendorId, parsed.data.status);
  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
}
