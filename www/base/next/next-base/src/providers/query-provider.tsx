'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface QueryProviderProps {
	children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000, // 5 minutes
						gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
						retry: (failureCount, error) => {
							// Não retentar em erros de autenticação
							if (error && typeof error === 'object' && 'response' in error) {
								const axiosError = error as { response?: { status?: number } };
								if (axiosError.response?.status === 401) {
									return false;
								}
							}
							return failureCount < 3;
						},
						refetchOnWindowFocus: false,
					},
					mutations: {
						retry: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* DevTools removido temporariamente devido a incompatibilidade de versões */}
		</QueryClientProvider>
	);
}
