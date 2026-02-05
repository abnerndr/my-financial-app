"use client";

import { register } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const fd = new FormData();
			fd.set("name", data.name);
			fd.set("email", data.email);
			fd.set("password", data.password);
			return register(fd);
		},
		onSuccess: (result) => {
			if (result?.success) {
				form.reset();
				// Não redireciona, mostra mensagem de sucesso
			}
		},
	});

	return (
		<form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
			{mutation.data?.success && (
				<Alert variant="success">
					<CheckCircle2 className="size-4" />
					<AlertTitle>Cadastro realizado!</AlertTitle>
					<AlertDescription>
						{mutation.data.message}
						<br />
						Verifique sua caixa de entrada (e a pasta de spam) para ativar sua conta.
					</AlertDescription>
				</Alert>
			)}

			{(mutation.data?.error || mutation.error) && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Erro</AlertTitle>
					<AlertDescription>
						{mutation.data?.error?._form?.[0] ||
							mutation.data?.error?.email?.[0] ||
							mutation.error?.message ||
							"Erro ao criar conta. Tente novamente."}
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="name">Nome</Label>
				<Input id="name" {...form.register("name")} placeholder="Seu nome completo" disabled={mutation.isPending} />
				{form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					{...form.register("email")}
					placeholder="seu@email.com"
					disabled={mutation.isPending}
				/>
				{form.formState.errors.email && (
					<p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
				)}
				{mutation.data?.error?.email && <p className="text-sm text-destructive">{mutation.data.error.email[0]}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Senha</Label>
				<Input
					id="password"
					type="password"
					{...form.register("password")}
					placeholder="Mínimo 6 caracteres"
					disabled={mutation.isPending}
				/>
				{form.formState.errors.password && (
					<p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={mutation.isPending}>
				{mutation.isPending ? "Criando conta..." : "Criar conta"}
			</Button>
		</form>
	);
}
