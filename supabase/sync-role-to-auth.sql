-- ============================================================
-- Sync Role to auth.users Metadata
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create function to sync role to auth.users metadata
CREATE OR REPLACE FUNCTION public.sync_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop old trigger if exists
DROP TRIGGER IF EXISTS sync_role_to_auth ON public.profiles;

-- 3. Create trigger to run on INSERT and UPDATE
CREATE TRIGGER sync_role_to_auth
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_auth();

-- 4. Sync all existing roles from profiles to auth.users
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(p.role)
)
FROM public.profiles p
WHERE auth.users.id = p.id;

-- 5. Verify - check that roles are synced
SELECT 'Synced roles:' as check_result;
SELECT
  email,
  raw_user_meta_data->>'role' as metadata_role,
  (SELECT role FROM public.profiles WHERE id = auth.users.id) as profile_role
FROM auth.users
LIMIT 10;

-- 6. All should match now!
