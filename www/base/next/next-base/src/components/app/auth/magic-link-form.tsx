import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MagicLinkFormData {
	email: string;
}

const MagicLinkForm: React.FC = () => {
	const { sendMagicLink } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { register, handleSubmit } = useForm<MagicLinkFormData>();

	const onSubmit = async (data: MagicLinkFormData) => {
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			await sendMagicLink(data.email);
			setSuccess('Magic link sent! Check your email.');
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
			) {
				setError((err as { response: { data: { message: string } } }).response.data.message);
			} else {
				setError('Failed to send magic link');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<div className="p-6">
				<h1 className="text-2xl font-bold text-center mb-6">Magic Link Login</h1>
				<p className="text-gray-600 text-center mb-6">
					Enter your email and we&apos;ll send you a magic link to login instantly.
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{error && <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

					{success && <div className="p-3 text-green-600 bg-green-50 border border-green-200 rounded">{success}</div>}

					<Input
						type="email"
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^\S+@\S+$/i,
								message: 'Invalid email address',
							},
						})}
					/>

					<Button type="submit" disabled={loading} className="w-full">
						Send Magic Link
					</Button>
				</form>

				<div className="mt-6 text-center">
					<Link href="/auth/login" className="text-blue-600 hover:underline">
						Back to Login
					</Link>
				</div>
			</div>
		</Card>
	);
};

export default MagicLinkForm;
