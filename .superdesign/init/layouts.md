# Layouts

No shared app shell/sidebar/nav. Each authenticated page is self-contained with a back-to-dashboard header.

## Root Layout — `src/app/layout.tsx`
Geist Sans + Geist Mono fonts. Providers wrapper. Safe-area padding. Theme color emerald `#059669`.

```tsx
import { Providers } from "@/components/providers";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Controle Financeiro",
	description: "Monitore gastos, renda e alertas de limite",
	applicationName: "Controle Financeiro",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Financeiro",
	},
	formatDetection: {
		telephone: false,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#059669",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased pb-[env(safe-area-inset-bottom)]`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

```

## Page chrome pattern (used on /gastos, /dashboard, etc.)
- `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 py-8`
- Top row: ghost icon Button + Link back to `/dashboard` (ArrowLeft) + h1 + muted subtitle
- Content stacked as Card sections
