'use client';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Esqueceu a senha?</h1>
					<p className="text-muted-foreground mt-2">
						Não se preocupe, vamos te ajudar a recuperar
					</p>
				</div>

				<ForgotPasswordForm />
			</div>
		</div>
	);
}
