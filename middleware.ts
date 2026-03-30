import type { NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/partner/:path*',
    '/admin/:path*',
    '/partner/dashboard/:path*',
    '/admin/dashboard/:path*',
  ],
};
