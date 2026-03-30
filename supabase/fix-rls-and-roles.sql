-- ============================================================
-- VSK Travel — Role Assignment & RLS Policy Fixes
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ensure RLS is enabled on profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop old/conflicting policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 3. Re-create RLS policies (idempotent)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'admin');

-- 4. Verify the helper function exists
-- (This should already exist from schema.sql, but let's ensure it)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 5. Check if any admin users exist
SELECT 'Current admin count:' as info, COUNT(*) as count FROM public.profiles WHERE role = 'admin';

-- 6. If no admins, you'll need to:
--    a) Sign up a test user in the app
--    b) Call POST /api/admin/init to promote them
--    c) Or manually run:
--       UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
--
-- To find your user ID:
--   SELECT id, email, role FROM public.profiles ORDER BY created_at DESC LIMIT 5;

-- 7. Test: Verify that profiles can read their own role
-- (This query should return at least one row if authenticated as yourself)
SELECT 'Profile lookup test (as yourself):' as info;
-- You'll need to test this by running from a logged-in context
