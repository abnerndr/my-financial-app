'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
	const { loadUser, isAuthenticated } = useAuthStore();

	useEffect(() => {
		// Carrega o usuário se há tokens salvos
		if (isAuthenticated) {
			loadUser();
		}
	}, [loadUser, isAuthenticated]);

	return <>{children}</>;
}
