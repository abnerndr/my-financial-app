'use client';

import Link from 'next/link';
import { AuthSeparator, GoogleLoginButton } from '@/components/auth/google-login';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
					<p className="text-muted-foreground mt-2">Entre em sua conta para continuar</p>
				</div>

				<div className="space-y-4">
					<GoogleLoginButton />
					<AuthSeparator />
					<LoginForm />
				</div>

				<div className="text-center space-y-2">
					<Link
						href="/auth/magic-link"
						className="text-sm text-muted-foreground hover:text-primary underline"
					>
						Prefere login sem senha?
					</Link>
				</div>
			</div>
		</div>
	);
}
