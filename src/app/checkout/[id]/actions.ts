"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ordersRepo } from "@/lib/db";
import { DEFAULT_CUSTOMER_ID } from "@/lib/session";

const schema = z.object({
  dealId: z.string().min(1),
  quantity: z.coerce.number().int().positive().max(20),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(6).max(20),
  payment: z.enum(["MOBILE_MONEY", "CARD", "CASH_ON_PICKUP"]),
  notes: z.string().max(280).optional(),
});

export type CheckoutState = {
  error?: string;
};

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = schema.safeParse({
    dealId: formData.get("dealId"),
    quantity: formData.get("quantity"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    payment: formData.get("payment"),
    notes: formData.get("notes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Please fill in every field correctly." };
  }

  let orderId: string;
  try {
    const order = ordersRepo.create({
      customerId: DEFAULT_CUSTOMER_ID,
      dealId: parsed.data.dealId,
      quantity: parsed.data.quantity,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      payment: parsed.data.payment,
      notes: parsed.data.notes,
    });
    orderId = order.id;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not place order";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/deals");
  revalidatePath("/orders");
  revalidatePath("/vendor/orders");
  redirect(`/orders/${orderId}`);
}
