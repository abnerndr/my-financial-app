"use client";

import type { Expense, Income } from "@prisma/client";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const FREQUENCY_LABELS: Record<string, string> = {
	ONE_TIME: "Uma vez",
	MONTHLY: "Mensal",
	ANNUAL: "Anual",
};

const INCOME_TYPE_LABELS: Record<string, string> = {
	SALARY: "Salário",
	BENEFITS: "Benefícios",
	SAVED: "Guardado",
	OTHER: "Outro",
};

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function monthlyExpenseValue(expense: Expense): number {
	const v = Number(expense.value);
	switch (expense.frequency) {
		case "MONTHLY":
			return v;
		case "ANNUAL":
			return v / 12;
		case "ONE_TIME":
			return v;
		default:
			return v;
	}
}

export function ReportsCharts({ expenses, incomes }: { expenses: Expense[]; incomes: Income[] }) {
	const byFrequency = expenses.reduce<Record<string, { name: string; value: number; count: number }>>((acc, e) => {
		const name = FREQUENCY_LABELS[e.frequency] ?? e.frequency;
		if (!acc[e.frequency]) {
			acc[e.frequency] = { name, value: 0, count: 0 };
		}
		acc[e.frequency].value += monthlyExpenseValue(e);
		acc[e.frequency].count += 1;
		return acc;
	}, {});

	const expenseByFrequencyData = Object.values(byFrequency);

	const incomeByType = incomes.reduce<Record<string, { name: string; value: number }>>((acc, i) => {
		const name = INCOME_TYPE_LABELS[i.type] ?? i.type;
		if (!acc[i.type]) {
			acc[i.type] = { name, value: 0 };
		}
		acc[i.type].value += Number(i.value);
		return acc;
	}, {});

	const incomePieData = Object.values(incomeByType);

	const totalIncome = incomes.reduce((acc, i) => acc + Number(i.value), 0);
	const totalExpense = expenses.reduce((acc, e) => acc + monthlyExpenseValue(e), 0);
	const summaryData = [
		{ name: "Renda", value: totalIncome, fill: "var(--chart-2)" },
		{ name: "Gastos (mês)", value: totalExpense, fill: "var(--chart-1)" },
	].filter((d) => d.value > 0);

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div className="space-y-4">
				<h3 className="font-semibold">Gastos por periodicidade</h3>
				{expenseByFrequencyData.length > 0 ? (
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={expenseByFrequencyData}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="name" className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
								<YAxis
									className="text-xs"
									tick={{ fill: "var(--muted-foreground)" }}
									tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
								/>
								<Tooltip
									formatter={(value: number | undefined) =>
										value != null
											? new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
											  }).format(value)
											: ""
									}
								/>
								<Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				) : (
					<p className="py-8 text-center text-muted-foreground">Adicione gastos para ver o gráfico.</p>
				)}
			</div>

			<div className="space-y-4">
				<h3 className="font-semibold">Renda por tipo</h3>
				{incomePieData.length > 0 ? (
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={incomePieData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
								>
									{incomePieData.map((_, i) => (
										<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									formatter={(value: number | undefined) =>
										value != null
											? new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
											  }).format(value)
											: ""
									}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				) : (
					<p className="py-8 text-center text-muted-foreground">Adicione renda para ver o gráfico.</p>
				)}
			</div>

			{summaryData.length >= 2 && (
				<div className="space-y-4 lg:col-span-2">
					<h3 className="font-semibold">Renda vs Gastos (mensal)</h3>
					<div className="h-[280px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={summaryData} layout="vertical" margin={{ left: 60 }}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									type="number"
									tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
									className="text-xs"
									tick={{ fill: "var(--muted-foreground)" }}
								/>
								<YAxis
									type="category"
									dataKey="name"
									className="text-xs"
									tick={{ fill: "var(--muted-foreground)" }}
									width={100}
								/>
								<Tooltip
									formatter={(value: number | undefined) =>
										value != null
											? new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
											  }).format(value)
											: ""
									}
								/>
								<Bar dataKey="value" radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</div>
	);
}
