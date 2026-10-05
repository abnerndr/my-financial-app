import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth";
import { getExpensesWithPaymentStatus, getLogoLibrary, getPaymentsHistory } from "@/lib/data";
import { groupPaymentsByReferenceMonth } from "@/lib/expense-visibility";
import { getMonthRangeInTimeZone } from "@/lib/month";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExpenseForm } from "./expense-form";
import { ExpenseTable } from "./expense-table";

const frequencyLabel: Record<string, string> = {
	ONE_TIME: "Uma vez",
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

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

	const [expenses, paymentsHistory, library] = await Promise.all([
		getExpensesWithPaymentStatus(),
		getPaymentsHistory(),
		getLogoLibrary(),
	]);

	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone();
	const paymentsThisMonth = paymentsHistory.filter((p) => {
		const ref = new Date(p.referenceMonth);
		return ref >= startOfMonth && ref < endOfMonth;
	});
	const historyByMonth = groupPaymentsByReferenceMonth(paymentsHistory);

	const monthName = new Date().toLocaleString("pt-BR", { month: "long" });
	const totalPaid = paymentsThisMonth.reduce((acc, p) => acc + p.expenseValue, 0);
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
					<ExpenseForm library={library} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Lista de gastos</CardTitle>
					<p className="text-sm text-muted-foreground">
						{expenses.length} ativo(s) · mensais e anuais permanecem; únicos vão para o histórico após o pagamento
					</p>
				</CardHeader>
				<CardContent>
					<ExpenseTable expenses={expenses} library={library} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Histórico de pagamentos</CardTitle>
					<p className="text-sm text-muted-foreground">
						Pagamentos concluídos por mês · inclui {monthName} e meses anteriores
					</p>
				</CardHeader>
				<CardContent>
					{historyByMonth.length === 0 ? (
						<p className="py-4 text-center text-muted-foreground">Nenhum pagamento registrado ainda.</p>
					) : (
						<div className="space-y-6">
							{historyByMonth.map((group) => (
								<section key={group.key} className="space-y-2">
									<h3 className="text-sm font-semibold capitalize text-foreground">
										{group.label}
										<span className="ml-2 font-normal text-muted-foreground">
											({group.payments.length})
										</span>
									</h3>
									<ul className="space-y-2">
										{group.payments.map((p) => (
											<li
												key={p.id}
												className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
											>
												<div className="flex min-w-0 items-center gap-2">
													<span className="truncate font-medium">{p.expenseTitle}</span>
													<Badge variant="secondary">
														{frequencyLabel[p.expenseFrequency] ?? p.expenseFrequency}
													</Badge>
												</div>
												<span className="text-muted-foreground">
													{formatCurrency(p.expenseValue)} · pago em{" "}
													{new Date(p.paidAt).toLocaleDateString("pt-BR")}
												</span>
											</li>
										))}
									</ul>
								</section>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
