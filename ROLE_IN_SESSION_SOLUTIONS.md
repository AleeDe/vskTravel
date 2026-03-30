# How to Get Role in Session.user

## Current Problem

```typescript
// ❌ Doesn't work - auth.users has no role field
const role = session.user.role;  // undefined

// ✅ Current workaround - separate query
const { role } = await getUserWithRole();
```

---

## Solution 1: Store Role in user_metadata (Simplest ⭐ Recommended)

Store role in `auth.users.user_metadata` so it comes with every session.

### Implementation

**Create this trigger in Supabase:**

```sql
-- Create trigger to sync role to auth metadata
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

DROP TRIGGER IF EXISTS sync_role_to_auth ON public.profiles;
CREATE TRIGGER sync_role_to_auth
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_auth();
```

### Use in Code

```typescript
// ✅ Now works! Role is in user_metadata
const session = await supabase.auth.getSession();
const role = session.user?.user_metadata?.role;

// Or add to your guard function
export async function getUserWithRole() {
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? 'customer';
  return { user, role };
}
```

**Pros:**
- ✅ Role available immediately in `session.user`
- ✅ No extra database query
- ✅ Works on frontend AND backend
- ✅ Cached with session

**Cons:**
- ❌ Role duplicated in two places (profiles + auth metadata)
- ❌ Need to keep them in sync

---

## Solution 2: Add Role to JWT Claims (Most Professional)

Use Supabase Edge Functions to add custom claims to JWT token.

### Implementation

**Create: `supabase/functions/generate-jwt/index.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function generateJWT(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  // This would require custom JWT generation
  // Standard Supabase doesn't support this out of the box
}
```

**Use in Code:**

```typescript
// Role is in the JWT token claims
const session = await supabase.auth.getSession();
const role = session.user?.app_metadata?.role;
```

**Pros:**
- ✅ Single source of truth (profiles table)
- ✅ No duplication
- ✅ Role sent with every request (in JWT)
- ✅ Most professional approach

**Cons:**
- ❌ Complex to implement
- ❌ Requires custom Edge Function
- ❌ JWT regeneration needed after role change

---

## Solution 3: Keep Current Architecture (What We Have Now)

Use role utility functions - simple and clean.

```typescript
import { getUserWithRole } from '@/lib/auth/guard';

const { user, role } = await getUserWithRole();
```

**Pros:**
- ✅ Simple
- ✅ Single source of truth
- ✅ Easy to understand

**Cons:**
- ❌ Extra database query
- ❌ Slightly slower

---

## Comparison

| Feature | Solution 1 | Solution 2 | Solution 3 |
|---------|-----------|-----------|-----------|
| Role in `session.user` | ✅ Yes | ✅ Yes | ❌ No |
| Single source of truth | ❌ No | ✅ Yes | ✅ Yes |
| Extra DB query | ❌ No | ❌ No | ✅ Yes |
| Frontend access | ✅ Easy | ✅ Easy | ❌ Need guard |
| Implementation complexity | ⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| Best for | Quick dev | Enterprise | Current setup |

---

## Recommendation

### For You (Right Now)

Use **Solution 1** (user_metadata):
- ✅ Quick to implement (one SQL trigger)
- ✅ Role available everywhere
- ✅ No extra queries
- ✅ Duplication is minimal

### For Production

Consider **Solution 2** (JWT claims):
- Better if you need role on frontend immediately
- But requires more infrastructure

---

## Implement Solution 1 Now

### Step 1: Add Sync Trigger

Run in **Supabase SQL Editor**:

```sql
-- Add trigger to sync role to auth.users metadata
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

DROP TRIGGER IF EXISTS sync_role_to_auth ON public.profiles;
CREATE TRIGGER sync_role_to_auth
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_auth();

-- Sync existing roles
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(p.role)
)
FROM public.profiles p
WHERE auth.users.id = p.id;
```

### Step 2: Update Code to Use It

**Option A: In guard.ts**

```typescript
export async function getUserWithRole(): Promise<{ user: any | null; role: AppRole | null }> {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, role: null }

  // Get role from user_metadata (synced by trigger)
  const role = (user.user_metadata?.role ?? 'customer') as AppRole

  return { user, role }
}
```

**Option B: In Components**

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user } = useAuth();
  const role = user?.user_metadata?.role ?? 'customer';

  return <div>Role: {role}</div>;
}
```

### Step 3: Test

```javascript
// In browser console after login
const { data: { user } } = await supabase.auth.getSession();
console.log(user?.user_metadata?.role);  // Should show: admin, partner, or customer
```

---

## Complete Sync Script

If you want to implement Solution 1, run this:

```sql
-- 1. Create sync function
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

-- 2. Create trigger
DROP TRIGGER IF EXISTS sync_role_to_auth ON public.profiles;
CREATE TRIGGER sync_role_to_auth
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_auth();

-- 3. Sync all existing roles
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(p.role)
)
FROM public.profiles p
WHERE auth.users.id = p.id;

-- 4. Verify
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users LIMIT 5;
```

---

## After Implementation

You can do this everywhere:

```typescript
// Server-side
const session = await supabase.auth.getSession();
const role = session.user?.user_metadata?.role;

// Client-side (in components)
const { data: { user } } = await supabase.auth.getUser();
const role = user?.user_metadata?.role;

// No more separate guard functions needed!
```

Much cleaner! 🎉

---

## Want Me to Do This?

I can:
1. ✅ Create the SQL trigger
2. ✅ Update all code to use `user.user_metadata?.role`
3. ✅ Test it works end-to-end

Should I implement Solution 1?
