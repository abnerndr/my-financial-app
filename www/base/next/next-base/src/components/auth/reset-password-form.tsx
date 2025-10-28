'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
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

const resetPasswordSchema = z
	.object({
		password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Senhas não coincidem',
		path: ['confirmPassword'],
	});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
	token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const { confirmResetPassword, isLoading, error } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordForm) => {
		try {
			await confirmResetPassword(token, data.password);
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
					<CardTitle className="text-2xl">Senha redefinida!</CardTitle>
					<CardDescription>Sua senha foi alterada com sucesso</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center space-y-2">
						<p className="text-sm text-muted-foreground">
							Você já pode fazer login com sua nova senha.
						</p>
					</div>

					<Link href="/auth/login">
						<Button className="w-full">Fazer Login</Button>
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">Nova Senha</CardTitle>
				<CardDescription className="text-center">
					Digite sua nova senha abaixo
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
						<Label htmlFor="password">Nova Senha</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="Sua nova senha"
								{...register('password')}
								disabled={isLoading}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								disabled={isLoading}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{errors.password && (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
						<div className="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="Confirme sua nova senha"
								{...register('confirmPassword')}
								disabled={isLoading}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								disabled={isLoading}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{errors.confirmPassword && (
							<p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Redefinir Senha
					</Button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					<Link href="/auth/login" className="text-primary hover:underline">
						Voltar ao login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
