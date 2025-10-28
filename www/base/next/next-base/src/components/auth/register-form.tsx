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

const registerSchema = z
	.object({
		name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
		email: z.string().email('Email inválido'),
		password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Senhas não coincidem',
		path: ['confirmPassword'],
	});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterFormProps {
	onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register: registerUser, isLoading, error } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		try {
			await registerUser(data.email, data.password, data.name);
			onSuccess?.();
		} catch {
			// Error is handled by the store
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
				<CardDescription className="text-center">
					Preencha os dados abaixo para criar sua conta
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
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							type="text"
							placeholder="Seu nome completo"
							{...register('name')}
							disabled={isLoading}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

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

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar Senha</Label>
						<div className="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="Confirme sua senha"
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
						Criar Conta
					</Button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					Já tem uma conta?{' '}
					<Link href="/auth/login" className="text-primary hover:underline">
						Faça login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
