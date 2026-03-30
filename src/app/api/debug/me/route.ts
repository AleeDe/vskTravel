import { NextRequest } from 'next/server'
import { getUserWithRoleFromRequest } from '@/lib/auth/guard'
import { normalizeRole, getRoleDashboardPath } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { user, role } = await getUserWithRoleFromRequest(req)

    if (!user) {
      return Response.json(
        { ok: false, error: 'No session' },
        { status: 401 }
      )
    }

    const normalizedRole = normalizeRole(role)
    const dashboardPath = getRoleDashboardPath(normalizedRole)

    return Response.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile: {
        role: normalizedRole,
        metadata: user.user_metadata,
        dashboardPath,
      },
      environment: {
        projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamps: {
        checkedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('[Debug API] Error:', message)
    return Response.json(
      { ok: false, error: message },
      { status: 500 }
    )
  }
}
