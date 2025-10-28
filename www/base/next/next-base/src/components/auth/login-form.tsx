'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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

const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
	onSuccess?: () => void;
	redirectTo?: string;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoading, error } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			await login(data.email, data.password);
			onSuccess?.();
		} catch {
			// Error is handled by the store
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">Entrar</CardTitle>
				<CardDescription className="text-center">
					Digite seu email e senha para acessar sua conta
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

					<div className="space-y-2">
						<Label htmlFor="password">Senha</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="Sua senha"
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

					<div className="flex items-center justify-between">
						<Link
							href="/auth/forgot-password"
							className="text-sm text-muted-foreground hover:text-primary underline"
						>
							Esqueceu sua senha?
						</Link>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Entrar
					</Button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					Não tem uma conta?{' '}
					<Link href="/auth/register" className="text-primary hover:underline">
						Cadastre-se
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
