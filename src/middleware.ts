import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const session = token ? await verifyJWT(token) : null;

  if (!session) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (pathname.startsWith('/admin/dashboard')) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/:path*'],
};
