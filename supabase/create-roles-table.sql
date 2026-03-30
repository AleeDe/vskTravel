-- ============================================================
-- ALTERNATIVE: Separate Roles Table with Audit Trail
-- Only use this if you need role history/audit trail
-- ============================================================

-- 1. Create roles table (audit trail of role assignments)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  role              text not null check (role in ('customer', 'partner', 'admin')),
  assigned_by       uuid references public.profiles(id),  -- who assigned this role
  reason            text,  -- why was role assigned
  assigned_at       timestamptz not null default now(),
  revoked_at        timestamptz,  -- when role was revoked (NULL = current)
  unique(user_id, revoked_at)  -- only one active role per user
);

-- 2. Create function to get current role
CREATE OR REPLACE FUNCTION public.get_current_role(user_id uuid)
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = $1 AND revoked_at IS NULL
  ORDER BY assigned_at DESC
  LIMIT 1;
$$;

-- 3. Create function to assign role with audit trail
CREATE OR REPLACE FUNCTION public.assign_role(
  target_user_id uuid,
  new_role text,
  assigned_by_user_id uuid DEFAULT NULL,
  assign_reason text DEFAULT NULL
)
RETURNS TABLE (success boolean, message text) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Revoke old role
  UPDATE public.user_roles
  SET revoked_at = now()
  WHERE user_id = target_user_id AND revoked_at IS NULL;

  -- Assign new role
  INSERT INTO public.user_roles (user_id, role, assigned_by, reason)
  VALUES (target_user_id, new_role, assigned_by_user_id, assign_reason);

  RETURN QUERY SELECT true, 'Role assigned successfully';
END;
$$;

-- 4. Create function to get role history
CREATE OR REPLACE FUNCTION public.get_role_history(user_id uuid)
RETURNS TABLE (
  role text,
  assigned_at timestamptz,
  revoked_at timestamptz,
  assigned_by_email text,
  reason text
) LANGUAGE sql STABLE AS $$
  SELECT
    ur.role,
    ur.assigned_at,
    ur.revoked_at,
    p.email,
    ur.reason
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON ur.assigned_by = p.id
  WHERE ur.user_id = $1
  ORDER BY ur.assigned_at DESC;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Add RLS policies
CREATE POLICY "Users can view own role history"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.get_my_role() = 'admin');

-- 7. Migrate existing roles to new table
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT id, role, created_at FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT DO NOTHING;

-- 8. Update middleware to use new function
-- Change:
--   let role = profile?.role || null;
-- To:
--   let role = await supabase.rpc('get_current_role', { user_id: user.id });

COMMENT ON TABLE public.user_roles IS 'Audit trail of role assignments with history';
