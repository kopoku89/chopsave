"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ordersRepo } from "@/lib/db";

const schema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "PAID",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export async function updateOrderStatus(formData: FormData) {
  const parsed = schema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  ordersRepo.updateStatus(parsed.data.orderId, parsed.data.status);
  revalidatePath("/vendor");
  revalidatePath("/vendor/orders");
  revalidatePath("/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
