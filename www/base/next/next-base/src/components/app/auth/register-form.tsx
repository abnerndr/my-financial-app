import { useAuth } from '@/contexts/auth-context';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RegisterFormData {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
}

const RegisterForm: React.FC = () => {
	const { register: registerUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { register, handleSubmit, watch } = useForm<RegisterFormData>();

	const watchPassword = watch('password');

	const onSubmit = async (data: RegisterFormData) => {
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			await registerUser(data.email, data.password, data.name);
			setSuccess('Registration successful! Check your email for verification.');
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof (err as { response?: { data?: { message?: string } } }).response?.data
					?.message === 'string'
			) {
				setError(
					(err as { response: { data: { message: string } } }).response.data.message,
				);
			} else {
				setError('Registration failed');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<div className="p-6">
				<h1 className="text-2xl font-bold text-center mb-6">Register</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{error && (
						<div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">
							{error}
						</div>
					)}

					{success && (
						<div className="p-3 text-green-600 bg-green-50 border border-green-200 rounded">
							{success}
						</div>
					)}

					<Input
						type="text"
						{...register('name', {
							required: 'Name is required',
							minLength: {
								value: 2,
								message: 'Name must be at least 2 characters',
							},
						})}
					/>

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

					<Input
						type="password"
						{...register('confirmPassword', {
							required: 'Please confirm your password',
							validate: (value) => value === watchPassword || 'Passwords do not match',
						})}
					/>

					<Button type="submit" disabled={loading} className="w-full">
						Register
					</Button>
				</form>

				<div className="mt-6 text-center">
					<Link href="/auth/login" className="text-blue-600 hover:underline">
						Already have an account? Login
					</Link>
				</div>
			</div>
		</Card>
	);
};

export default RegisterForm;
