# Quick Fix for shiftdeploy@gmail.com

## Diagnose the Issue

### Step 1: Check Database Status

Run this in **Supabase Dashboard → SQL Editor**:

```sql
-- Find your user
SELECT id, email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';

-- Check if ANY admins exist
SELECT COUNT(*) as admin_count FROM public.profiles WHERE role = 'admin';

-- Check all roles
SELECT role, COUNT(*) as count FROM public.profiles GROUP BY role;
```

**What to look for:**
- Your user's role should be something (not NULL)
- `admin_count` should be > 0
- Role breakdown should show distribution

---

## Likely Scenarios

### Scenario A: User role is NULL
```sql
-- Your user's role is NULL in database
```

**Fix:**
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'shiftdeploy@gmail.com';
```

### Scenario B: User role is 'customer' but you want 'admin'
```sql
-- Your user's role is already 'customer' in database
```

**Fix option 1 - Direct SQL:**
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'shiftdeploy@gmail.com';
```

**Fix option 2 - Use API:**
```bash
# 1. Get your user ID
curl http://localhost:3000/api/debug/me

# 2. Promote via API (use your JWT token from login)
curl -X POST http://localhost:3000/api/admin/assign-role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID_FROM_STEP_1",
    "role": "admin"
  }'
```

### Scenario C: The trigger is still wrong
```sql
-- Check the current trigger
SELECT pg_get_triggerdef('on_auth_user_created'::regclass);
```

**If trigger doesn't set role explicitly, run:**
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url', 'customer');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## Complete Fix (Do This Now)

Run this **entire block** in Supabase SQL Editor:

```sql
-- 1. Fix NULL roles
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

-- 2. Fix your specific user to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'shiftdeploy@gmail.com';

-- 3. Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url', 'customer');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Verify
SELECT email, role FROM public.profiles WHERE email = 'shiftdeploy@gmail.com';
```

**Expected output:**
```
email                    role
shiftdeploy@gmail.com    admin
```

---

## After the SQL Fix

### Clear Your Cookies & Cache

1. **In browser:**
   - Open DevTools → Application → Cookies
   - Find `sb-*` cookies and delete them
   - Also delete `app_role` cookie
   - Press F5 to refresh

2. **Or use this quick command:**
   ```javascript
   // Paste in browser console:
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   location.reload();
   ```

### Test Again

1. Log in again with `shiftdeploy@gmail.com`
2. Check the header - should now show **Role: admin**
3. Should auto-redirect to `/admin` page
4. Server logs should show:
   ```
   [Auth] User xxxxxx has role: admin
   [Auth] Redirecting admin to /admin
   ```

---

## Debug API

Check your role without logging in again:

```bash
# Check current role
curl http://localhost:3000/api/me/role

# Check with debug info
curl http://localhost:3000/api/me/role?debug=1

# Full user info
curl http://localhost:3000/api/debug/me
```

**Expected response (debug mode):**
```json
{
  "role": "admin",
  "debug": {
    "hadAuth": true,
    "cookieRole": "admin",
    "svcRole": "admin",
    "normalized": "admin"
  }
}
```

---

## Why This Happened

1. Your user was created **before** the trigger was fixed
2. The old trigger didn't explicitly set role, so it stayed NULL or defaulted to 'customer'
3. The cookie has stale role value cached
4. New sign-ups are already getting the correct default role

**Now fixed!** New users will automatically get `role='customer'` on signup.
