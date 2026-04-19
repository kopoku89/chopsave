# ChopSave

Mobile-first web marketplace for rescuing discounted surplus food from restaurants
and hotels in Accra, Ghana. Customers save money, vendors monetise leftovers,
and the city wastes less food.

---

## Tech stack

- **Next.js 15** (App Router, React Server Components, Server Actions)
- **TypeScript** strict mode
- **Tailwind CSS** with a custom ChopSave theme (green / orange / yellow)
- **Prisma** schema targeting PostgreSQL (ready to swap in)
- **Zod** for request & form validation
- Mock in-memory data store for the MVP — `src/lib/db.ts` mirrors a thin
  repository so Prisma can slot in without touching any UI code

## Feature coverage

### Customer

- Home with hero, platform impact stats, and nearby deals
- Browse deals with search and category chips
- Deal detail with pickup window, savings, vendor info
- Checkout flow (quantity, contact, payment method, order summary)
- Order confirmation with a prominent **pickup code**
- "My orders" history

### Vendor

- Dashboard with revenue, meals rescued, active deals, pending pickups
- Listings management (list + create new deal)
- Orders inbox with status filters (`Paid`, `Ready`, `Completed`)
- One-tap status transitions: *Mark ready* → *Mark picked up* → *Cancel*

### Admin

- Platform overview with KPIs, pending vendors, and recent orders
- Vendor approval queue (Approve / Reject / Suspend / Reinstate)
- Full order monitor with status filters

## API routes

All routes return `{ data }` on success and `{ error, details? }` on failure.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET`  | `/api/deals` | List deals (`?vendorId`, `?q`, `?activeOnly=true`) |
| `POST` | `/api/deals` | Create deal |
| `GET`  | `/api/deals/[id]` | Fetch deal |
| `PATCH`| `/api/deals/[id]` | Update deal |
| `GET`  | `/api/orders` | List orders (`?customerId`, `?vendorId`) |
| `POST` | `/api/orders` | Create order (reserves stock, returns pickup code) |
| `GET`  | `/api/orders/[id]` | Fetch order |
| `PATCH`| `/api/orders/[id]` | Update order status |
| `GET`  | `/api/vendors` | List vendors (`?status=PENDING`) |
| `GET`  | `/api/vendors/[id]` | Fetch vendor |
| `PATCH`| `/api/vendors/[id]/status` | Approve / suspend / reject vendor |
| `GET`  | `/api/admin/stats` | Platform KPIs |

## Project structure

```
src/
  app/                   Next.js App Router
    page.tsx             Customer home
    deals/               Browse + detail
    checkout/            Checkout flow + server action
    orders/              Customer order history + confirmation
    vendor/              Vendor dashboard, listings, orders
    admin/               Admin overview, vendors, orders
    api/                 REST API routes
  components/
    ui/                  Button, Badge, Card, Input primitives
    layout/              AppShell, TopBar, BottomNav
    deals/               DealCard
    orders/              OrderStatusBadge
    shared/              StatTile, EmptyState
  lib/
    types.ts             Domain types (Prisma-free)
    mock-data.ts         Seed data for vendors, deals, orders
    db.ts                Repository abstraction backed by in-memory store
    format.ts            Currency, date, discount helpers
    utils.ts             cn(), id + pickup-code generators
    session.ts           Mock session (swap for NextAuth later)
    api.ts               Response + Zod helpers for API routes
prisma/
  schema.prisma          Full PostgreSQL schema (User / Vendor / Deal / Order)
```

## Running locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000.

### Demo navigation

From the Customer home page, the "Explore the app as any role" section lets you
jump between:

- `/`          — Customer
- `/vendor`    — Vendor dashboard
- `/admin`     — Admin overview

No login screen is required in the MVP — the app auto-signs you in as a demo
user per role. Replace `src/lib/session.ts` with NextAuth to wire real auth.

## Moving from mock data to Prisma

1. Spin up Postgres (locally or hosted) and set `DATABASE_URL` in `.env`.
2. `npx prisma migrate dev --name init`
3. Add a `seed.ts` that imports `src/lib/mock-data.ts` and writes the rows.
4. Swap `src/lib/db.ts` internals for Prisma queries (the module's exported
   surface — `dealsRepo`, `ordersRepo`, `vendorsRepo`, `statsRepo` — was
   designed to match a Prisma-backed implementation 1:1).
5. UI code never imports Prisma, so nothing else has to change.

## Design language

- **Colors** — Green `#008000` for actions, Orange `#FFA500` for savings /
  highlights, Yellow `#FFD700` for warnings and "only N left" signals.
- **Mobile shell** — A centered 480 px phone-sized shell with rounded corners
  on desktop, so the experience stays mobile-native even on wide screens.
- **Bottom navigation** — Role-aware (Customer / Vendor / Admin).
- **Typography** — System stack, bold and tight on headings for grocery-app
  feel.

## License

MIT for the ChopSave MVP scaffolding. Replace images with your own assets
before production use.
