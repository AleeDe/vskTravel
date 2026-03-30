import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserWithRoleFromRequest } from '@/lib/auth/guard'
import { VALID_ROLES, isValidRole } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/assign-role
 * Assign a role to a user (admin only, or service role)
 *
 * Body: { userId: string, role: 'admin' | 'partner' | 'customer' }
 */
export async function POST(req: NextRequest) {
  try {
    // Check for service role authorization (preferred for admin operations)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const authHeader = req.headers.get('Authorization') || ''
    const isServiceRole = authHeader === `Bearer ${serviceRoleKey}` && serviceRoleKey

    if (!isServiceRole) {
      // Fallback: check if user is admin
      const { user, role } = await getUserWithRoleFromRequest(req)
      if (!user || role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        )
      }
    }

    const body = await req.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role' },
        { status: 400 }
      )
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      )
    }

    // Use service role to update profile
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Failed to assign role:', error)
      return NextResponse.json(
        { error: 'Failed to assign role', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: `User ${userId} assigned role: ${role}`,
      profile: data,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('Error in assign-role:', message)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}
