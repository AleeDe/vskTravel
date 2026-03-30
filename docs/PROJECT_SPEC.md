# VSK Travel — Project Specification (Full)

Last updated: 2026-03-27

---

## 1) Overview

VSK Travel is a Next.js + Supabase powered e-commerce + services marketplace for travel products (e.g., luggage) and services (e.g., flight booking, tours), including partner onboarding, checkout, orders, reviews, and commission accounting.

- Frontend: Next.js (App Router), TailwindCSS
- Backend: Supabase (Postgres + Auth + Edge Functions)
- Payments: Stripe (card) + JazzCash / EasyPaisa (local)
- Notifications: Resend (email), Twilio/Noor (SMS)
- Deployment: Vercel (app), Supabase (DB + functions)

Key folders/files:
- App config: [next.config.ts](../next.config.ts), [tsconfig.json](../tsconfig.json)
- Env templates: [.env.example](../.env.example)
- DB schema: [supabase/schema.sql](../supabase/schema.sql)
- Edge Functions: [supabase/functions/](../supabase/functions)
- Docs: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md), [EDGE_FUNCTIONS_GUIDE.md](../EDGE_FUNCTIONS_GUIDE.md)

---

## 2) Environment Variables

Required for local and production. Copy `.env.example` to `.env.local` and fill.

- Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server use only; Edge Functions)
- App:
  - `NEXT_PUBLIC_APP_URL` (e.g., http://localhost:3000 or https://yourdomain.com)
- Stripe:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Email (Resend):
  - `RESEND_API_KEY`
- SMS (choose provider):
  - Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
  - Noor SMS: `NOOR_SMS_API_KEY`
- Local gateways:
  - JazzCash: `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, `JAZZCASH_INTEGRITY_SALT`, `JAZZCASH_RETURN_URL`, `JAZZCASH_SANDBOX`
  - EasyPaisa: `EASYPAISA_STORE_ID`, `EASYPAISA_HASH_KEY`, `EASYPAISA_RETURN_URL`, `EASYPAISA_SANDBOX`
- Cron/Automation:
  - `CRON_SECRET`

Note: Do not commit real secrets. For Vercel, add all vars in Project → Settings → Environment Variables. For Supabase Edge Functions, set secrets in Project → Settings → Secrets.

---

## 3) Install, Run, and Verify

Local setup:
1. Copy envs: `cp .env.example .env.local`
2. Install deps: `npm install`
3. Start dev: `npm run dev` → open http://localhost:3000
4. Database init:
   - Supabase Dashboard → SQL Editor → paste + run [supabase/schema.sql](../supabase/schema.sql)
   - This creates all tables, RLS, and seed categories
5. Deploy functions (optional locally):
   - `npm i -g supabase`
   - `supabase login` → `supabase link --project-ref <your-ref>`
   - `supabase functions deploy`

Smoke checks:
- Auth signup/login works; `profiles` row auto-created
- Browse listings (services/products) — will show once data exists
- Create a test order (using API route or Edge Functions)

---

## 4) Database Schema (Postgres on Supabase)

Authoritative schema is in [supabase/schema.sql](../supabase/schema.sql). Summary below.

Core entities:
- `auth.users` (managed by Supabase Auth)
- `profiles` (1–1 with `auth.users` via trigger `handle_new_user()`)
- Partners and Listings:
  - `partners` (extends user to partner, commission_rate)
  - `service_categories`, `product_categories`
  - `services` (partner services)
  - `products` (partner goods)
- Commerce:
  - `cart_items` (polymorphic: service/product)
  - `orders` (header)
  - `order_items` (line items, per partner; holds commission values)
  - `commission_transactions` (derived per order_item)
  - `commission_rates` (per-category overrides)
- Marketing/UX:
  - `banners`
- Ops/Analytics:
  - `partner_payouts` (monthly aggregates; used by payouts function)
  - `analytics_events` (inserted by `track-event` function)

Relationships (high level):
- `profiles.id` → `partners.user_id`
- `partners.id` → `services.partner_id`, `products.partner_id`, `order_items.partner_id`, `commission_transactions.partner_id`, `partner_payouts.partner_id`
- `service_categories.id` → `services.category_id`
- `product_categories.id` → `products.category_id`
- `orders.id` → `order_items.order_id`, `reviews.order_id`, `commission_transactions.order_item_id` (via `order_items`)
- `profiles.id` → `orders.customer_id`, `reviews.user_id`, `cart_items.user_id`

Key constraints/indexes:
- Unique slugs on `services.slug`, `products.slug`
- Status/city/category indexes on listings
- Composite uniqueness on `reviews` to prevent duplicates

RLS overview:
- Users can read/update own `profiles`
- Partners can manage own `partners`, `services`, `products`, and view own `order_items`/`commissions`
- Customers can manage own `cart_items`, view/create own `orders`
- Public read for categories, active listings, active banners
- Admin can manage all (via `public.get_my_role()` helper)
- New tables `partner_payouts`, `analytics_events`: RLS enabled; default admin read policies added. Edge Functions use service role and bypass RLS for inserts.

Notes and gaps:
- `process-order-reminders` refers to `service_date` and `reminder_sent` on `order_items`; current schema has `booking_date` and no `reminder_sent`. Decide either to
  - update function to use `booking_date` and a status flag, or
  - extend schema to add `service_date` + `reminder_sent boolean`.

---

## 5) Edge Functions (Supabase)

Location: [supabase/functions/](../supabase/functions). See [EDGE_FUNCTIONS_GUIDE.md](../EDGE_FUNCTIONS_GUIDE.md) for details and examples.

- Payments:
  - `create-order` — creates `orders` + `order_items`
  - `stripe-checkout` — creates Stripe Checkout session
  - `stripe-webhook` — syncs `orders.payment_status` on events
  - `jazzcash-checkout` — returns hosted checkout payload
  - `easypaisa-checkout` — returns hosted checkout payload
- Notifications:
  - `send-email` — templated emails via Resend
  - `send-sms` — SMS via Twilio/Noor
- Ops/Admin:
  - `calculate-payouts` — aggregates `commission_transactions` into `partner_payouts`
  - `validate-listing` — content/quality checks for new listings
- Analytics/Automation:
  - `track-event` — inserts into `analytics_events`
  - `process-order-reminders` — reminders + expire stale pending orders (cron; `CRON_SECRET`)

Required Edge Function secrets: set in Supabase → Settings → Secrets
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Payment: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, JazcCash/EasyPaisa keys
- Email: `RESEND_API_KEY`
- SMS: Twilio or Noor keys
- Automation: `CRON_SECRET`, `FRONTEND_URL` (if used in templates)

---

## 6) Runtime Supabase Clients

- Browser client: [src/lib/supabase/client.ts](../src/lib/supabase/client.ts)
- Server/middleware: [src/proxy.ts](../src/proxy.ts)

These read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 7) API Routes (Next.js)

Examples interacting with DB:
- Orders API: [src/app/api/orders/route.ts](../src/app/api/orders/route.ts)
- Stripe webhook (server route): [src/app/api/webhooks/stripe/route.ts](../src/app/api/webhooks/stripe/route.ts)

Note: Duplicate functionality may exist in Edge Functions; prefer one integration path to avoid drift.

---

## 8) End-to-End Flows

Checkout (Stripe variant):
1. Frontend builds cart
2. Call `create-order` → returns `{ orderId, orderNumber }`
3. Call `stripe-checkout` → returns `{ url }` and redirect
4. Stripe completes → `stripe-webhook` updates `orders.payment_status`

Analytics:
- Frontend posts events to `track-event` (non-blocking)
- Function inserts rows in `analytics_events` with IP/user-agent

Partner commissions and payouts:
- `order_items` store `commission_rate` and `commission_amount`
- `commission_transactions` track settlements
- Monthly, `calculate-payouts` writes `partner_payouts`

---

## 9) Deployment Summary

- App → Vercel; add all env vars; set domain; update Supabase Auth URLs
- DB → run [supabase/schema.sql](../supabase/schema.sql) once per environment
- Functions → `supabase functions deploy`; set function secrets
- Stripe → configure webhook to `.../functions/v1/stripe-webhook`

Use [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for a step-by-step checklist.

---

## 10) Maintenance & Observability

- Supabase Logs → Functions + Postgres
- Vercel Analytics + Logs
- Error tracking (optional): Sentry
- Backups: Supabase PITR/Backups

---

## 11) Open Items / Decisions

- Align `process-order-reminders` with schema (`service_date` vs `booking_date`); recommend updating function to use `booking_date` and add a `reminder_sent_at` timestamp in `order_items`.
- Confirm if `commission_rates` overrides are active in pricing logic; otherwise remove or integrate on listing publish.

---

## 12) Quick Commands

```bash
# Local dev
npm install
npm run dev

# TypeScript checks
npm run type-check

# Supabase CLI (optional)
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy

# Vercel deploy (requires vercel CLI and project)
vercel --prod
```
