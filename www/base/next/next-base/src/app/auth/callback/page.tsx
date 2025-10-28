'use client';

import type React from 'react';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setTokens } from '@/lib/storage';

const AuthCallbackContent: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get('accessToken');
		const refreshToken = searchParams.get('refreshToken');
		const expiresIn = searchParams.get('expiresIn');

		if (accessToken && refreshToken) {
			setTokens({
				accessToken,
				refreshToken,
				expiresIn: expiresIn ? Number(expiresIn) : 3600, // default 1 hour
			});
			router.push('/dashboard');
		} else {
			router.push('/auth/login');
		}
	}, [router, searchParams]);

	return <div>Carregando...</div>;
};

const AuthCallbackPage: React.FC = () => {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<AuthCallbackContent />
		</Suspense>
	);
};

export default AuthCallbackPage;
