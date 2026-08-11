"use client";

import { createExpense } from "@/app/actions/expenses";
import { LogoPicker, type LogoLibrary } from "@/components/logos/logo-picker";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { todayDateOnly } from "@/lib/date-only";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().optional(),
	logoId: z.string().nullable().optional(),
	logoUrl: z.string().nullable().optional(),
	value: z.number().positive("Valor deve ser positivo"),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]),
	dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function ExpenseForm({ library }: { library: LogoLibrary }) {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			logoId: null,
			logoUrl: null,
			value: 0,
			frequency: "MONTHLY",
			dueDate: todayDateOnly(),
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const fd = new FormData();
			fd.set("title", data.title);
			fd.set("description", data.description ?? "");
			fd.set("logoId", data.logoId ?? "");
			fd.set("value", data.value.toFixed(2));
			fd.set("frequency", data.frequency);
			fd.set("dueDate", data.dueDate);
			return createExpense(fd);
		},
		onSuccess: (result) => {
			if (result?.success) {
				form.reset({
					title: "",
					description: "",
					logoId: null,
					logoUrl: null,
					value: 0,
					frequency: "MONTHLY",
					dueDate: todayDateOnly(),
				});
				router.refresh();
			}
		},
	});

	return (
		<form
			onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
			className="grid grid-cols-1 gap-5 md:gap-4 sm:grid-cols-2"
		>
			<div className="space-y-2 sm:col-span-2">
				<Label htmlFor="title">Título</Label>
				<Input id="title" {...form.register("title")} placeholder="Ex: Aluguel" enterKeyHint="next" />
				{form.formState.errors.title && (
					<p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
				)}
			</div>
			<div className="space-y-2 sm:col-span-2">
				<Label htmlFor="description">Descrição</Label>
				<Textarea id="description" {...form.register("description")} placeholder="Opcional" className="min-h-24 md:min-h-0" />
			</div>
			<div className="space-y-2 sm:col-span-2">
				<Label>Logo (opcional)</Label>
				<LogoPicker
					library={library}
					value={{ logoId: form.watch("logoId") ?? null, logoUrl: form.watch("logoUrl") ?? null }}
					onChange={(next) => {
						form.setValue("logoId", next.logoId);
						form.setValue("logoUrl", next.logoUrl);
					}}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="value">Valor</Label>
				<Controller
					control={form.control}
					name="value"
					render={({ field }) => (
						<CurrencyInput
							id="value"
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							name={field.name}
							enterKeyHint="next"
						/>
					)}
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
			<div className="space-y-2 sm:col-span-2 md:col-span-1">
				<Label htmlFor="dueDate">Data de vencimento</Label>
				<Input
					id="dueDate"
					type="date"
					enterKeyHint="done"
					className="min-h-12 md:min-h-10"
					{...form.register("dueDate")}
				/>
				{form.formState.errors.dueDate && (
					<p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
				)}
				<p className="text-xs text-muted-foreground">
					Mensal: use o dia do vencimento (ex.: dia 10). Única vez: data exata.
				</p>
			</div>
			<div className="sm:col-span-2 pt-1 md:pt-0">
				<Button type="submit" disabled={mutation.isPending} className="h-12 w-full md:h-10 md:w-auto">
					{mutation.isPending ? "Salvando..." : "Adicionar gasto"}
				</Button>
			</div>
		</form>
	);
}
