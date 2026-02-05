"use client";

import { deleteExpense } from "@/app/actions/expenses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Expense } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

const frequencyLabel: Record<string, string> = {
	ONE_TIME: "Uma vez",
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
	const router = useRouter();
	const mutation = useMutation({
		mutationFn: deleteExpense,
		onSuccess: () => {
			router.refresh();
		},
	});

	if (expenses.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">Nenhum gasto cadastrado. Adicione um acima.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Logo</TableHead>
					<TableHead>Título</TableHead>
					<TableHead>Descrição</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Periodicidade</TableHead>
					<TableHead className="w-[80px]"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{expenses.map((e) => (
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
						<TableCell>{formatCurrency(Number(e.value))}</TableCell>
						<TableCell>
							<Badge variant="secondary">{frequencyLabel[e.frequency] ?? e.frequency}</Badge>
						</TableCell>
						<TableCell>
							<Button variant="ghost" size="sm" onClick={() => mutation.mutate(e.id)} disabled={mutation.isPending}>
								Excluir
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
