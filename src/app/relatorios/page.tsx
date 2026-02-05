import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDashboardData, getExpenses, getIncomes } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportsCharts } from "./reports-charts";

export default async function RelatoriosPage() {
	const session = await getSession();
	if (!session) redirect("/login");

	const [dashboard, expenses, incomes] = await Promise.all([getDashboardData(), getExpenses(), getIncomes()]);

	if (!dashboard) {
		return (
			<div className="container max-w-4xl py-8">
				<p className="text-muted-foreground">Carregando...</p>
			</div>
		);
	}

	const { monthlyIncome, saved, monthlyExpenses, balance, usedPercent } = dashboard;

	return (
		<div className="container max-w-4xl space-y-8 py-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Relatórios e métricas</h1>
					<p className="text-muted-foreground">Gráficos e resumo financeiro</p>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Renda mensal</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Guardado</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(saved)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Gastos (mês)</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Uso do orçamento</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{usedPercent.toFixed(0)}%</p>
					</CardContent>
				</Card>
			</div>

			<ReportsCharts expenses={expenses} incomes={incomes} />
		</div>
	);
}
