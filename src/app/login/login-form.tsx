"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({ error, verified }: { error?: string; verified?: string }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				form.setError("root", { message: result.error });
			} else if (result?.ok) {
				router.push("/dashboard");
				router.refresh();
			}
		} catch (error: any) {
			form.setError("root", { message: error.message || "Erro ao fazer login" });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			{verified === "true" && (
				<Alert variant="success">
					<CheckCircle2 className="size-4" />
					<AlertTitle>Email verificado!</AlertTitle>
					<AlertDescription>Você pode fazer login agora.</AlertDescription>
				</Alert>
			)}

			{(error || form.formState.errors.root) && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Erro</AlertTitle>
					<AlertDescription>
						{error === "CredentialsSignin"
							? "Email ou senha incorretos"
							: error === "EmailNotVerified"
							? "Email não verificado. Verifique sua caixa de entrada."
							: form.formState.errors.root?.message || "Erro ao fazer login. Tente novamente."}
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" {...form.register("email")} placeholder="seu@email.com" disabled={isLoading} />
				{form.formState.errors.email && (
					<p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Senha</Label>
				<Input
					id="password"
					type="password"
					{...form.register("password")}
					placeholder="Sua senha"
					disabled={isLoading}
				/>
				{form.formState.errors.password && (
					<p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Entrando..." : "Entrar"}
			</Button>
		</form>
	);
}
