-- ============================================================
-- Fix Null Roles Issue
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Fix existing NULL roles (set to 'customer')
UPDATE public.profiles
SET role = 'customer'
WHERE role IS NULL;

-- 2. Verify the fix
SELECT 'Profiles with NULL roles after fix:' as check_result;
SELECT COUNT(*) as null_role_count FROM public.profiles WHERE role IS NULL;

-- 3. Recreate the trigger to EXPLICITLY set role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    'customer'  -- EXPLICITLY set default role
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Verify all profiles now have a role
SELECT 'Profile roles after fix:' as check_result;
SELECT role, COUNT(*) as count FROM public.profiles GROUP BY role ORDER BY count DESC;

-- 5. Test: Find your user and verify role is set
SELECT 'Your profile:' as check_result;
SELECT id, email, role, created_at FROM public.profiles
WHERE id = 'caadeabe-8702-4b7f-b282-932e4ad8a3bb';
