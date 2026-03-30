# Static Data Management Guide

Your static/seed data is now separated from the schema definition for easier management!

---

## 📁 Files

### `supabase/schema.sql`
- **Contains:** Database schema, tables, RLS policies, triggers
- **Does NOT contain:** Static data
- **Run:** First, to create all tables and structure

### `supabase/seed-static-data.sql` (NEW)
- **Contains:** All static data (categories, defaults, etc.)
- **Run:** After schema.sql is created
- **Update this:** Whenever you want to add/modify categories or static data

---

## 🚀 Setup Process

### Step 1: Create Schema
```
Supabase Dashboard → SQL Editor
→ Copy contents of: supabase/schema.sql
→ Paste and run
```

**Result:** All tables created, empty categories

### Step 2: Seed Data
```
Supabase Dashboard → SQL Editor
→ Copy contents of: supabase/seed-static-data.sql
→ Paste and run
```

**Result:** Categories populated with service and product types

---

## 📝 Current Static Data

### Service Categories (6)
```
Flights, Hotels, Tour Packages, Visa Assistance, Car Rentals, Travel Insurance
```

### Product Categories (5)
```
Luggage & Bags, Travel Gear, Accessories, Travel Clothing, Electronics
```

---

## ✏️ Add New Static Data

### To Add a New Service Category

Edit `supabase/seed-static-data.sql`:

```sql
INSERT INTO public.service_categories (name, slug, icon, sort_order) VALUES
  ('Flights',           'flights',          '✈️',  1),
  ('Hotels',            'hotels',           '🏨',  2),
  ('Tour Packages',     'tour-packages',    '🗺️',  3),
  -- ADD NEW CATEGORY HERE:
  ('New Category',      'new-slug',         '🆕',  7)
ON CONFLICT (slug) DO NOTHING;
```

Then:
1. Run the updated `seed-static-data.sql` in Supabase
2. New category is added!

### To Add a New Product Category

Same process:

```sql
INSERT INTO public.product_categories (name, slug, icon, sort_order) VALUES
  ('Luggage & Bags',    'luggage',       '🧳',  1),
  -- ADD HERE:
  ('New Products',      'new-products',  '🆕',  6)
ON CONFLICT (slug) DO NOTHING;
```

---

## 🔄 Update Existing Category

### Option 1: Via SQL (Direct)

```sql
UPDATE public.service_categories
SET name = 'Updated Name', icon = '🆕'
WHERE slug = 'flights';
```

### Option 2: Via Supabase Dashboard

1. Go to SQL Editor
2. Run update query
3. Or use the Data Editor UI

### Option 3: Via seed file (for reproducibility)

Update `seed-static-data.sql` with the corrected data, then re-run:

```sql
-- Delete old data
DELETE FROM public.service_categories WHERE slug = 'flights';

-- Insert updated
INSERT INTO public.service_categories (name, slug, icon, sort_order) VALUES
  ('Flights (Updated)', 'flights', '✈️', 1)
ON CONFLICT (slug) DO NOTHING;
```

---

## 🗑️ Delete a Category

### Delete Category (careful!)

```sql
DELETE FROM public.service_categories WHERE slug = 'flights';
```

⚠️ **Warning:** If services already use this category, they'll be orphaned!

**Better approach:** Disable instead of delete:

```sql
UPDATE public.service_categories
SET is_active = false
WHERE slug = 'flights';
```

Then services can't be added with this category, but existing ones still work.

---

## 🔍 Query All Static Data

### List all service categories

```sql
SELECT * FROM public.service_categories ORDER BY sort_order;
```

### List all product categories

```sql
SELECT * FROM public.product_categories ORDER BY sort_order;
```

### See which categories are active

```sql
SELECT * FROM public.service_categories WHERE is_active = true;
```

---

## ✅ Checklist for Deployment

- [ ] Run `schema.sql` first (creates tables)
- [ ] Run `seed-static-data.sql` second (populates data)
- [ ] Verify categories appear in database
- [ ] Test API endpoints to list categories
- [ ] Test creating service/product with each category

---

## 🎯 Benefits of Separation

### Before (Static data in schema.sql)
- ❌ Schema and data mixed together
- ❌ Hard to update categories without recreating schema
- ❌ Can't reload categories without rebuilding schema

### After (Separate seed file)
- ✅ Clear separation of concerns
- ✅ Easy to update categories anytime
- ✅ Can reload categories independently
- ✅ Better for migrations and backups
- ✅ Easy to maintain multiple environments

---

## 🔧 For Developers

### Adding to seed-static-data.sql

When adding new static data tables:

1. Add INSERT statements to `seed-static-data.sql`
2. Use `ON CONFLICT DO NOTHING` to prevent duplicates
3. Add verification queries to confirm data
4. Document the data in this guide

### Example Template

```sql
-- ============================================================
-- NEW DATA TABLE
-- ============================================================

INSERT INTO public.new_table (column1, column2) VALUES
  ('value1', 'value2'),
  ('value3', 'value4')
ON CONFLICT (unique_column) DO NOTHING;

-- Verify
SELECT 'New Table:' as info;
SELECT COUNT(*) FROM public.new_table;
```

---

## 📊 Seed Data Best Practices

1. **Always use ON CONFLICT** to make scripts idempotent
   ```sql
   -- ✅ Good - can run multiple times
   INSERT INTO ... ON CONFLICT DO NOTHING;

   -- ❌ Bad - will fail on second run
   INSERT INTO ...;
   ```

2. **Add verification queries** to see results
   ```sql
   SELECT 'Categories:' as info;
   SELECT COUNT(*) FROM service_categories;
   ```

3. **Document changes** in this guide

4. **Test locally first** before deploying to production

5. **Keep data minimal** - only include essential static data

6. **Version your seed file** - treat it like code
   - Git track it
   - Review changes
   - Test before deploying

---

## 🚀 Common Tasks

### Reset Categories (Nuclear Option)

```sql
-- Delete all categories
TRUNCATE public.service_categories CASCADE;
TRUNCATE public.product_categories CASCADE;

-- Then re-run seed-static-data.sql
```

### Export Current Data as SQL

```sql
-- To backup/export current categories as INSERT statements
-- Use Supabase UI → Data → service_categories → Export

-- Or query manually:
SELECT
  'INSERT INTO public.service_categories (name, slug, icon, sort_order) VALUES'
  || string_agg(
    format("('', '%s', '%s', %L)", name, slug, icon, sort_order),
    ',
  '
  )
  || ';' as insert_statement
FROM public.service_categories;
```

### Copy Categories Between Environments

```sql
-- Export from production
SELECT * FROM public.service_categories;

-- Import to staging/development
INSERT INTO public.service_categories (name, slug, icon, sort_order)
VALUES ... ON CONFLICT DO NOTHING;
```

---

## Questions?

- **"Can I modify seed-static-data.sql?"** Yes! Update it anytime
- **"Will re-running it duplicate data?"** No - uses ON CONFLICT
- **"Should schema.sql have any data?"** No - only schema now
- **"Can I add more tables?"** Yes - follow the template
- **"How do I version this?"** Git track it like any SQL file

---

**Summary:** Schema and data are now separated. Schema first, then seed data! 🎉
