"use client";

import { updateExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().optional(),
	logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
	value: z.number().positive("Valor deve ser positivo"),
	frequency: z.enum(["ONE_TIME", "MONTHLY", "ANNUAL"]),
	dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
});

type FormData = z.infer<typeof schema>;

type ExpenseWithStatus = {
	id: string;
	title: string;
	description: string | null;
	logoUrl: string | null;
	value: number;
	frequency: string;
	dueDate: string | null;
};

export function ExpenseEditModal({
	expense,
	open,
	onOpenChange,
}: {
	expense: ExpenseWithStatus | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			logoUrl: "",
			value: 0,
			frequency: "MONTHLY",
			dueDate: new Date().toISOString().slice(0, 10),
		},
	});

	useEffect(() => {
		if (expense) {
			form.reset({
				title: expense.title,
				description: expense.description ?? "",
				logoUrl: expense.logoUrl ?? "",
				value: expense.value,
				frequency: expense.frequency as FormData["frequency"],
				dueDate: expense.dueDate ? expense.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
			});
		}
	}, [expense, form]);

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			if (!expense) return { error: "Nenhum gasto selecionado" };
			const fd = new FormData();
			fd.set("title", data.title);
			fd.set("description", data.description ?? "");
			fd.set("logoUrl", data.logoUrl ?? "");
			fd.set("value", String(data.value));
			fd.set("frequency", data.frequency);
			fd.set("dueDate", data.dueDate);
			return updateExpense(expense.id, fd);
		},
		onSuccess: (result) => {
			if (result && "success" in result && result.success) {
				onOpenChange(false);
				router.refresh();
			}
		},
	});

	const onSubmit = (data: FormData) => mutation.mutate(data);

	const logoUrl = form.watch("logoUrl") ?? "";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Editar gasto</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<div className="grid grid-cols-[auto_1fr] gap-4">
						<div className="flex flex-col items-center gap-2">
							{logoUrl ? (
									<Image
										src={logoUrl}
										alt=""
										width={64}
										height={64}
										className="rounded-lg object-cover"
									/>
								)  : (
								<div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
									Sem foto
								</div>
							)}
							<Label htmlFor="edit-logoUrl" className="text-xs">
								URL da foto
							</Label>
							<Input
								id="edit-logoUrl"
								type="url"
								className="h-8 text-xs"
								{...form.register("logoUrl")}
								placeholder="https://..."
							/>
							{form.formState.errors.logoUrl && (
								<p className="text-xs text-destructive">{form.formState.errors.logoUrl.message}</p>
							)}
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="edit-title">Nome</Label>
								<Input id="edit-title" {...form.register("title")} placeholder="Ex: Aluguel" />
								{form.formState.errors.title && (
									<p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-value">Valor (R$)</Label>
								<Input
									id="edit-value"
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
								<Label htmlFor="edit-dueDate">Data de vencimento</Label>
								<Input id="edit-dueDate" type="date" {...form.register("dueDate")} />
								{form.formState.errors.dueDate && (
									<p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
								)}
							</div>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-description">Descrição (opcional)</Label>
						<Textarea id="edit-description" {...form.register("description")} placeholder="Opcional" rows={2} />
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
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Salvando..." : "Salvar alterações"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
