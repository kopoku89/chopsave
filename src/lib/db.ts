// In-memory data store used as the MVP persistence layer.
//
// This module intentionally mirrors the shape of a thin repository so that
// swapping it for Prisma later is a mechanical change. Do not import mock
// data directly from UI code — always go through this module.

import { mockDeals, mockOrders, mockUsers, mockVendors } from "./mock-data";
import type {
  Deal,
  DealStatus,
  DealWithVendor,
  Order,
  OrderStatus,
  OrderWithRelations,
  PaymentMethod,
  User,
  Vendor,
  VendorStatus,
} from "./types";
import { generatePickupCode, genId } from "./utils";

// A single global store survives hot-reloads in dev.
type Store = {
  users: User[];
  vendors: Vendor[];
  deals: Deal[];
  orders: Order[];
};

declare global {
  // eslint-disable-next-line no-var
  var __chopsaveStore: Store | undefined;
}

function createStore(): Store {
  return {
    users: [...mockUsers],
    vendors: [...mockVendors],
    deals: [...mockDeals],
    orders: [...mockOrders],
  };
}

const store: Store = globalThis.__chopsaveStore ?? createStore();
if (!globalThis.__chopsaveStore) {
  globalThis.__chopsaveStore = store;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const usersRepo = {
  list: (): User[] => [...store.users],
  findById: (id: string): User | undefined =>
    store.users.find((u) => u.id === id),
};

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

export const vendorsRepo = {
  list: (opts: { status?: VendorStatus } = {}): Vendor[] => {
    let rows = [...store.vendors];
    if (opts.status) rows = rows.filter((v) => v.status === opts.status);
    return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  findById: (id: string): Vendor | undefined =>
    store.vendors.find((v) => v.id === id),

  updateStatus: (id: string, status: VendorStatus): Vendor | undefined => {
    const vendor = store.vendors.find((v) => v.id === id);
    if (!vendor) return undefined;
    vendor.status = status;
    return vendor;
  },
};

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

export type ListDealsOptions = {
  vendorId?: string;
  status?: DealStatus;
  activeOnly?: boolean;
  search?: string;
};

export const dealsRepo = {
  list: (opts: ListDealsOptions = {}): DealWithVendor[] => {
    let rows = [...store.deals];
    if (opts.vendorId) rows = rows.filter((d) => d.vendorId === opts.vendorId);
    if (opts.status) rows = rows.filter((d) => d.status === opts.status);
    if (opts.activeOnly) {
      rows = rows.filter(
        (d) => d.status === "ACTIVE" && d.quantityTotal - d.quantitySold > 0,
      );
    }
    if (opts.search) {
      const q = opts.search.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return rows
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((d) => attachVendor(d));
  },

  findById: (id: string): DealWithVendor | undefined => {
    const deal = store.deals.find((d) => d.id === id);
    if (!deal) return undefined;
    return attachVendor(deal);
  },

  create: (input: {
    vendorId: string;
    title: string;
    description: string;
    imageUrl?: string;
    originalPrice: number;
    discountedPrice: number;
    quantityTotal: number;
    pickupStart: string;
    pickupEnd: string;
    category?: string;
    tags?: string[];
  }): Deal => {
    const deal: Deal = {
      id: genId("deal"),
      vendorId: input.vendorId,
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      originalPrice: input.originalPrice,
      discountedPrice: input.discountedPrice,
      quantityTotal: input.quantityTotal,
      quantitySold: 0,
      pickupStart: input.pickupStart,
      pickupEnd: input.pickupEnd,
      category: input.category,
      tags: input.tags ?? [],
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    store.deals.unshift(deal);
    return deal;
  },

  update: (id: string, patch: Partial<Deal>): Deal | undefined => {
    const deal = store.deals.find((d) => d.id === id);
    if (!deal) return undefined;
    Object.assign(deal, patch);
    return deal;
  },

  incrementSold: (id: string, qty: number): Deal | undefined => {
    const deal = store.deals.find((d) => d.id === id);
    if (!deal) return undefined;
    deal.quantitySold += qty;
    if (deal.quantitySold >= deal.quantityTotal) {
      deal.status = "SOLD_OUT";
    }
    return deal;
  },
};

function attachVendor(deal: Deal): DealWithVendor {
  const vendor = store.vendors.find((v) => v.id === deal.vendorId);
  if (!vendor) {
    throw new Error(`Vendor ${deal.vendorId} missing for deal ${deal.id}`);
  }
  return { ...deal, vendor };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type ListOrdersOptions = {
  customerId?: string;
  vendorId?: string;
  status?: OrderStatus;
};

export const ordersRepo = {
  list: (opts: ListOrdersOptions = {}): OrderWithRelations[] => {
    let rows = [...store.orders];
    if (opts.customerId)
      rows = rows.filter((o) => o.customerId === opts.customerId);
    if (opts.vendorId) rows = rows.filter((o) => o.vendorId === opts.vendorId);
    if (opts.status) rows = rows.filter((o) => o.status === opts.status);
    return rows
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map(attachOrderRelations);
  },

  findById: (id: string): OrderWithRelations | undefined => {
    const order = store.orders.find((o) => o.id === id);
    if (!order) return undefined;
    return attachOrderRelations(order);
  },

  create: (input: {
    customerId: string;
    dealId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    payment: PaymentMethod;
    notes?: string;
  }): OrderWithRelations => {
    const deal = store.deals.find((d) => d.id === input.dealId);
    if (!deal) throw new Error("Deal not found");

    const remaining = deal.quantityTotal - deal.quantitySold;
    if (remaining < input.quantity) {
      throw new Error(`Only ${remaining} left for this deal`);
    }
    if (deal.status !== "ACTIVE") {
      throw new Error("This deal is no longer available");
    }

    const order: Order = {
      id: genId("ord"),
      customerId: input.customerId,
      vendorId: deal.vendorId,
      dealId: deal.id,
      quantity: input.quantity,
      unitPrice: deal.discountedPrice,
      totalAmount: deal.discountedPrice * input.quantity,
      status: input.payment === "CASH_ON_PICKUP" ? "PENDING" : "PAID",
      payment: input.payment,
      pickupCode: generatePickupCode(),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };

    store.orders.unshift(order);
    dealsRepo.incrementSold(deal.id, input.quantity);
    return attachOrderRelations(order);
  },

  updateStatus: (id: string, status: OrderStatus): Order | undefined => {
    const order = store.orders.find((o) => o.id === id);
    if (!order) return undefined;
    order.status = status;
    return order;
  },
};

function attachOrderRelations(order: Order): OrderWithRelations {
  const deal = store.deals.find((d) => d.id === order.dealId);
  const vendor = store.vendors.find((v) => v.id === order.vendorId);
  if (!deal || !vendor) {
    throw new Error(`Missing relations for order ${order.id}`);
  }
  return { ...order, deal, vendor };
}

// ---------------------------------------------------------------------------
// Admin analytics
// ---------------------------------------------------------------------------

export const statsRepo = {
  platformSummary: () => {
    const vendorsPending = store.vendors.filter(
      (v) => v.status === "PENDING",
    ).length;
    const vendorsApproved = store.vendors.filter(
      (v) => v.status === "APPROVED",
    ).length;
    const activeDeals = store.deals.filter((d) => d.status === "ACTIVE").length;
    const revenuePesewas = store.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const mealsRescued = store.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.quantity, 0);

    return {
      vendorsPending,
      vendorsApproved,
      activeDeals,
      totalOrders: store.orders.length,
      revenuePesewas,
      mealsRescued,
    };
  },

  vendorSummary: (vendorId: string) => {
    const vendorOrders = store.orders.filter((o) => o.vendorId === vendorId);
    const activeDeals = store.deals.filter(
      (d) => d.vendorId === vendorId && d.status === "ACTIVE",
    ).length;
    const revenuePesewas = vendorOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const mealsRescued = vendorOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.quantity, 0);
    const pendingPickups = vendorOrders.filter(
      (o) => o.status === "PAID" || o.status === "READY_FOR_PICKUP",
    ).length;

    return {
      activeDeals,
      totalOrders: vendorOrders.length,
      pendingPickups,
      revenuePesewas,
      mealsRescued,
    };
  },
};
