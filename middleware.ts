import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith('/interview') || pathname.startsWith('/dashboard');

  if (!isProtected) return NextResponse.next();

  // Check for auth token in cookies (set by login) or allow through
  // Full server-side cookie verification requires firebase-admin edge runtime.
  // For now, client-side FireAuthProvider handles redirects; this is a belt-and-suspenders check.
  const session = req.cookies.get('session')?.value;
  if (!session) {
    // No cookie — let client-side auth provider handle the redirect from within the page
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
};