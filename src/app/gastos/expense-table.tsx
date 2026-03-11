"use client";

import { deleteExpense, markExpenseAsPaid, unmarkExpenseAsPaid } from "@/app/actions/expenses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, getDueDateForMonth } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExpenseEditModal } from "./expense-edit-modal";

const frequencyLabel: Record<string, string> = {
	ONE_TIME: "Uma vez",
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

type ExpenseWithStatus = {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	logoUrl: string | null;
	value: number;
	frequency: string;
	dueDate: string | null;
	createdAt: string;
	updatedAt: string;
	paidThisMonth: boolean;
};

function formatDueDate(date: Date | null): string {
	if (!date) return "—";
	return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ExpenseTable({ expenses }: { expenses: ExpenseWithStatus[] }) {
	const router = useRouter();
	const [editExpense, setEditExpense] = useState<ExpenseWithStatus | null>(null);
	const [editOpen, setEditOpen] = useState(false);
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	const openEdit = (e: ExpenseWithStatus) => {
		setEditExpense(e);
		setEditOpen(true);
	};

	const deleteMutation = useMutation({
		mutationFn: deleteExpense,
		onSuccess: () => router.refresh(),
	});
	const markPaidMutation = useMutation({
		mutationFn: (id: string) => markExpenseAsPaid(id),
		onSuccess: () => router.refresh(),
	});
	const unmarkPaidMutation = useMutation({
		mutationFn: (id: string) => unmarkExpenseAsPaid(id),
		onSuccess: () => router.refresh(),
	});

	if (expenses.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">Nenhum gasto cadastrado. Adicione um acima.</p>;
	}

	return (
		<>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Logo</TableHead>
					<TableHead>Título</TableHead>
					<TableHead>Descrição</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Vencimento</TableHead>
					<TableHead>Periodicidade</TableHead>
					<TableHead>Status (mês)</TableHead>
					<TableHead className="w-[220px] text-right">Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{expenses.map((e) => {
					const dueDate = getDueDateForMonth(
						e.dueDate ? new Date(e.dueDate) : null,
						e.frequency as "ONE_TIME" | "MONTHLY" | "ANNUAL",
						year,
						month
					);
					return (
						<TableRow key={e.id}>
							<TableCell>
								{e.logoUrl ? (
									<Image src={e.logoUrl} alt="" width={32} height={32} className="rounded object-cover" />
								) : (
									<span className="text-muted-foreground">—</span>
								)}
							</TableCell>
							<TableCell className="font-medium">{e.title}</TableCell>
							<TableCell className="max-w-[200px] truncate text-muted-foreground">{e.description || "—"}</TableCell>
							<TableCell>{formatCurrency(e.value)}</TableCell>
							<TableCell>{formatDueDate(dueDate)}</TableCell>
							<TableCell>
								<Badge variant="secondary">{frequencyLabel[e.frequency] ?? e.frequency}</Badge>
							</TableCell>
							<TableCell>
								{e.paidThisMonth ? (
									<Badge variant="default" className="bg-emerald-600">Pago este mês</Badge>
								) : (
									<Badge variant="secondary">Pendente</Badge>
								)}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex flex-wrap items-center justify-end gap-1">
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
										onClick={() => openEdit(e)}
										aria-label="Editar gasto"
									>
										<Pencil className="size-3.5 shrink-0" />
										<span className="hidden sm:inline">Editar</span>
									</Button>
									{e.frequency !== "ONE_TIME" || !e.paidThisMonth ? (
										e.paidThisMonth ? (
											<Button
												variant="ghost"
												size="sm"
												className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
												onClick={() => unmarkPaidMutation.mutate(e.id)}
												disabled={unmarkPaidMutation.isPending}
											>
												<Check className="size-3.5 shrink-0" />
												<span className="hidden sm:inline">Desmarcar</span>
											</Button>
										) : (
											<Button
												variant="outline"
												size="sm"
												className="h-8 gap-1.5 px-2"
												onClick={() => markPaidMutation.mutate(e.id)}
												disabled={markPaidMutation.isPending}
											>
												<Check className="size-3.5 shrink-0" />
												<span className="hidden sm:inline">Marcar pago</span>
											</Button>
										)
									) : null}
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
										onClick={() => deleteMutation.mutate(e.id)}
										disabled={deleteMutation.isPending}
										aria-label="Excluir gasto"
									>
										<Trash2 className="size-3.5 shrink-0" />
										<span className="hidden sm:inline">Excluir</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
		<ExpenseEditModal
			expense={editExpense}
			open={editOpen}
			onOpenChange={setEditOpen}
		/>
		</>
	);
}
