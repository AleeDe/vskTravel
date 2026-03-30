# Role Management: Profiles vs Separate Table

## The Problem

Your user `caadeabe-8702-4b7f-b282-932e4ad8a3bb` has `role = NULL` because:

1. The trigger `handle_new_user()` doesn't **explicitly** set the role
2. It relies on the DEFAULT value, which doesn't always fire
3. Existing profiles created before the fix have NULL roles

---

## Solution Comparison

### ✅ Option 1: Fix Profiles Table (Recommended)

**What:** Keep role in `profiles` table, fix the trigger to explicitly set it

**Pros:**
- ✅ Simpler — no schema changes
- ✅ Faster queries — no joins needed
- ✅ Less data duplication
- ✅ Works immediately after one SQL script
- ✅ Perfect for most projects

**Cons:**
- ❌ No audit trail of role changes
- ❌ No history tracking
- ❌ Can't see "who assigned this role"

**Use this if:** You want simple, working role system right now

**How to implement:**
```bash
# 1. Run this SQL:
supabase/fix-null-roles.sql

# 2. Your user will immediately have role='customer'
```

**Query example:**
```sql
SELECT role FROM profiles WHERE id = 'user-id';
-- Returns: 'customer' (or 'admin', 'partner')
```

---

### 🔄 Option 2: Separate Roles Table (Advanced)

**What:** Create `user_roles` table with audit trail

**Pros:**
- ✅ Full audit trail (who assigned, when, why)
- ✅ Role change history
- ✅ Compliance/logging capabilities
- ✅ Can revoke roles without deleting
- ✅ Professional for enterprise apps

**Cons:**
- ❌ Extra join for every role query (slower)
- ❌ More complex schema
- ❌ Needs code changes in middleware
- ❌ More data to maintain
- ❌ Overkill for small/medium projects

**Use this if:** You need audit trail or role versioning

**How to implement:**
```bash
# 1. Run this SQL:
supabase/create-roles-table.sql

# 2. Update middleware to call get_current_role()
# 3. Use assign_role() function for promotions
```

**Query example:**
```sql
SELECT public.get_current_role('user-id');
-- Returns: 'customer'

-- See full history:
SELECT * FROM public.get_role_history('user-id');
-- Returns: role, assigned_at, assigned_by, reason
```

---

## Comparison Table

| Feature | Profiles Table | Separate Table |
|---------|---|---|
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Query Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (has join) |
| **Audit Trail** | ❌ None | ✅ Full |
| **Role History** | ❌ Lost | ✅ Saved |
| **Change Tracking** | ❌ No | ✅ Yes |
| **Setup Time** | 5 min | 20 min |
| **Code Changes** | 0 | 3-4 files |
| **Best For** | Most projects | Enterprise/compliance |

---

## My Recommendation

### For this project: **Use Option 1** (Profiles Table)

**Why:**
- Your role system is still being set up
- You don't need complex audit trails yet
- Faster queries = better UX
- Simpler to maintain
- You can always migrate to separate table later

**Implementation:**
1. Run `supabase/fix-null-roles.sql` in SQL Editor
2. Wait 30 seconds
3. User now has `role = 'customer'`
4. Can promote to admin via `/api/admin/init`
5. Done ✅

---

## If You Need Audit Trail Later

You can always migrate:

```sql
-- Later, if you need audit trail:

-- 1. Run create-roles-table.sql
-- 2. Migrate existing roles: INSERT INTO user_roles SELECT ...
-- 3. Update middleware to use get_current_role()
-- 4. Update API endpoints to log assignments
```

No data loss, no breaking changes.

---

## What to Do Now

### Immediate Fix (5 minutes)

```sql
-- Copy and paste this into Supabase SQL Editor:

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

-- Verify
SELECT id, email, role FROM public.profiles WHERE id = 'caadeabe-8702-4b7f-b282-932e4ad8a3bb';
```

**Result:** Your user will have `role = 'customer'` ✅

Then use `/api/admin/init` to promote to admin.

---

## Questions?

**Q: Will this slow down my app?**
A: No. Option 1 is actually faster (no joins). Option 2 adds minimal overhead.

**Q: Can I change my mind later?**
A: Yes. You can migrate between them without data loss.

**Q: What if I need both options?**
A: You could have both tables, but it's data duplication. Better to pick one approach.

**Q: Does this fix the redirect issue?**
A: Yes! Once role is no longer NULL, the middleware will:
1. Read `role = 'customer'` (or admin/partner)
2. Redirect to correct dashboard
3. Set the app_role cookie
