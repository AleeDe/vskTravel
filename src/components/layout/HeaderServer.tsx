// Server Component wrapper to pass user email and role without extra client calls
import { getUserWithRoleFromCookies } from '@/lib/auth/guard'
import { createClient } from '@supabase/supabase-js'
import Header from './Header'

export default async function HeaderServer() {
  let { user, role } = await getUserWithRoleFromCookies()

  if (!role && user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data: prof } = await admin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = (prof?.role as string | undefined) ?? null
    } catch {}
  }
  return (
    <Header initialEmail={user?.email ?? null} initialRole={role ?? null} />
  )
}
