# Role System Implementation Checklist

## ✅ What's Been Fixed

### Database Level
- [x] Created SQL script to fix NULL roles: `supabase/fix-null-roles.sql`
- [x] Created RLS policy fixes: `supabase/fix-rls-and-roles.sql`
- [x] Optional: Separate roles table script: `supabase/create-roles-table.sql`

### Backend - Core Auth
- [x] Fixed null role handling in `src/lib/auth/guard.ts`
- [x] Created role utilities: `src/lib/auth/roles.ts`
- [x] Updated middleware logging: `src/lib/supabase/middleware.ts`

### Backend - API Endpoints
- [x] Created admin init endpoint: `src/app/api/admin/init/route.ts`
- [x] Created role assignment endpoint: `src/app/api/admin/assign-role/route.ts`
- [x] Improved `/api/me/role` endpoint with normalization
- [x] Improved `/api/debug/me` endpoint with role info

### Documentation
- [x] Created setup guide: `ROLE_SETUP_GUIDE.md`
- [x] Created comparison guide: `ROLE_TABLE_COMPARISON.md`
- [x] Created utilities guide: `src/lib/auth/ROLE_UTILITIES_GUIDE.md`

---

## 📋 Implementation Steps (In Order)

### Step 1: Database Setup (5-10 minutes)

Run in **Supabase Dashboard → SQL Editor**:

```bash
# Copy and paste this entire block:
```

```sql
-- Fix existing NULL roles
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

-- Recreate trigger to explicitly set role
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

-- Fix RLS policies
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

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
SELECT 'Null roles after fix:' as check_result;
SELECT COUNT(*) FROM public.profiles WHERE role IS NULL;

SELECT 'Roles breakdown:' as check_result;
SELECT role, COUNT(*) FROM public.profiles GROUP BY role ORDER BY count DESC;
```

**Expected result:** All rows should show role counts, zero NULL roles.

### Step 2: Deploy Code Changes

Your code changes are already in place:
- ✅ `src/lib/auth/roles.ts` — New utilities
- ✅ `src/lib/auth/guard.ts` — Updated
- ✅ `src/lib/supabase/middleware.ts` — Updated
- ✅ `src/app/api/me/role/route.ts` — Updated
- ✅ `src/app/api/debug/me/route.ts` — Updated
- ✅ `src/app/api/admin/init/route.ts` — New endpoint
- ✅ `src/app/api/admin/assign-role/route.ts` — New endpoint

**No additional code deployment needed** — just commit and push!

### Step 3: Create First Admin User (5 minutes)

1. **Sign up** a test user in your app (local or production)

2. **Check if init is available:**
   ```bash
   curl http://localhost:3000/api/admin/init?check=1
   # Should return: { "adminExists": false, "initAvailable": true }
   ```

3. **Promote to admin:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init \
     -H "Content-Type: application/json"
   # Should return: { "ok": true, "message": "User promoted to admin" }
   ```

4. **Test the redirect:** Log in and you should be redirected to `/admin`

### Step 4: Verify Everything Works

1. **Check server logs for role resolution:**
   ```
   [Auth] User caadeabe-... has role: admin
   [Auth] Redirecting admin to /admin
   ```

2. **Test role API:**
   ```bash
   curl http://localhost:3000/api/me/role?debug=1
   # Shows: { "role": "admin", "normalized": "admin" }
   ```

3. **Test debug endpoint:**
   ```bash
   curl http://localhost:3000/api/debug/me
   # Shows full user/role info with dashboard path
   ```

### Step 5: Promote Other Users (Optional)

```bash
# Find user ID from Supabase
curl http://localhost:3000/api/admin/assign-role \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "target-user-id",
    "role": "partner"
  }'
```

Or use the service role key for automation:

```bash
curl http://localhost:3000/api/admin/assign-role \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "userId": "user-id",
    "role": "admin"
  }'
```

---

## 📊 Using Role Utilities in Your Code

### In Middleware/Server Code

```typescript
import { canAccessRoute, getRoleDashboardPath, normalizeRole } from '@/lib/auth/roles'

// Protect a route
if (!canAccessRoute(userRole, ['admin', 'partner'])) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}

// Get dashboard path
const dashboardPath = getRoleDashboardPath(userRole)
```

### In Components (Frontend)

```typescript
import { normalizeRole, getRoleDashboardPath } from '@/lib/auth/roles'

export default function UserProfile({ userRole }: { userRole: string | null }) {
  const role = normalizeRole(userRole)  // Safe! Handles null
  const dashPath = getRoleDashboardPath(role)

  return <a href={dashPath}>Go to dashboard</a>
}
```

See `src/lib/auth/ROLE_UTILITIES_GUIDE.md` for detailed examples!

---

## 🐛 Troubleshooting

### "Admin redirect still not working"

1. Check database:
   ```sql
   SELECT id, email, role FROM profiles WHERE role IS NULL;
   -- Should return 0 rows
   ```

2. Check logs for `[Auth]` messages
3. Clear cookies and log in again
4. Verify environment variables are set

### "API says role is null"

1. Verify user was created after trigger fix:
   ```sql
   SELECT id, email, role FROM profiles WHERE id = 'your-user-id';
   -- Should show: role = 'customer' (or 'admin', 'partner')
   ```

2. If NULL, manually fix:
   ```sql
   UPDATE profiles SET role = 'customer' WHERE id = 'user-id';
   ```

### "Cannot promote user to admin"

1. Check if admin already exists:
   ```bash
   curl http://localhost:3000/api/admin/init?check=1
   ```

2. If admin exists, use assign-role endpoint instead:
   ```bash
   curl -X POST http://localhost:3000/api/admin/assign-role \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"userId": "user-id", "role": "admin"}'
   ```

---

## 📁 Files Created/Modified

### Created (New)
- `src/lib/auth/roles.ts` — Role utilities
- `src/lib/auth/ROLE_UTILITIES_GUIDE.md` — Usage guide
- `src/app/api/admin/init/route.ts` — Admin initialization
- `src/app/api/admin/assign-role/route.ts` — Role assignment
- `supabase/fix-null-roles.sql` — Fix NULL roles
- `supabase/fix-rls-and-roles.sql` — Fix RLS policies
- `supabase/create-roles-table.sql` — Optional: separate roles table
- `ROLE_SETUP_GUIDE.md` — Complete setup guide
- `ROLE_TABLE_COMPARISON.md` — Design comparison
- `ROLE_IMPLEMENTATION_CHECKLIST.md` — This file

### Modified
- `src/lib/auth/guard.ts` — Now uses role utilities
- `src/lib/supabase/middleware.ts` — Added logging + role utilities
- `src/app/api/me/role/route.ts` — Better normalization
- `src/app/api/admin/assign-role/route.ts` — Uses isValidRole()
- `src/app/api/debug/me/route.ts` — Shows dashboard path

---

## ✨ What You Get Now

✅ **Consistent role handling** — No more NULL roles
✅ **Safe normalization** — Handles invalid/null values gracefully
✅ **Hierarchical permissions** — Admin > Partner > Customer
✅ **Smart redirects** — Users go to correct dashboard
✅ **Debug logging** — See role resolution in server logs
✅ **Type safety** — TypeScript types for roles
✅ **Centralized utilities** — Import from `@/lib/auth/roles`
✅ **Full documentation** — Guides for every scenario

---

## 🚀 Next Steps

1. **Run the SQL fix** (Step 1)
2. **Commit code changes** (Step 2)
3. **Test in development** (Step 3-4)
4. **Deploy to production** (if needed)
5. **Promote users as needed** (Step 5)

**Questions?** Check the guides:
- Setup: `ROLE_SETUP_GUIDE.md`
- Utilities: `src/lib/auth/ROLE_UTILITIES_GUIDE.md`
- Design: `ROLE_TABLE_COMPARISON.md`
