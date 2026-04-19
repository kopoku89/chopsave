"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { dealsRepo } from "@/lib/db";
import { getCurrentVendor } from "@/lib/session";

const schema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(5).max(1000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  originalPriceCedis: z.coerce.number().positive(),
  discountedPriceCedis: z.coerce.number().positive(),
  quantityTotal: z.coerce.number().int().positive().max(500),
  pickupStart: z.string().min(1),
  pickupEnd: z.string().min(1),
  category: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});

export type NewDealState = { error?: string };

export async function createDeal(
  _prev: NewDealState,
  formData: FormData,
): Promise<NewDealState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Please check your inputs and try again." };
  }

  const { vendor } = getCurrentVendor();
  const d = parsed.data;

  if (d.discountedPriceCedis >= d.originalPriceCedis) {
    return { error: "Discounted price must be less than the original price." };
  }

  const start = new Date(d.pickupStart);
  const end = new Date(d.pickupEnd);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: "Invalid pickup dates." };
  }
  if (end <= start) {
    return { error: "Pickup end must be after pickup start." };
  }

  dealsRepo.create({
    vendorId: vendor.id,
    title: d.title,
    description: d.description,
    imageUrl: d.imageUrl ? d.imageUrl : undefined,
    originalPrice: Math.round(d.originalPriceCedis * 100),
    discountedPrice: Math.round(d.discountedPriceCedis * 100),
    quantityTotal: d.quantityTotal,
    pickupStart: start.toISOString(),
    pickupEnd: end.toISOString(),
    category: d.category ? d.category : undefined,
    tags: d.tags
      ? d.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/listings");
  revalidatePath("/");
  revalidatePath("/deals");
  redirect("/vendor/listings");
}
