import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('auth-tokens');
	const { pathname } = request.nextUrl;

	// Páginas que requerem autenticação
	const protectedPaths = ['/dashboard', '/admin', '/profile'];
	const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

	// Páginas de auth que não devem ser acessadas se já autenticado
	const authPaths = ['/auth/login', '/auth/register'];
	const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

	if (isProtectedPath && !token) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	if (isAuthPath && token) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*', '/profile/:path*'],
};
