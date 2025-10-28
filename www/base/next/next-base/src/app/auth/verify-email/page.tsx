'use client';

import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';

const VerifyEmailContent: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { verifyEmail } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const token = searchParams.get('token');

		if (token) {
			verifyEmail(token)
				.then(() => {
					setSuccess('Email verified successfully! You can now login.');
					setTimeout(() => {
						router.push('/auth/login');
					}, 2000);
				})
				.catch((err) => {
					setError(err.response?.data?.message || 'Failed to verify email');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setError('Invalid verification token');
			setLoading(false);
		}
	}, [searchParams, verifyEmail, router]);

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md mx-auto">
				<div className="p-6 text-center">
					<h1 className="text-2xl font-bold mb-6">Email Verification</h1>

					{error && (
						<div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded mb-4">
							{error}
						</div>
					)}

					{success && (
						<div className="p-3 text-green-600 bg-green-50 border border-green-200 rounded mb-4">
							{success}
						</div>
					)}

					{error && (
						<button
							onClick={() => router.push('/auth/login')}
							className="text-blue-600 hover:underline"
						>
							Go to Login
						</button>
					)}
				</div>
			</Card>
		</div>
	);
};

const VerifyEmailPage: React.FC = () => {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<VerifyEmailContent />
		</Suspense>
	);
};

export default VerifyEmailPage;
