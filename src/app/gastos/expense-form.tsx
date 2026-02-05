"use client";

import { createExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().optional(),
	logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
	value: z.number().positive("Valor deve ser positivo"),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]),
});

type FormData = z.infer<typeof schema>;

export function ExpenseForm() {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			logoUrl: "",
			value: 0,
			frequency: "MONTHLY",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const fd = new FormData();
			fd.set("title", data.title);
			fd.set("description", data.description ?? "");
			fd.set("logoUrl", data.logoUrl ?? "");
			fd.set("value", String(data.value));
			fd.set("frequency", data.frequency);
			return createExpense(fd);
		},
		onSuccess: (result) => {
			if (result?.success) {
				form.reset();
				router.refresh();
			}
		},
	});

	return (
		<form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="grid gap-4 sm:grid-cols-2">
			<div className="space-y-2 sm:col-span-2">
				<Label htmlFor="title">Título</Label>
				<Input id="title" {...form.register("title")} placeholder="Ex: Aluguel" />
				{form.formState.errors.title && (
					<p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
				)}
			</div>
			<div className="space-y-2 sm:col-span-2">
				<Label htmlFor="description">Descrição</Label>
				<Textarea id="description" {...form.register("description")} placeholder="Opcional" />
			</div>
			<div className="space-y-2 sm:col-span-2">
				<Label htmlFor="logoUrl">URL do logo (opcional)</Label>
				<Input id="logoUrl" type="url" {...form.register("logoUrl")} placeholder="https://..." />
				{form.formState.errors.logoUrl && (
					<p className="text-sm text-destructive">{form.formState.errors.logoUrl.message}</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="value">Valor (R$)</Label>
				<Input
					id="value"
					type="number"
					step="0.01"
					{...form.register("value", { valueAsNumber: true })}
					placeholder="0,00"
				/>
				{form.formState.errors.value && (
					<p className="text-sm text-destructive">{form.formState.errors.value.message}</p>
				)}
			</div>
			<div className="space-y-2">
				<Label>Periodicidade</Label>
				<Select
					value={form.watch("frequency")}
					onValueChange={(v) => form.setValue("frequency", v as FormData["frequency"])}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ONE_TIME">Uma vez</SelectItem>
						<SelectItem value="MONTHLY">Mensal</SelectItem>
						<SelectItem value="ANNUAL">Anual</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="sm:col-span-2">
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? "Salvando..." : "Adicionar gasto"}
				</Button>
			</div>
		</form>
	);
}
