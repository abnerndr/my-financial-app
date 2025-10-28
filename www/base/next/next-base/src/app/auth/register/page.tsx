'use client';

import { AuthSeparator, GoogleLoginButton } from '@/components/auth/google-login';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Criar conta</h1>
					<p className="text-muted-foreground mt-2">Crie sua conta para começar</p>
				</div>

				<div className="space-y-4">
					<GoogleLoginButton />
					<AuthSeparator />
					<RegisterForm />
				</div>
			</div>
		</div>
	);
}
