// Domain types shared across the app.
// These mirror the Prisma schema but are UI-safe (no Prisma imports).

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export type VendorStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";

export type DealStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SOLD_OUT"
  | "EXPIRED"
  | "ARCHIVED";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "READY_FOR_PICKUP"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod = "MOBILE_MONEY" | "CARD" | "CASH_ON_PICKUP";

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  address: string;
  city: string;
  phone: string;
  logoUrl?: string;
  status: VendorStatus;
  /** Average customer rating, 0–5. */
  rating: number;
  /** Number of ratings received. */
  ratingCount: number;
  createdAt: string;
}

export interface Deal {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  imageUrl?: string;
  /** Price in pesewas (minor units). 100 pesewas = 1 GHS. */
  originalPrice: number;
  discountedPrice: number;
  quantityTotal: number;
  quantitySold: number;
  pickupStart: string;
  pickupEnd: string;
  category?: string;
  tags: string[];
  status: DealStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  dealId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  payment: PaymentMethod;
  pickupCode: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
}

// Composite read-models used by the UI.
export interface DealWithVendor extends Deal {
  vendor: Vendor;
}

export interface OrderWithRelations extends Order {
  deal: Deal;
  vendor: Vendor;
}
