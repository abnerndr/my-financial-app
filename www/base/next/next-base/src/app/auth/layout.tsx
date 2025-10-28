import Layout from '@/components/common/layout/layout';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Layout>{children}</Layout>;
}
