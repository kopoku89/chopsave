import type { Deal, Order, User, Vendor } from "./types";

// -----------------------------------------------------------------------
// Seed data for the ChopSave MVP. All prices are in pesewas (GHS * 100).
// Vendors, deals and orders are consistent with each other so the app
// renders meaningfully without a real database.
// -----------------------------------------------------------------------

const now = Date.now();
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const mockUsers: User[] = [
  {
    id: "usr_admin",
    email: "admin@chopsave.gh",
    name: "Ama Owusu",
    role: "ADMIN",
    phone: "+233200000001",
    createdAt: iso(-30 * DAY),
  },
  {
    id: "usr_vendor_1",
    email: "kofi@mamasitas.gh",
    name: "Kofi Mensah",
    role: "VENDOR",
    phone: "+233244000001",
    createdAt: iso(-25 * DAY),
  },
  {
    id: "usr_vendor_2",
    email: "akos@chalewote.gh",
    name: "Akosua Boateng",
    role: "VENDOR",
    phone: "+233244000002",
    createdAt: iso(-20 * DAY),
  },
  {
    id: "usr_vendor_3",
    email: "sam@labadi.gh",
    name: "Samuel Asare",
    role: "VENDOR",
    phone: "+233244000003",
    createdAt: iso(-5 * DAY),
  },
  {
    id: "usr_customer_1",
    email: "efua@example.com",
    name: "Efua Appiah",
    role: "CUSTOMER",
    phone: "+233550000001",
    createdAt: iso(-10 * DAY),
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "vnd_mamasitas",
    userId: "usr_vendor_1",
    businessName: "Mamasita's Kitchen",
    description:
      "Home-style Ghanaian meals: jollof, waakye, red-red and more. Surplus plates from lunch service.",
    address: "12 Oxford St, Osu",
    city: "Accra",
    phone: "+233244000001",
    logoUrl:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=160&q=70&auto=format&fit=crop",
    status: "APPROVED",
    rating: 4.7,
    ratingCount: 218,
    createdAt: iso(-25 * DAY),
  },
  {
    id: "vnd_chalewote",
    userId: "usr_vendor_2",
    businessName: "Chale Wote Grill",
    description:
      "Coastal grill house. Grilled tilapia, banku and kebabs saved from the evening rush.",
    address: "5 High Street, Jamestown",
    city: "Accra",
    phone: "+233244000002",
    logoUrl:
      "https://images.unsplash.com/photo-1514537099923-4c0fc7ca69dc?w=160&q=70&auto=format&fit=crop",
    status: "APPROVED",
    rating: 4.5,
    ratingCount: 134,
    createdAt: iso(-20 * DAY),
  },
  {
    id: "vnd_labadi",
    userId: "usr_vendor_3",
    businessName: "Labadi Bakehouse",
    description:
      "Artisan breads, meat pies and pastries rescued at the end of each day.",
    address: "Beach Rd, La",
    city: "Accra",
    phone: "+233244000003",
    logoUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&q=70&auto=format&fit=crop",
    status: "PENDING",
    rating: 0,
    ratingCount: 0,
    createdAt: iso(-5 * DAY),
  },
];

export const mockDeals: Deal[] = [
  {
    id: "deal_jollof_box",
    vendorId: "vnd_mamasitas",
    title: "Jollof + Grilled Chicken Box",
    description:
      "Generous portion of smoky jollof rice with grilled chicken thigh, shito and salad. From today's lunch service.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=70&auto=format&fit=crop",
    originalPrice: 6000,
    discountedPrice: 3500,
    quantityTotal: 15,
    quantitySold: 4,
    pickupStart: iso(2 * HOUR),
    pickupEnd: iso(5 * HOUR),
    category: "Main",
    tags: ["jollof", "chicken", "popular"],
    status: "ACTIVE",
    createdAt: iso(-3 * HOUR),
  },
  {
    id: "deal_waakye_plate",
    vendorId: "vnd_mamasitas",
    title: "Waakye Mixed Plate",
    description:
      "Waakye with wele, fish, spaghetti, gari and shito. A complete Ghanaian classic.",
    imageUrl:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=70&auto=format&fit=crop",
    originalPrice: 5500,
    discountedPrice: 3000,
    quantityTotal: 10,
    quantitySold: 2,
    pickupStart: iso(1 * HOUR),
    pickupEnd: iso(4 * HOUR),
    category: "Main",
    tags: ["waakye", "traditional"],
    status: "ACTIVE",
    createdAt: iso(-4 * HOUR),
  },
  {
    id: "deal_tilapia_banku",
    vendorId: "vnd_chalewote",
    title: "Grilled Tilapia & Banku",
    description:
      "Whole grilled tilapia with banku and pepper sauce. Saved from the grill.",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=70&auto=format&fit=crop",
    originalPrice: 9000,
    discountedPrice: 5500,
    quantityTotal: 8,
    quantitySold: 3,
    pickupStart: iso(3 * HOUR),
    pickupEnd: iso(6 * HOUR),
    category: "Main",
    tags: ["tilapia", "banku", "grill"],
    status: "ACTIVE",
    createdAt: iso(-2 * HOUR),
  },
  {
    id: "deal_kebab_pack",
    vendorId: "vnd_chalewote",
    title: "Chichinga Kebab 5-Pack",
    description:
      "Five skewers of spiced beef chichinga. Perfect for sharing tonight.",
    imageUrl:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=70&auto=format&fit=crop",
    originalPrice: 4000,
    discountedPrice: 2500,
    quantityTotal: 12,
    quantitySold: 12,
    pickupStart: iso(-1 * HOUR),
    pickupEnd: iso(2 * HOUR),
    category: "Snack",
    tags: ["kebab", "beef"],
    status: "SOLD_OUT",
    createdAt: iso(-6 * HOUR),
  },
  {
    id: "deal_pastry_box",
    vendorId: "vnd_labadi",
    title: "Mixed Pastry Surprise Box",
    description:
      "An assortment of end-of-day meat pies, sausage rolls and sweet buns. You'll love the surprise.",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=70&auto=format&fit=crop",
    originalPrice: 5000,
    discountedPrice: 2000,
    quantityTotal: 20,
    quantitySold: 6,
    pickupStart: iso(4 * HOUR),
    pickupEnd: iso(8 * HOUR),
    category: "Bakery",
    tags: ["pastry", "bakery", "surprise"],
    status: "ACTIVE",
    createdAt: iso(-1 * HOUR),
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord_1001",
    customerId: "usr_customer_1",
    vendorId: "vnd_mamasitas",
    dealId: "deal_jollof_box",
    quantity: 2,
    unitPrice: 3500,
    totalAmount: 7000,
    status: "READY_FOR_PICKUP",
    payment: "MOBILE_MONEY",
    pickupCode: "CHS-7K2Q",
    customerName: "Efua Appiah",
    customerPhone: "+233550000001",
    createdAt: iso(-1 * HOUR),
  },
  {
    id: "ord_1002",
    customerId: "usr_customer_1",
    vendorId: "vnd_chalewote",
    dealId: "deal_tilapia_banku",
    quantity: 1,
    unitPrice: 5500,
    totalAmount: 5500,
    status: "PAID",
    payment: "CARD",
    pickupCode: "CHS-9M4N",
    customerName: "Efua Appiah",
    customerPhone: "+233550000001",
    createdAt: iso(-30 * 60 * 1000),
  },
];

