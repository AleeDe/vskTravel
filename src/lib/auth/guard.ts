import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_ROLE, normalizeRole, type UserRole } from './roles'

export type AppRole = UserRole

export async function getSupabaseServer() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          try {
            // In RSC, setting may be ignored, but safe to call
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
      },
    }
  )
}

export async function getUserWithRole(): Promise<{ user: any | null; role: AppRole | null }> {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null as null }

  // Get role from user_metadata (synced by trigger)
  // Fallback to 'customer' if not found
  const roleFromMetadata = user.user_metadata?.role as AppRole | null
  const role = roleFromMetadata ?? 'customer'

  return { user, role }
}

export async function requireRole(allowed: AppRole[] | 'any') {
  const { user, role } = await getUserWithRole()
  if (!user) {
    return { ok: false as const, status: 401, error: 'Unauthorized', user: null, role: null as null }
  }
  // Reject if role is null (not assigned) or not in allowed list
  if (!role || (allowed !== 'any' && !allowed.includes(role))) {
    return { ok: false as const, status: 403, error: 'Forbidden', user, role }
  }
  return { ok: true as const, user, role }
}

// Request-scoped helper that authenticates via Authorization: Bearer <token>
export async function getUserWithRoleFromRequest(req: NextRequest): Promise<{ user: any | null; role: AppRole | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization') || '',
        },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null as null }

  // Get role from user_metadata (synced by trigger)
  const roleFromMetadata = user.user_metadata?.role as AppRole | null
  const role = roleFromMetadata ?? 'customer'

  return { user, role }
}

// Cookie-scoped helper (SSR) — uses Next.js cookies() to read Supabase session
export async function getUserWithRoleFromCookies(): Promise<{ user: any | null; role: AppRole | null }> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null }

  // Get role from user_metadata (synced by trigger)
  const roleFromMetadata = user.user_metadata?.role as AppRole | null
  const role = roleFromMetadata ?? 'customer'

  return { user, role }
}
