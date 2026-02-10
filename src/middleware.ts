import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/gastos", "/renda", "/alertas", "/relatorios", "/configuracoes"];

function isProtected(pathname: string): boolean {
	return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (isProtected(request.nextUrl.pathname) && !token) {
		const home = new URL("/", request.url);
		home.searchParams.set("callbackUrl", request.nextUrl.pathname);
		return NextResponse.redirect(home);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/gastos/:path*",
		"/renda/:path*",
		"/alertas/:path*",
		"/relatorios/:path*",
		"/configuracoes/:path*",
	],
};
