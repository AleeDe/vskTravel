# Debug: Role Not Changing

## Check 1: Verify SQL Update Worked

Run in **Supabase Dashboard → SQL Editor**:

```sql
-- Check if role was actually updated
SELECT id, email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';
```

**What should you see?**
- Column `role` should say: `admin` (not `customer`, not NULL)

**If you still see `customer`:**
- The UPDATE didn't work
- Could be RLS policy blocking it

**Fix: Use service role to bypass RLS**

Go to **Supabase Dashboard → SQL Editor → (Change from "authenticated" to "Service Role")**

Then run:
```sql
SET ROLE postgres;

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'shiftdeploy@gmail.com';

-- Verify
SELECT id, email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';
```

---

## Check 2: Verify RLS Policy Allows Reads

Run this:

```sql
-- Can you read your own profile as yourself?
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();
```

**Expected:** Returns your profile row

**If empty:**
- RLS policy is blocking you
- Need to fix policies

---

## Check 3: Check All Policies on Profiles Table

```sql
-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
```

**Expected policies:**
- "Users can view own profile"
- "Users can insert own profile"
- "Users can update own profile"
- "Admins can view all profiles"

**If missing or wrong:**
- Run the RLS policy fix

---

## Check 4: Complete RLS Reset

If policies are broken, run this to fix ALL of them:

```sql
-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create correct policies
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

-- Verify
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'profiles';
```

---

## Check 5: Verify Helper Function Exists

```sql
-- Does the get_my_role() function exist?
SELECT prosrc FROM pg_proc WHERE proname = 'get_my_role';
```

**Expected:** Should show SQL code

**If nothing:**
- Function is missing, recreate it:

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;
```

---

## Check 6: Can Middleware Actually Read Role?

Run this in your app's **browser console** while logged in:

```javascript
// Check what the middleware sees
fetch('/api/me/role?debug=1')
  .then(r => r.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
```

**Expected output:**
```json
{
  "role": "admin",
  "debug": {
    "hadAuth": true,
    "userId": "your-user-id",
    "cookieRole": "admin",
    "svcRole": "admin",
    "normalized": "admin"
  }
}
```

**If `role` is still `customer`:**
- Middleware can't read admin role
- RLS policy issue

**If `role` is `null`:**
- Role field is NULL in database
- Need to run UPDATE again

---

## Complete Nuclear Fix

Run this in **Service Role mode** in SQL Editor:

```sql
-- 1. Drop everything
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Fix all NULL roles to customer
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

-- 3. Set YOUR user to admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'shiftdeploy@gmail.com';

-- 4. Recreate trigger
CREATE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFILER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url', 'customer');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Recreate helper function
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 6. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. Create policies
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

-- 8. Verify
SELECT 'Your user:' as check;
SELECT id, email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';

SELECT 'All roles:' as check;
SELECT role, COUNT(*) FROM public.profiles GROUP BY role;
```

---

## After Running Nuclear Fix

1. **Clear cookies completely:**
   ```javascript
   // Paste in browser console
   document.cookie.split(";").forEach(c => {
     const name = c.split("=")[0].trim();
     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
   });
   ```

2. **Full page refresh:**
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or close/reopen browser

3. **Log in again**

4. **Check header - should now show `admin`**

---

## If STILL Not Working

Tell me:
1. What does the database check show? (role value)
2. What does `/api/me/role?debug=1` return?
3. What errors in browser console?
4. What errors in Vercel logs?

Then we'll fix it properly!
