import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard'];

// Rotas que apenas usuários não autenticados podem acessar
const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/magic-link',
	'/auth/forgot-password',
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Verificar se há token nos cookies
	const authTokens = request.cookies.get('auth-storage');
	const isAuthenticated = !!authTokens?.value;

	// Se está tentando acessar uma rota protegida sem estar autenticado
	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			const loginUrl = new URL('/auth/login', request.url);
			loginUrl.searchParams.set('redirect', pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Se está autenticado e tentando acessar rotas de auth, redirecionar para dashboard
	if (authRoutes.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
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
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
	],
};
