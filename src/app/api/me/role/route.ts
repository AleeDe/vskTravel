import { NextRequest } from 'next/server'
import { getUserWithRoleFromRequest, getUserWithRoleFromCookies } from '@/lib/auth/guard'
import { normalizeRole, DEFAULT_ROLE } from '@/lib/auth/roles'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Try cookie-based session first (most reliable on Next.js)
    let { user, role } = await getUserWithRoleFromCookies()
    if (!user) {
      // Fallback to bearer header
      const fromBearer = await getUserWithRoleFromRequest(req)
      user = fromBearer.user
      role = fromBearer.role
    }

    const url = new URL(req.url)
    const debug = url.searchParams.get('debug') === '1'

    if (!user) {
      return Response.json({
        role: null,
        debug: debug
          ? { hadAuth: !!req.headers.get('authorization'), tried: 'cookies->bearer' }
          : undefined,
      })
    }

    // Normalize the resolved role (role already comes from user_metadata via guard)
    const resolvedRole = normalizeRole(role)

    return Response.json({
      role: resolvedRole,
      debug: debug
        ? {
            hadAuth: !!req.headers.get('authorization'),
            userId: user.id,
            metadataRole: user.user_metadata?.role,
            guardRole: role,
            normalized: resolvedRole,
          }
        : undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('[Role API] Error:', message)
    return Response.json(
      { role: DEFAULT_ROLE, error: message },
      { status: 200 }
    )
  }
}
