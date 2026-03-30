-- ============================================================
-- VSK Travel — Static/Seed Data
-- Run this in Supabase Dashboard → SQL Editor AFTER schema.sql
-- ============================================================
-- This file contains all static data (categories, default settings, etc.)
-- Update this file as needed and re-run to seed new data
-- ============================================================

-- ============================================================
-- 1. SERVICE CATEGORIES
-- ============================================================

INSERT INTO public.service_categories (name, slug, icon, sort_order) VALUES
  ('Flights',           'flights',          '✈️',  1),
  ('Hotels',            'hotels',           '🏨',  2),
  ('Tour Packages',     'tour-packages',    '🗺️',  3),
  ('Visa Assistance',   'visa-assistance',  '📋',  4),
  ('Car Rentals',       'car-rentals',      '🚗',  5),
  ('Travel Insurance',  'travel-insurance', '🛡️',  6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. PRODUCT CATEGORIES
-- ============================================================

INSERT INTO public.product_categories (name, slug, icon, sort_order) VALUES
  ('Luggage & Bags',    'luggage',       '🧳',  1),
  ('Travel Gear',       'travel-gear',   '⛺',  2),
  ('Accessories',       'accessories',   '🎒',  3),
  ('Travel Clothing',   'clothing',      '👕',  4),
  ('Electronics',       'electronics',   '📱',  5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 3. VERIFY DATA WAS INSERTED
-- ============================================================

SELECT 'Service Categories:' as category;
SELECT COUNT(*) as count, 'service_categories' as table_name FROM public.service_categories;

SELECT 'Product Categories:' as category;
SELECT COUNT(*) as count, 'product_categories' as table_name FROM public.product_categories;

-- ============================================================
-- 4. VIEW ALL DATA
-- ============================================================

SELECT 'All Service Categories:' as info;
SELECT id, name, slug, icon, sort_order, is_active FROM public.service_categories ORDER BY sort_order;

SELECT 'All Product Categories:' as info;
SELECT id, name, slug, icon, sort_order, is_active FROM public.product_categories ORDER BY sort_order;
