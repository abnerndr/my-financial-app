"use client";

import { deleteIncome } from "@/app/actions/incomes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Income } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const typeLabels: Record<string, string> = {
	SALARY: "Salário",
	BENEFITS: "Benefícios",
	SAVED: "Guardado",
	OTHER: "Outro",
};

export function IncomeTable({ incomes }: { incomes: Income[] }) {
	const router = useRouter();
	const mutation = useMutation({
		mutationFn: deleteIncome,
		onSuccess: () => {
			router.refresh();
		},
	});

	if (incomes.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">Nenhuma renda cadastrada. Adicione acima.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tipo</TableHead>
					<TableHead>Título</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead className="w-[80px]"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{incomes.map((i) => (
					<TableRow key={i.id}>
						<TableCell>
							<Badge variant="secondary">{typeLabels[i.type] ?? i.type}</Badge>
						</TableCell>
						<TableCell className="font-medium">{i.title}</TableCell>
						<TableCell>{formatCurrency(Number(i.value))}</TableCell>
						<TableCell>
							<Button variant="ghost" size="sm" onClick={() => mutation.mutate(i.id)} disabled={mutation.isPending}>
								Excluir
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
