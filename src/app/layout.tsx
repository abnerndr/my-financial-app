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
