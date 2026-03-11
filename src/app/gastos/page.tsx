import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth";
import { getExpensesWithPaymentStatus, getPaymentsHistory } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExpenseForm } from "./expense-form";
import { ExpenseTable } from "./expense-table";

function totalExpensesThisMonth(
	expenses: { value: number; frequency: string }[]
): number {
	return expenses.reduce((acc, e) => {
		switch (e.frequency) {
			case "MONTHLY":
				return acc + e.value;
			case "ANNUAL":
				return acc + e.value / 12;
			default:
				return acc + e.value;
		}
	}, 0);
}

export default async function GastosPage() {
	const session = await getSession();
	if (!session) redirect("/");

	const [expenses, paymentsHistory] = await Promise.all([
		getExpensesWithPaymentStatus(),
		getPaymentsHistory(),
	]);

	const monthName = new Date().toLocaleString("pt-BR", { month: "long" });
	const totalPaid = paymentsHistory.reduce((acc, p) => acc + p.expenseValue, 0);
	const totalExpenses = totalExpensesThisMonth(expenses);

	return (
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Gastos</h1>
					<p className="text-muted-foreground">Cadastre gastos com título, descrição, valor e periodicidade</p>
				</div>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Contas pagas este mês</CardTitle>
					<CardDescription>
						Valor já pago em relação ao total previsto de gastos do mês
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
							<p className="text-sm text-muted-foreground">
								de {formatCurrency(totalExpenses)} total de gastos
							</p>
						</div>
						<div className="flex items-center gap-2">
							{totalExpenses > 0 ? (
								<>
									<span className="text-sm font-medium">
										{Math.round((totalPaid / totalExpenses) * 100)}%
									</span>
									<Progress
										value={Math.min(100, (totalPaid / totalExpenses) * 100)}
										className="h-2 w-24 sm:w-32"
									/>
								</>
							) : (
								<span className="text-sm text-muted-foreground">Sem gastos no mês</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Novo gasto</CardTitle>
				</CardHeader>
				<CardContent>
					<ExpenseForm />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Lista de gastos</CardTitle>
					<p className="text-sm text-muted-foreground">{expenses.length} registro(s)</p>
				</CardHeader>
				<CardContent>
					<ExpenseTable expenses={expenses} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pagamentos concluídos neste mês</CardTitle>
					<p className="text-sm text-muted-foreground">
						Histórico do que já foi pago em {monthName}
					</p>
				</CardHeader>
				<CardContent>
					{paymentsHistory.length === 0 ? (
						<p className="py-4 text-center text-muted-foreground">Nenhum pagamento registrado neste mês.</p>
					) : (
						<ul className="space-y-2">
							{paymentsHistory.map((p) => (
								<li
									key={p.id}
									className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
								>
									<span className="font-medium">{p.expenseTitle}</span>
									<span className="text-muted-foreground">
										{formatCurrency(p.expenseValue)} · pago em{" "}
										{new Date(p.paidAt).toLocaleDateString("pt-BR")}
									</span>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
