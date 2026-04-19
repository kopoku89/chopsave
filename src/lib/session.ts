// Lightweight mock session layer.
//
// For the MVP we don't wire NextAuth — instead we pick sensible defaults per
// role so every page works without a login screen. When NextAuth is added
// later, replace the bodies of these functions with real session lookups.

import { usersRepo, vendorsRepo } from "./db";
import type { User, Vendor } from "./types";

export const DEFAULT_CUSTOMER_ID = "usr_customer_1";
export const DEFAULT_VENDOR_USER_ID = "usr_vendor_1";
export const DEFAULT_ADMIN_ID = "usr_admin";

export function getCurrentCustomer(): User {
  const user = usersRepo.findById(DEFAULT_CUSTOMER_ID);
  if (!user) throw new Error("Default customer missing from seed data");
  return user;
}

export function getCurrentVendor(): { user: User; vendor: Vendor } {
  const user = usersRepo.findById(DEFAULT_VENDOR_USER_ID);
  const vendor = vendorsRepo
    .list()
    .find((v) => v.userId === DEFAULT_VENDOR_USER_ID);
  if (!user || !vendor) {
    throw new Error("Default vendor session missing from seed data");
  }
  return { user, vendor };
}

export function getCurrentAdmin(): User {
  const user = usersRepo.findById(DEFAULT_ADMIN_ID);
  if (!user) throw new Error("Default admin missing from seed data");
  return user;
}
