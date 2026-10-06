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
import { HistoryMonthFilter } from "./history-month-filter";
import { PaymentHistory } from "./payment-history";

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

export default async function GastosPage({
	searchParams,
}: {
	searchParams: Promise<{ pagina?: string; mes?: string }>;
}) {
	const { pagina, mes } = await searchParams;
	const historyPage = Number(pagina) || 1;
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

	const historyMonths = groupPaymentsByReferenceMonth(paymentsHistory).map((g) => ({
		key: g.key,
		label: g.label,
		count: g.payments.length,
	}));
	const selectedMonth = historyMonths.find((m) => m.key === mes) ?? null;
	const filteredHistory = selectedMonth
		? paymentsHistory.filter((p) => {
				const ref = new Date(p.referenceMonth);
				return `${ref.getUTCFullYear()}-${String(ref.getUTCMonth() + 1).padStart(2, "0")}` === selectedMonth.key;
			})
		: paymentsHistory;
	const historyHref = (p: number) => {
		const params = new URLSearchParams();
		if (selectedMonth) params.set("mes", selectedMonth.key);
		if (p > 1) params.set("pagina", String(p));
		const query = params.toString();
		return query ? `/gastos?${query}` : "/gastos";
	};
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
				<CardHeader divider>
					<CardTitle>Novo gasto</CardTitle>
					<CardDescription>Título, valor, periodicidade e vencimento</CardDescription>
				</CardHeader>
				<CardContent>
					<ExpenseForm library={library} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader divider>
					<CardTitle>Lista de gastos</CardTitle>
					<CardDescription>
						{expenses.length} ativo(s) · mensais e anuais permanecem; únicos vão para o histórico após o pagamento
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ExpenseTable expenses={expenses} library={library} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader
					divider
					action={
						historyMonths.length > 0 && (
							<HistoryMonthFilter months={historyMonths} value={selectedMonth?.key ?? null} />
						)
					}
				>
					<CardTitle>Histórico de pagamentos</CardTitle>
					<CardDescription>
						{selectedMonth
							? `Pagamentos de ${selectedMonth.label}`
							: "Pagamentos concluídos de todos os meses"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PaymentHistory payments={filteredHistory} page={historyPage} hrefFor={historyHref} />
				</CardContent>
			</Card>
		</div>
	);
}
