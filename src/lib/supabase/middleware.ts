import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { normalizeRole, getRoleDashboardPath, type UserRole } from '@/lib/auth/roles';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          request.cookies.set(name, value);
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set(name, value, options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route patterns
  const protectedPaths = ['/dashboard', '/partner', '/admin'];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    // Get role from user_metadata (synced by trigger from profiles table)
    const roleFromMetadata = user.user_metadata?.role as UserRole | null;
    let role = normalizeRole(roleFromMetadata ?? 'customer');

    console.log(`[Auth] User ${user.id} (${user.email}) has role: ${role}`);

    // Set a lightweight role cookie only when we could read the profile
    if (role) {
      try {
        supabaseResponse.cookies.set('app_role', role, {
          path: '/',
          sameSite: 'lax',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60, // 1 hour
        });
      } catch (_) {}
    }

    // If hitting the site root, send admins/partners straight to their dashboards
    if (request.nextUrl.pathname === '/') {
      if (role === 'admin') {
        console.log(`[Auth] Redirecting admin ${user.id} to /admin/dashboard`);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      if (role === 'partner') {
        console.log(`[Auth] Redirecting partner ${user.id} to /partner/dashboard`);
        return NextResponse.redirect(new URL('/partner/dashboard', request.url));
      }
      // customers stay on the website root
    }

    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      console.log(`[Auth] Denying /admin access for user ${user.id} with role: ${role}`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Strict partition: only partners may access /partner, admins are redirected to /admin
    if (request.nextUrl.pathname.startsWith('/partner')) {
      if (role !== 'partner') {
        const target = role === 'admin' ? '/admin/dashboard' : '/dashboard';
        console.log(`[Auth] Redirecting user ${user.id} from /partner (role: ${role}) to ${target}`);
        return NextResponse.redirect(new URL(target, request.url));
      }
    }

    // Smart redirect for generic dashboard root
    if (request.nextUrl.pathname === '/dashboard') {
      const target = role === 'admin' ? '/admin/dashboard' : role === 'partner' ? '/partner/dashboard' : '/dashboard'
      if (target !== '/dashboard') {
        console.log(`[Auth] Redirecting user ${user.id} from /dashboard (role: ${role}) to ${target}`);
        return NextResponse.redirect(new URL(target, request.url))
      }
    }
  }

  // If no user, clear any stale role cookie
  if (!user) {
    try {
      supabaseResponse.cookies.set('app_role', '', { path: '/', maxAge: 0 });
    } catch (_) {}
  }

  return supabaseResponse;
}
