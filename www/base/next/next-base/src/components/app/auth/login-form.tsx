import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface LoginFormData {
	email: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const { login } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { register, handleSubmit } = useForm<LoginFormData>();

	const onSubmit = async (data: LoginFormData) => {
		setLoading(true);
		setError('');

		try {
			await login(data.email, data.password);
			router.push('/dashboard');
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof (err as { response?: { data?: { message?: string } } }).response === 'object'
			) {
				setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed');
			} else {
				setError('Login failed');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<div className="p-6">
				<h1 className="text-2xl font-bold text-center mb-6">Login</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{error && <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

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

					<Input
						type="password"
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters',
							},
						})}
					/>

					<Button type="submit" disabled={loading} className="w-full">
						Login
					</Button>
				</form>

				<div className="mt-4">
					<Button onClick={handleGoogleLogin} variant="outline" className="w-full">
						Login with Google
					</Button>
				</div>

				<div className="mt-6 text-center space-y-2">
					<Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
						Forgot your password?
					</Link>
					<br />
					<Link href="/auth/magic-link" className="text-blue-600 hover:underline">
						Login with Magic Link
					</Link>
					<br />
					<Link href="/auth/register" className="text-blue-600 hover:underline">
						Don&apos;t have an account? Register
					</Link>
				</div>
			</div>
		</Card>
	);
};

export default LoginForm;
