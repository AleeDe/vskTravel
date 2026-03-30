# Role Assignment & Authentication Setup Guide

## What Was Fixed

✅ **Null role handling** — `requireRole()` now properly rejects users with no role assigned
✅ **Admin initialization** — One-time endpoint to create the first admin user
✅ **Role assignment API** — Endpoint to promote users to admin/partner roles
✅ **RLS policies** — SQL script to ensure roles can be read correctly
✅ **Debug logging** — Detailed logs to track role resolution and redirects

---

## Setup Steps

### 1. Run RLS Policy Fixes (Required)

Copy and run the SQL script in **Supabase Dashboard → SQL Editor**:

```sql
-- Paste contents of: supabase/fix-rls-and-roles.sql
```

This ensures:
- RLS policies are correctly set on the profiles table
- Users can read their own role
- Admins can read all profiles
- The `get_my_role()` helper function exists

**Verify:** Run the check query in the script to see if admins exist.

### 2. Create Your First Admin User

#### Option A: Via API (Recommended)

1. **Sign up** in the app as a normal user
2. **Open browser console** and call:
   ```bash
   curl -X GET http://localhost:3000/api/admin/init?check=1
   ```
   This checks if admin initialization is available
3. **Call the init endpoint** to promote your user:
   ```bash
   curl -X POST http://localhost:3000/api/admin/init \
     -H "Content-Type: application/json"
   ```
   (The user must be logged in via cookie)

#### Option B: Via Direct SQL

1. Sign up as a test user
2. Get your user ID from Supabase Dashboard → SQL Editor:
   ```sql
   SELECT id, email, role FROM public.profiles ORDER BY created_at DESC LIMIT 1;
   ```
3. Promote yourself to admin:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
   ```

### 3. Test Admin Redirect

1. Log in as your admin user
2. Navigate to `/` (homepage)
3. You should be **automatically redirected to `/admin`**
4. Check browser console for debug logs like:
   ```
   [Auth] User 123abc has role: admin
   [Auth] Redirecting admin 123abc to /admin
   ```

### 4. Promote Other Users to Partner/Admin

Use the role assignment endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/assign-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "USER_ID_TO_PROMOTE",
    "role": "partner"
  }'
```

**Authorization options:**
- Use your JWT token in the `Authorization: Bearer` header, OR
- Use the service role key: `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`

The endpoint requires either:
- Admin user making the request, OR
- Service role key provided (for backend automation)

---

## How It Works

### Role Assignment Flow

```
New User Signs Up
    ↓
profile created with role = 'customer' (default)
    ↓
API /api/admin/init (if no admins exist)
    ↓
User promoted to admin
    ↓
Next request: middleware reads role = 'admin'
    ↓
Redirected to /admin dashboard
```

### Middleware Role Resolution

The middleware (at `src/lib/supabase/middleware.ts`) does:

1. Check if user is authenticated
2. **Read role from `profiles` table** (via RLS)
3. If role read fails, try **service role as fallback**
4. **Set `app_role` cookie** for quick frontend access
5. **Redirect** based on role:
   - Admin → `/admin`
   - Partner → `/partner`
   - Customer → stays on `/`

### Debug Logging

Enable debug logs in your browser console:

```
[Auth] User 123abc has role: admin
[Auth] Redirecting admin 123abc to /admin
[Auth] No role found for user xyz. Defaulting to null
```

Check Vercel/server logs for more details on role resolution failures.

---

## Troubleshooting

### "Admin redirect not working"

1. Check server logs for `[Auth]` messages
2. Verify role is set in database:
   ```sql
   SELECT id, email, role FROM profiles WHERE role = 'admin';
   ```
3. Clear cookies and log in again
4. Verify RLS policies by running `supabase/fix-rls-and-roles.sql`

### "Cannot access /admin even though I'm admin"

Check middleware logs. Possible causes:
- Role not reading from database (RLS issue)
- Session cookie not set
- Service role key not configured

Solution:
1. Run RLS fix script
2. Check `SUPABASE_SERVICE_ROLE_KEY` env var is set
3. Force logout/login cycle

### "assign-role endpoint returns 403"

- If using Bearer token: user must be admin
- If using service role key: must match `SUPABASE_SERVICE_ROLE_KEY` exactly
- Check request headers:
  ```bash
  curl -X POST http://localhost:3000/api/admin/assign-role \
    -H "Authorization: Bearer $(cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY)" \
    -H "Content-Type: application/json" \
    -d '{"userId": "...", "role": "admin"}'
  ```

---

## API Reference

### POST /api/admin/init

Promote current authenticated user to admin (one-time only).

**Requirements:**
- User must be logged in
- No admin must exist in system

**Response:**
```json
{
  "ok": true,
  "message": "User 123 promoted to admin role",
  "profile": {
    "id": "123",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### GET /api/admin/init?check=1

Check if admin initialization is available.

**Response:**
```json
{
  "ok": true,
  "adminExists": false,
  "adminCount": 0,
  "initAvailable": true
}
```

### POST /api/admin/assign-role

Assign role to any user (admin or service role required).

**Headers:**
```
Authorization: Bearer <jwt_token_or_service_role_key>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "target-user-id",
  "role": "admin|partner|customer"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "User xyz assigned role: admin",
  "profile": {
    "id": "xyz",
    "email": "partner@example.com",
    "role": "admin"
  }
}
```

---

## Files Changed

- ✅ `src/lib/auth/guard.ts` — Fixed null role handling
- ✅ `src/lib/supabase/middleware.ts` — Added debug logging
- ✅ `src/app/api/admin/init/route.ts` — Admin initialization endpoint (new)
- ✅ `src/app/api/admin/assign-role/route.ts` — Role assignment endpoint (new)
- ✅ `supabase/fix-rls-and-roles.sql` — RLS policy fixes (new)

---

## Next Steps

1. **Run the RLS fix script** in Supabase SQL Editor
2. **Create your first admin user** via `/api/admin/init`
3. **Test the redirect** by logging in as admin
4. **Check server logs** for `[Auth]` debug messages
5. **Promote partners** as needed using `/api/admin/assign-role`

Need help? Check the debug logs in your terminal or browser console.
