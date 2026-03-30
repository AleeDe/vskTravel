-- ============================================================
-- VSK Travel — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  phone        text,
  avatar_url   text,
  role         text not null default 'customer' check (role in ('customer', 'partner', 'admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. PARTNERS
-- ============================================================
create table public.partners (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  business_name    text not null,
  business_type    text not null,
  description      text,
  logo_url         text,
  banner_url       text,
  phone            text not null,
  address          text,
  city             text,
  cnic             text,
  bank_name        text,
  bank_account     text,
  commission_rate  numeric(5,2) not null default 10.00,
  status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  total_earnings   numeric(12,2) not null default 0,
  total_orders     integer not null default 0,
  avg_rating       numeric(3,2) not null default 0,
  approved_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id)
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
create table public.service_categories (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  icon         text,
  description  text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table public.product_categories (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  icon         text,
  description  text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 4. SERVICES
-- ============================================================
create table public.services (
  id                 uuid primary key default uuid_generate_v4(),
  partner_id         uuid not null references public.partners(id) on delete cascade,
  category_id        uuid not null references public.service_categories(id),
  title              text not null,
  slug               text not null unique,
  description        text not null,
  short_description  text,
  images             text[] not null default '{}',
  base_price         numeric(12,2) not null,
  sale_price         numeric(12,2),
  currency           text not null default 'PKR',
  location           text,
  city               text,
  duration           text,
  max_capacity       integer,
  includes           text[],
  excludes           text[],
  highlights         text[],
  itinerary          jsonb,
  dynamic_fields     jsonb,
  status             text not null default 'draft' check (status in ('draft', 'pending', 'active', 'rejected', 'archived')),
  is_featured        boolean not null default false,
  avg_rating         numeric(3,2) not null default 0,
  total_reviews      integer not null default 0,
  total_bookings     integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_services_partner on public.services(partner_id);
create index idx_services_category on public.services(category_id);
create index idx_services_status on public.services(status);
create index idx_services_city on public.services(city);

-- ============================================================
-- 5. PRODUCTS
-- ============================================================
create table public.products (
  id                 uuid primary key default uuid_generate_v4(),
  partner_id         uuid not null references public.partners(id) on delete cascade,
  category_id        uuid not null references public.product_categories(id),
  title              text not null,
  slug               text not null unique,
  description        text not null,
  short_description  text,
  images             text[] not null default '{}',
  base_price         numeric(12,2) not null,
  sale_price         numeric(12,2),
  currency           text not null default 'PKR',
  sku                text,
  stock_quantity     integer not null default 0,
  track_inventory    boolean not null default true,
  weight             numeric(8,2),
  dimensions         jsonb,
  variants           jsonb,
  tags               text[],
  dynamic_fields     jsonb,
  status             text not null default 'draft' check (status in ('draft', 'pending', 'active', 'rejected', 'archived')),
  is_featured        boolean not null default false,
  avg_rating         numeric(3,2) not null default 0,
  total_reviews      integer not null default 0,
  total_sold         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_products_partner on public.products(partner_id);
create index idx_products_category on public.products(category_id);
create index idx_products_status on public.products(status);

-- ============================================================
-- 6. CART ITEMS
-- ============================================================
create table public.cart_items (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  item_type       text not null check (item_type in ('service', 'product')),
  service_id      uuid references public.services(id) on delete cascade,
  product_id      uuid references public.products(id) on delete cascade,
  quantity        integer not null default 1 check (quantity > 0),
  variant_info    jsonb,
  booking_date    date,
  booking_time    text,
  travelers_count integer,
  created_at      timestamptz not null default now(),
  constraint cart_item_has_one_item check (
    (item_type = 'service' and service_id is not null and product_id is null) or
    (item_type = 'product' and product_id is not null and service_id is null)
  )
);

create index idx_cart_user on public.cart_items(user_id);

-- ============================================================
-- 7. ORDERS
-- ============================================================
create table public.orders (
  id               uuid primary key default uuid_generate_v4(),
  order_number     text not null unique,
  customer_id      uuid not null references public.profiles(id),
  status           text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','completed','cancelled','refunded')),
  subtotal         numeric(12,2) not null,
  discount_amount  numeric(12,2) not null default 0,
  shipping_amount  numeric(12,2) not null default 0,
  tax_amount       numeric(12,2) not null default 0,
  total_amount     numeric(12,2) not null,
  currency         text not null default 'PKR',
  payment_method   text,
  payment_status   text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  stripe_session_id text,
  shipping_address jsonb,
  traveler_info    jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_payment_status on public.orders(payment_status);

-- ============================================================
-- 8. ORDER ITEMS
-- ============================================================
create table public.order_items (
  id                uuid primary key default uuid_generate_v4(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  partner_id        uuid not null references public.partners(id),
  item_type         text not null check (item_type in ('service', 'product')),
  service_id        uuid references public.services(id),
  product_id        uuid references public.products(id),
  title             text not null,
  image_url         text,
  quantity          integer not null default 1,
  unit_price        numeric(12,2) not null,
  total_price       numeric(12,2) not null,
  variant_info      jsonb,
  booking_date      date,
  booking_time      text,
  travelers_count   integer,
  commission_rate   numeric(5,2) not null,
  commission_amount numeric(12,2) not null,
  status            text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','completed','cancelled','refunded')),
  created_at        timestamptz not null default now()
);

create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_partner on public.order_items(partner_id);

-- ============================================================
-- 9. REVIEWS
-- ============================================================
create table public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  order_id     uuid not null references public.orders(id),
  item_type    text not null check (item_type in ('service', 'product')),
  service_id   uuid references public.services(id) on delete cascade,
  product_id   uuid references public.products(id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  title        text,
  comment      text,
  images       text[],
  is_verified  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index idx_reviews_unique on public.reviews(user_id, order_id, item_type, coalesce(service_id, '00000000-0000-0000-0000-000000000000'::uuid), coalesce(product_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index idx_reviews_service on public.reviews(service_id);
create index idx_reviews_product on public.reviews(product_id);

-- ============================================================
-- 10. COMMISSION TRANSACTIONS
-- ============================================================
create table public.commission_transactions (
  id                uuid primary key default uuid_generate_v4(),
  order_item_id     uuid not null references public.order_items(id),
  partner_id        uuid not null references public.partners(id),
  order_amount      numeric(12,2) not null,
  commission_rate   numeric(5,2) not null,
  commission_amount numeric(12,2) not null,
  partner_amount    numeric(12,2) not null,
  status            text not null default 'pending' check (status in ('pending','settled','refunded')),
  settled_at        timestamptz,
  created_at        timestamptz not null default now()
);

create index idx_commission_partner on public.commission_transactions(partner_id);

-- ============================================================
-- 11. BANNERS
-- ============================================================
create table public.banners (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  subtitle     text,
  image_url    text not null,
  link_url     text,
  position     text not null default 'hero' check (position in ('hero', 'promo', 'sidebar')),
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  starts_at    timestamptz,
  ends_at      timestamptz,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 12. COMMISSION RATES (per category)
-- ============================================================
create table public.commission_rates (
  id             uuid primary key default uuid_generate_v4(),
  category_type  text not null check (category_type in ('service', 'product')),
  category_id    uuid not null,
  rate_percent   numeric(5,2) not null,
  effective_from timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles              enable row level security;
alter table public.partners              enable row level security;
alter table public.service_categories   enable row level security;
alter table public.product_categories   enable row level security;
alter table public.services             enable row level security;
alter table public.products             enable row level security;
alter table public.cart_items           enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.reviews              enable row level security;
alter table public.commission_transactions enable row level security;
alter table public.banners              enable row level security;
alter table public.commission_rates     enable row level security;

-- Helper: get current user role
create or replace function public.get_my_role()
returns text language sql security definer stable as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---- PROFILES ----
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on public.profiles for select using (public.get_my_role() = 'admin');

-- ---- PARTNERS ----
create policy "Partners can view own record"
  on public.partners for select using (user_id = auth.uid());
create policy "Partners can update own record"
  on public.partners for update using (user_id = auth.uid());
create policy "Anyone can create partner application"
  on public.partners for insert with check (user_id = auth.uid());
create policy "Admins can manage all partners"
  on public.partners for all using (public.get_my_role() = 'admin');

-- ---- CATEGORIES (public read) ----
create policy "Anyone can read service categories"
  on public.service_categories for select using (true);
create policy "Admins can manage service categories"
  on public.service_categories for all using (public.get_my_role() = 'admin');
create policy "Anyone can read product categories"
  on public.product_categories for select using (true);
create policy "Admins can manage product categories"
  on public.product_categories for all using (public.get_my_role() = 'admin');

-- ---- SERVICES ----
create policy "Anyone can read active services"
  on public.services for select using (status = 'active');
create policy "Partners can manage own services"
  on public.services for all using (
    partner_id in (select id from public.partners where user_id = auth.uid())
  );
create policy "Admins can manage all services"
  on public.services for all using (public.get_my_role() = 'admin');

-- ---- PRODUCTS ----
create policy "Anyone can read active products"
  on public.products for select using (status = 'active');
create policy "Partners can manage own products"
  on public.products for all using (
    partner_id in (select id from public.partners where user_id = auth.uid())
  );
create policy "Admins can manage all products"
  on public.products for all using (public.get_my_role() = 'admin');

-- ---- CART ITEMS ----
create policy "Users can manage own cart"
  on public.cart_items for all using (user_id = auth.uid());

-- ---- ORDERS ----
create policy "Customers can view own orders"
  on public.orders for select using (customer_id = auth.uid());
create policy "Customers can create orders"
  on public.orders for insert with check (customer_id = auth.uid());
create policy "Admins can manage all orders"
  on public.orders for all using (public.get_my_role() = 'admin');

-- ---- ORDER ITEMS ----
create policy "Customers can view own order items"
  on public.order_items for select using (
    order_id in (select id from public.orders where customer_id = auth.uid())
  );
create policy "Partners can view own order items"
  on public.order_items for select using (
    partner_id in (select id from public.partners where user_id = auth.uid())
  );
create policy "Partners can update own order item status"
  on public.order_items for update using (
    partner_id in (select id from public.partners where user_id = auth.uid())
  );
create policy "Admins can manage all order items"
  on public.order_items for all using (public.get_my_role() = 'admin');

-- ---- REVIEWS ----
create policy "Anyone can read reviews"
  on public.reviews for select using (true);
create policy "Users can manage own reviews"
  on public.reviews for all using (user_id = auth.uid());
create policy "Admins can manage all reviews"
  on public.reviews for all using (public.get_my_role() = 'admin');

-- ---- COMMISSION TRANSACTIONS ----
create policy "Partners can view own commissions"
  on public.commission_transactions for select using (
    partner_id in (select id from public.partners where user_id = auth.uid())
  );
create policy "Admins can manage all commissions"
  on public.commission_transactions for all using (public.get_my_role() = 'admin');

-- ---- BANNERS ----
create policy "Anyone can read active banners"
  on public.banners for select using (is_active = true);
create policy "Admins can manage banners"
  on public.banners for all using (public.get_my_role() = 'admin');

-- ---- COMMISSION RATES ----
create policy "Anyone can read commission rates"
  on public.commission_rates for select using (true);
create policy "Admins can manage commission rates"
  on public.commission_rates for all using (public.get_my_role() = 'admin');

-- ============================================================
-- SEED DATA
-- ============================================================
-- NOTE: Static data has been moved to: supabase/seed-static-data.sql
-- Run this file AFTER schema.sql is created to populate categories
--
-- To seed data:
-- 1. Create schema: Run schema.sql in SQL Editor
-- 2. Seed categories: Run seed-static-data.sql in SQL Editor
-- ============================================================

-- ============================================================
-- 13. ADDITIONAL TABLES USED BY EDGE FUNCTIONS
--    (Added to align with deployed functions)
-- ============================================================

create table if not exists public.partner_payouts (
  id                 uuid primary key default uuid_generate_v4(),
  partner_id         uuid references public.partners(id) on delete set null,
  month              text, -- e.g., "2026-03"
  total_commission   numeric(12,2),
  total_gross        numeric(12,2),
  transaction_count  integer,
  status             text not null default 'pending' check (status in ('pending','paid','failed')),
  created_at         timestamptz not null default now()
);

-- Analytics events captured via edge function `track-event`
create table if not exists public.analytics_events (
  id           uuid primary key default uuid_generate_v4(),
  event_name   text not null,
  user_id      uuid,
  session_id   text,
  properties   jsonb,
  page_path    text,
  referrer     text,
  user_agent   text,
  ip_address   text,
  created_at   timestamptz not null default now()
);

-- Enable RLS for new tables
alter table if exists public.partner_payouts      enable row level security;
alter table if exists public.analytics_events     enable row level security;

-- Basic admin read policies (service role bypasses RLS for inserts)
drop policy if exists "Admins can view partner payouts" on public.partner_payouts;
create policy "Admins can view partner payouts"
  on public.partner_payouts for select using (public.get_my_role() = 'admin');

drop policy if exists "Admins can view analytics events" on public.analytics_events;
create policy "Admins can view analytics events"
  on public.analytics_events for select using (public.get_my_role() = 'admin');

-- ------------------------------------------------------------
-- 14. SCHEMA PATCHES (idempotent)
-- ------------------------------------------------------------

-- Add reminder_sent_at to order_items for reminder tracking
alter table if exists public.order_items
  add column if not exists reminder_sent_at timestamptz;

-- Helpful index for reminder scan
create index if not exists idx_order_items_booking_date
  on public.order_items(booking_date)
  where item_type = 'service' and booking_date is not null;
