import { type NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
