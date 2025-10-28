'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/stores/auth';

const forgotPasswordSchema = z.object({
	email: z.string().email('Email inválido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [isSuccess, setIsSuccess] = useState(false);
	const { resetPassword, isLoading, error } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordForm) => {
		try {
			await resetPassword(data.email);
			setIsSuccess(true);
		} catch {
			// Error is handled by the store
		}
	};

	if (isSuccess) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<CheckCircle className="h-12 w-12 text-green-500" />
					</div>
					<CardTitle className="text-2xl">Email enviado!</CardTitle>
					<CardDescription>
						Enviamos instruções para redefinir sua senha para{' '}
						<strong>{getValues('email')}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center space-y-2">
						<p className="text-sm text-muted-foreground">
							Verifique seu email e siga as instruções para criar uma nova senha.
						</p>
						<p className="text-xs text-muted-foreground">O link expira em 1 hora.</p>
					</div>

					<Button
						onClick={() => setIsSuccess(false)}
						variant="outline"
						className="w-full"
					>
						Enviar novamente
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						<Link href="/auth/login" className="text-primary hover:underline">
							Voltar ao login
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<div className="flex justify-center mb-4">
					<Mail className="h-12 w-12 text-primary" />
				</div>
				<CardTitle className="text-2xl text-center">Esqueceu a senha?</CardTitle>
				<CardDescription className="text-center">
					Digite seu email e enviaremos instruções para redefinir sua senha
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="seu@email.com"
							{...register('email')}
							disabled={isLoading}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Enviar instruções
					</Button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					Lembrou da senha?{' '}
					<Link href="/auth/login" className="text-primary hover:underline">
						Fazer login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
