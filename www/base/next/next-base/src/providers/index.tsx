import { AuthInitializer } from '@/components/auth/auth-initializer';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

export default function Provider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryProvider>
			<ThemeProvider>
				<AuthInitializer>
					<Toaster />
					{children}
				</AuthInitializer>
			</ThemeProvider>
		</QueryProvider>
	);
}
