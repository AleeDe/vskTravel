# VSK Travel Marketplace — Implementation Blueprint

A full-stack travel marketplace where **customers** discover and book services/products, **partners** list and manage offerings, and **admins** oversee the entire ecosystem with commission-based revenue.

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG, file-based routing, Server Components |
| Language | TypeScript | Type safety end-to-end |
| Styling | Tailwind CSS v4 | Utility-first, design token support |
| State | Zustand | Lightweight global state (cart, auth) |
| Backend | Supabase | Auth, Postgres, RLS, Storage, Edge Functions |
| Payments | Stripe | Products checkout; JazzCash/EasyPaisa stubbed |
| Animation | Framer Motion | Page transitions, micro-interactions |
| Icons | Lucide React | Consistent, tree-shakeable |
| Charts | Recharts | Dashboard visualizations |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Phase 1 — Project Scaffold & Foundation

> **Goal:** A running Next.js app with design system ready.

| Agent / Skill | Responsibility |
|---|---|
| **frontend-developer** | Next.js 15 project init, App Router setup, folder structure |
| **antigravity-design-expert** | Design tokens, glassmorphism, spatial UI foundations |
| **tailwind-design-system** | Tailwind v4 config, color palette, typography scale |
| **react-nextjs-development** | Root layout, route groups, TypeScript config |

### [NEW] Project Initialization

```
d:\BabulTech\Travel\
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register, forgot-password)
│   ├── (customer)/           # Customer-facing pages
│   ├── (partner)/            # Partner portal
│   ├── (admin)/              # Admin dashboard
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design tokens + Tailwind
├── components/
│   ├── ui/                   # Base components (Button, Card, Modal, etc.)
│   ├── forms/                # Form primitives (Input, Select, FileUpload)
│   ├── layout/               # Navigation, Sidebar, Footer
│   └── features/             # Feature-specific composites
├── lib/
│   ├── supabase/             # Client + server utilities
│   ├── stripe/               # Payment helpers
│   ├── utils.ts              # Helpers (cn, formatCurrency, etc.)
│   └── constants.ts          # App-wide constants
├── hooks/                    # Custom React hooks
├── store/                    # Zustand stores
├── types/                    # Shared TS types + Supabase generated types
├── public/                   # Static assets
└── package.json
```

#### Key Files

- **`app/globals.css`** — Design tokens: color palette (primary amber-to-gold gradient, dark navy, warm grays), typography scale (Inter + Outfit), spacing, shadows, border-radius, glassmorphism utilities
- **`tailwind.config.ts`** — Extended theme with custom colors, fonts, animation keyframes
- **`lib/supabase/client.ts`** — Browser Supabase client
- **`lib/supabase/server.ts`** — Server-side Supabase client (cookies-based)
- **`lib/utils.ts`** — `cn()`, `formatCurrency()`, `formatDate()`, `slugify()`

---

## Phase 2 — Database Schema & Auth

> **Goal:** Complete Supabase schema with RLS, auth flows, and seed data.

| Agent / Skill | Responsibility |
|---|---|
| **database-architect** | Schema design, normalization, table relationships |
| **postgresql-table-design** | Postgres-specific types, indexes, constraints |
| **auth-implementation-patterns** | Supabase Auth, role-based routing, session management |
| **security-auditor** | RLS policies, access control review |

### Database Tables

```sql
-- Core user extension
profiles (id, email, full_name, phone, avatar_url, role, created_at)

-- Partner applications
partners (id, user_id FK, business_name, description, logo_url, status, commission_rate, approved_at)

-- Categories
service_categories (id, name, slug, icon, description, sort_order, is_active)
product_categories (id, name, slug, icon, description, sort_order, is_active)

-- Listings
services (id, partner_id FK, category_id FK, title, slug, description, price, price_unit, location, images, highlights, inclusions, exclusions, availability_type, status, is_featured, rating_avg, review_count)
products (id, partner_id FK, category_id FK, title, slug, description, base_price, images, variants JSONB, stock, shipping_info JSONB, status, is_featured, rating_avg, review_count)

-- Cart
cart_items (id, user_id FK, item_type, item_id, quantity, variant JSONB, travel_date, travelers JSONB)

-- Orders
orders (id, user_id FK, order_number, subtotal, commission_total, shipping_total, grand_total, status, payment_method, payment_status, shipping_address JSONB)
order_items (id, order_id FK, partner_id FK, item_type, item_id, title, price, quantity, commission_amount, status)

-- Reviews
reviews (id, user_id FK, item_type, item_id, rating, comment, created_at)

-- Commission config
commission_rates (id, category_type, category_id FK, rate_percent, effective_from)

-- Content
banners (id, title, subtitle, image_url, link, position, is_active, sort_order)
```

### RLS Policies (Summary)

| Table | Customer | Partner | Admin |
|---|---|---|---|
| profiles | Own row | Own row | All |
| partners | — | Own record | All |
| services | Read active | Own CRUD | All CRUD |
| products | Read active | Own CRUD | All CRUD |
| cart_items | Own CRUD | — | — |
| orders | Own read | Own items read | All |
| reviews | Own CRUD + Read all | Read own items' | All |

### Auth Flows

- **Registration:** Email/password → auto-create profile → redirect to customer home
- **Login:** Email/password or Google OAuth → detect role → route to correct dashboard
- **Partner signup:** Register → fill onboarding form → status "pending" → admin approval → access granted
- **Admin:** Pre-seeded, login only

---

## Phase 3 — Shared Component Library

> **Goal:** A polished, reusable component library powering all three portals.

| Agent / Skill | Responsibility |
|---|---|
| **frontend-developer** | React component architecture, hooks, TypeScript typing |
| **antigravity-design-expert** | Glassmorphism cards, animations, micro-interactions |
| **ui-ux-designer** | Component UX design, accessibility, responsive behavior |
| **fixing-accessibility** | ARIA labels, keyboard nav, focus management |

### UI Components

| Component | Features |
|---|---|
| `Button` | Variants (primary, secondary, ghost, danger), sizes, loading state, icon support |
| `Card` | Hover lift animation, image slot, badge overlay, glassmorphism variant |
| `Modal` | Backdrop blur, Framer Motion animate, close on escape, focus trap |
| `Badge` | Status colors (active, pending, rejected, featured), pill/dot variants |
| `Table` | Sortable columns, pagination, empty state, loading skeleton |
| `Chart` | Area, Bar, Pie wrappers over Recharts with themed colors |
| `Toast` | Success/error/info, auto-dismiss, stack, slide-in animation |
| `Skeleton` | Pulse animation, card/table/text variants |
| `Avatar` | Image + fallback initials, status dot indicator |
| `Stat` | Number + label + trend arrow + sparkline mini-chart |

### Navigation

| Component | Description |
|---|---|
| `Navbar` | Logo, search, category mega-dropdown, cart icon with count, user avatar menu |
| `Sidebar` | Collapsible, icon + label, active indicator, nested items |
| `MobileDrawer` | Slide-in navigation for mobile, category accordion |
| `SearchBar` | Autocomplete, recent searches, category filter tabs |
| `CartDrawer` | Slide-out panel, item cards, quantity controls, subtotal, checkout CTA |

### Form Components

| Component | Uses |
|---|---|
| `FormField` | Label + input + error + helper text wrapper |
| `TextInput` | Standard, password, search variants |
| `Textarea` | Auto-resize, character count |
| `Select` | Custom styled, searchable, multi-select |
| `FileUpload` | Drag-drop zone, image preview, multiple files |
| `DatePicker` | Calendar popup, range selection |
| `MultiStepForm` | Step indicator, validation per step, animated transitions |

---

## Phase 4 — Customer Flows

> **Goal:** Complete customer-facing experience from discovery to checkout.

| Agent / Skill | Responsibility |
|---|---|
| **frontend-developer** | Page composition, data fetching, server components |
| **react-nextjs-development** | App Router pages, dynamic routes, loading/error states |
| **frontend-design** | Homepage hero, product grids, checkout UX |
| **fixing-metadata** | SEO meta tags, Open Graph, JSON-LD per page |
| **playwright-skill** | Browser-based flow testing (browse → cart → checkout) |

### Pages

#### `/(customer)/page.tsx` — Homepage
- Hero section with background video/image, search overlay, CTA
- Service category scrollers (horizontal cards)
- Featured deals grid (4 cards, auto-rotate)
- Product marketplace teaser (3-column grid)
- Testimonials carousel
- Newsletter signup
- Footer with links, contact, social

#### `/(customer)/services/page.tsx` — Service Listings
- Category sidebar filter
- Location / price range / rating filters
- Sort by (price asc/desc, rating, popular)
- Grid/List toggle
- Infinite scroll with skeleton loading

#### `/(customer)/services/[slug]/page.tsx` — Service Detail
- Image gallery (lightbox)
- Title, price, rating, reviews count, partner badge
- Tabs: Overview, Inclusions/Exclusions, Reviews, Location Map
- Calendar date picker for booking
- Traveler count selector
- "Add to Cart" / "Book Now" CTA
- Related services carousel

#### `/(customer)/products/page.tsx` — Product Listings
- Category filters, price range, rating
- Grid view with hover quick-view
- Add to cart directly from card

#### `/(customer)/products/[slug]/page.tsx` — Product Detail
- Image gallery with zoom
- Variant selector (size/color)
- Stock indicator
- Quantity selector
- Reviews section with star distribution chart
- Related products

#### `/(customer)/cart/page.tsx` — Unified Cart
- Service items (with date, travelers)
- Product items (with quantity, variant)
- Item removal, quantity update
- Services subtotal vs Products subtotal
- Mixed order summary card
- "Proceed to Checkout" CTA

#### `/(customer)/checkout/page.tsx` — Multi-Step Checkout
1. **Contact Details** — Name, email, phone
2. **Traveler Info** — Per service item, traveler details
3. **Shipping** — For product items, address form
4. **Payment** — Card (Stripe) for products; "Pay at Venue" for services
5. **Review & Confirm**

#### `/(customer)/orders/page.tsx` — Order History
- Tabs: All, Services, Products
- Order cards with status badge, items preview, total
- Click to expand details
- "Leave Review" action

#### `/(customer)/dashboard/page.tsx` — Customer Dashboard
- Welcome header with avatar
- Quick stats (total orders, upcoming bookings, saved items)
- Recent orders
- Saved / wishlisted items
- Profile settings

---

## Phase 5 — Partner Portal

> **Goal:** Partners manage their business: listings, orders, earnings.

| Agent / Skill | Responsibility |
|---|---|
| **frontend-developer** | Partner dashboard pages, data tables, form wizards |
| **react-nextjs-development** | Dynamic forms, image uploads, SSR data loading |
| **frontend-design** | Dashboard layout, chart styling, earnings UI |
| **backend-architect** | Partner API routes, order filtering, earnings aggregation |

### Pages

#### `/(partner)/onboarding/page.tsx`
- Multi-step form: Business Info → Contact → Documents → Review → Submit
- Progress bar, step validation
- Submit → creates partner record with status "pending"

#### `/(partner)/dashboard/page.tsx`
- Revenue chart (last 30 days)
- Key metrics: Total Sales, Pending Orders, Rating, Commission Paid
- Recent orders table
- Quick actions (Add Service, Add Product)

#### `/(partner)/services/page.tsx` & `/(partner)/services/new/page.tsx`
- List of partner's services with status badges
- Creation form with dynamic fields per service category
- Image upload, pricing, availability settings

#### `/(partner)/products/page.tsx` & `/(partner)/products/new/page.tsx`
- Product list with stock indicators
- Creation form with variant builder (add sizes, colors with individual pricing)
- Shipping configuration

#### `/(partner)/orders/page.tsx`
- Filterable order table (status, date, type)
- Order detail drawer with customer info, item breakdown, status update actions

#### `/(partner)/earnings/page.tsx`
- Monthly revenue chart
- Commission breakdown table
- Settlement history
- Payout settings

---

## Phase 6 — Admin Dashboard

> **Goal:** Full administrative control over the platform.

| Agent / Skill | Responsibility |
|---|---|
| **frontend-developer** | Admin pages, KPI cards, data tables, modals |
| **react-nextjs-development** | Server components for admin data, route protection |
| **frontend-design** | Admin dashboard aesthetic, chart theming |
| **database-optimizer** | Query optimization for aggregation endpoints |
| **security-auditor** | Admin route protection, RLS verification |

### Pages

#### `/(admin)/dashboard/page.tsx`
- KPI cards: Revenue, Orders, Active Partners, Active Listings
- Revenue trend chart (area)
- Orders by status (donut)
- Top partners table
- Recent activity feed

#### `/(admin)/partners/page.tsx`
- Partner table with search, status filter
- Approve / Reject actions with confirmation modal
- View partner detail (listings, orders, revenue)
- Edit commission rate per partner

#### `/(admin)/listings/page.tsx`
- Combined services + products table
- Approval queue (pending listings)
- Feature / Unfeature toggle
- Deactivate / Reactivate actions

#### `/(admin)/categories/page.tsx`
- Service categories CRUD
- Product categories CRUD
- Drag-and-drop sort order
- Icon picker

#### `/(admin)/commissions/page.tsx`
- Commission rates table per category
- Edit rate modal
- Commission transactions log
- Total commission earned chart

#### `/(admin)/orders/page.tsx`
- Global orders table with filters
- Order timeline view
- Dispute management

#### `/(admin)/content/page.tsx`
- Banner management (hero, promotions)
- Featured items selector
- Announcement editor

---

## Phase 7 — Payment Integration

> **Goal:** Stripe for products, information-based booking for services.

| Agent / Skill | Responsibility |
|---|---|
| **payment-integration** | Stripe Checkout, webhooks, order status updates |
| **stripe-integration** | Checkout sessions, webhook handler, secret management |
| **pakistan-payments-stack** | JazzCash/EasyPaisa UI stubs, PKR formatting |
| **backend-security-coder** | Webhook signature verification, payment validation |

### Implementation

- **Products:** Stripe Checkout Session for product-only or mixed orders (product portion)
- **Services:** No upfront payment — booking confirmed with details, payment at venue
- **Mixed Orders:** Backend splits order into service bookings + product purchases; only product total goes through Stripe
- **Pakistani Methods (Stubbed):** JazzCash / EasyPaisa selection UI with "Coming Soon" badge; mock success callback
- **Webhooks:** Stripe webhook handler at `/api/webhooks/stripe` to update order/payment status

---

## Phase 8 — Polish, Testing & Deployment

> **Goal:** Production-ready, visually polished, accessible, and performant.

| Agent / Skill | Responsibility |
|---|---|
| **ui-visual-validator** | Visual regression, design consistency checks |
| **playwright-skill** | E2E flow testing across all 3 portals |
| **web-performance-optimization** | Core Web Vitals, bundle size, image optimization |
| **fixing-accessibility** | WCAG 2.1 AA audit, contrast, keyboard, screen reader |
| **fixing-metadata** | Final SEO pass, structured data, sitemap |
| **vercel-deployment** | Production deploy, environment variables, domain |

- Responsive layouts verified at 320px, 375px, 768px, 1024px, 1440px
- Framer Motion page transitions, list stagger animations, hover micro-interactions
- Loading states with skeleton screens on every data-fetch page
- WCAG 2.1 AA: focus rings, color contrast, ARIA labels, keyboard nav
- SEO: dynamic meta tags per page, JSON-LD structured data, sitemap
- Performance: image optimization (next/image), dynamic imports, route-based code splitting

---

## Verification Plan

### Automated (via Browser Subagent)

After each phase, the browser subagent will:

1. **Navigate** to the dev server at `http://localhost:3000`
2. **Screenshot** each newly built page at desktop and mobile widths
3. **Click through** primary user flows (register → browse → add to cart → checkout)
4. **Verify** responsive behavior by resizing the browser window
5. **Check** form validation by submitting empty/invalid forms
6. **Validate** role-based routing (customer can't access admin, etc.)

### Manual Verification (User)

After each phase, the user should:

1. Open the running dev server at `http://localhost:3000`
2. Test the flows built in that phase as described in the walkthrough
3. Check visual quality, animations, and responsiveness
4. Provide feedback before the next phase begins

> [!IMPORTANT]
> Each phase will be implemented sequentially. After each phase I will present a walkthrough with screenshots and request your approval before proceeding to the next phase. This ensures course-correction early and often.
