import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isProtectedRoute = pathname.startsWith('/vendors') ||
        pathname.startsWith('/payouts') ||
        pathname.startsWith('/dashboard');

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // Optional: add callback URL
        // loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if accessing login while already authenticated
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
