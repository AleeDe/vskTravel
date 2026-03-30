-- Run this in Supabase Dashboard → SQL Editor to fix admin redirect

-- 1. Check if profiles table has RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- 3. Create new policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 4. Verify admin user exists with correct role
-- Check:
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- If admin doesn't exist, create one:
-- INSERT INTO profiles (id, email, role)
-- VALUES ('USER_ID_HERE', 'admin@test.com', 'admin');

-- 5. Test: Try logging in with admin account in app browser console will show logs
