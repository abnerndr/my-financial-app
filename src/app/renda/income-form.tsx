"use client";

import { createIncome } from "@/app/actions/incomes";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	type: z.enum(["SALARY", "BENEFITS", "SAVED", "OTHER"]),
	title: z.string().min(1, "Título é obrigatório"),
	value: z.number().positive("Valor deve ser positivo"),
});

type FormData = z.infer<typeof schema>;

const typeLabels: Record<FormData["type"], string> = {
	SALARY: "Salário",
	BENEFITS: "Benefícios",
	SAVED: "Dinheiro guardado",
	OTHER: "Outro",
};

export function IncomeForm() {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: "SALARY",
			title: "",
			value: 0,
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const fd = new FormData();
			fd.set("type", data.type);
			fd.set("title", data.title);
			fd.set("value", data.value.toFixed(2));
			return createIncome(fd);
		},
		onSuccess: (result) => {
			if (result?.success) {
				form.reset({ type: "SALARY", title: "", value: 0 });
				router.refresh();
			}
		},
	});

	return (
		<form
			onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
			className="grid grid-cols-1 gap-5 md:gap-4 sm:grid-cols-2"
		>
			<div className="space-y-2">
				<Label>Tipo</Label>
				<Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as FormData["type"])}>
					<SelectTrigger>
						<SelectValue placeholder="Selecione" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="SALARY">{typeLabels.SALARY}</SelectItem>
						<SelectItem value="BENEFITS">{typeLabels.BENEFITS}</SelectItem>
						<SelectItem value="SAVED">{typeLabels.SAVED}</SelectItem>
						<SelectItem value="OTHER">{typeLabels.OTHER}</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="title">Título</Label>
				<Input id="title" {...form.register("title")} placeholder="Ex: Salário líquido" enterKeyHint="next" />
				{form.formState.errors.title && (
					<p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
				)}
			</div>
			<div className="space-y-2 sm:col-span-2 md:col-span-1">
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
							enterKeyHint="done"
						/>
					)}
				/>
				{form.formState.errors.value && (
					<p className="text-sm text-destructive">{form.formState.errors.value.message}</p>
				)}
			</div>
			<div className="flex items-stretch sm:col-span-2 pt-1 md:items-end md:pt-0">
				<Button type="submit" disabled={mutation.isPending} className="h-12 w-full md:h-10 md:w-auto">
					{mutation.isPending ? "Salvando..." : "Adicionar"}
				</Button>
			</div>
		</form>
	);
}
