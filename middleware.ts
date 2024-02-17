import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/auth/signin') {
    return NextResponse.rewrite(new URL('/api/auth/signin', request.url));
  }
}

export const config = { matcher: ['/school/:path*', '/auth/:path*'] };
