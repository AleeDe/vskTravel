import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserWithRoleFromCookies } from '@/lib/auth/guard'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/init
 * One-time initialization: Promote current user to admin if no admins exist
 *
 * Security: Only works if there are currently no admin users in the system
 */
export async function POST(req: NextRequest) {
  try {
    // Get current user from cookies
    const { user } = await getUserWithRoleFromCookies()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Must be logged in' },
        { status: 401 }
      )
    }

    // Use service role to check for existing admins
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if any admins exist
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      console.error('Error checking for existing admins:', checkError)
      return NextResponse.json(
        { error: 'Failed to check admin status', details: checkError.message },
        { status: 500 }
      )
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Admin already exists. Use /api/admin/assign-role to manage roles' },
        { status: 409 }
      )
    }

    // No admins exist, promote current user
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error promoting to admin:', updateError)
      return NextResponse.json(
        { error: 'Failed to promote to admin', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: `User ${user.id} promoted to admin role`,
      profile: updated,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('Error in admin init:', message)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/init?check=1
 * Check if admin initialization is still available (no admins exist)
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const check = url.searchParams.get('check') === '1'

    if (!check) {
      return NextResponse.json(
        { error: 'Use POST to initialize, or GET with ?check=1 to status' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: admins, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('role', 'admin')

    if (error) {
      console.error('Error checking admins:', error)
      return NextResponse.json(
        { error: 'Failed to check admin status', details: error.message },
        { status: 500 }
      )
    }

    const adminExists = admins && admins.length > 0

    return NextResponse.json({
      ok: true,
      adminExists,
      adminCount: admins?.length || 0,
      admins: adminExists ? admins : [],
      initAvailable: !adminExists,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('Error checking admin init:', message)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}
