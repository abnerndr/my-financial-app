'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background px-4">
				<Card className="w-full max-w-md mx-auto">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl text-red-600">Token inválido</CardTitle>
						<CardDescription>
							O link de redefinição de senha é inválido ou expirou.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<a href="/auth/forgot-password" className="text-primary hover:underline">
								Solicitar novo link
							</a>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Nova Senha</h1>
					<p className="text-muted-foreground mt-2">Digite sua nova senha abaixo</p>
				</div>

				<ResetPasswordForm token={token} />
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<ResetPasswordContent />
		</Suspense>
	);
}
