import type { Expense, Income } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

function toNumber(d: Decimal | number): number {
	return typeof d === "number" ? d : Number(d);
}

/** Soma de rendas por tipo (mensal: salário + benefícios; guardado conta como reserva) */
export function totalMonthlyIncome(incomes: Income[]): number {
	return incomes
		.filter((i) => i.type === "SALARY" || i.type === "BENEFITS")
		.reduce((acc, i) => acc + toNumber(i.value), 0);
}

/** Dinheiro guardado (reserva) */
export function totalSaved(incomes: Income[]): number {
	return incomes.filter((i) => i.type === "SAVED").reduce((acc, i) => acc + toNumber(i.value), 0);
}

/** Despesa mensal efetiva: ONE_TIME vira valor/mês se considerar 12 meses; MONTHLY = valor; ANNUAL = valor/12 */
export function monthlyExpenseValue(expense: Expense): number {
	const v = toNumber(expense.value);
	switch (expense.frequency) {
		case "MONTHLY":
			return v;
		case "ANNUAL":
			return v / 12;
		case "ONE_TIME":
			return v; // tratamos como gasto único no mês corrente ao calcular "restante"
		default:
			return v;
	}
}

/** Total de despesas mensais (recorrentes) + despesas únicas (soma total) */
export function totalMonthlyExpenses(expenses: Expense[]): number {
	return expenses.reduce((acc, e) => acc + monthlyExpenseValue(e), 0);
}

/** Para "quanto resta": renda mensal + guardado - despesas (despesas únicas somadas uma vez) */
export function remainingBalance(
	incomes: Income[],
	expenses: Expense[],
	options?: { includeOneTimeInMonth?: boolean }
): number {
	const monthlyInc = totalMonthlyIncome(incomes);
	const saved = totalSaved(incomes);
	const monthlyRecurring = expenses
		.filter((e) => e.frequency !== "ONE_TIME")
		.reduce((acc, e) => acc + monthlyExpenseValue(e), 0);
	const oneTimeTotal =
		options?.includeOneTimeInMonth !== false
			? expenses.filter((e) => e.frequency === "ONE_TIME").reduce((acc, e) => acc + toNumber(e.value), 0)
			: 0;
	return monthlyInc + saved - monthlyRecurring - oneTimeTotal;
}

/** Percentual do "limite de aviso": ex. 90% = alerta quando restar 10% do que seria o total disponível */
export function usagePercent(
	incomes: Income[],
	expenses: Expense[],
	warningLimitPercent: number
): { usedPercent: number; remainingPercent: number; isCritical: boolean } {
	const totalAvailable = totalMonthlyIncome(incomes) + totalSaved(incomes);
	if (totalAvailable <= 0) {
		return { usedPercent: 100, remainingPercent: 0, isCritical: true };
	}
	const totalSpent = totalMonthlyExpenses(expenses);
	const oneTime = expenses.filter((e) => e.frequency === "ONE_TIME").reduce((acc, e) => acc + toNumber(e.value), 0);
	const used = totalSpent + oneTime;
	const usedPercent = Math.min(100, (used / totalAvailable) * 100);
	const remainingPercent = Math.max(0, 100 - usedPercent);
	const isCritical = remainingPercent <= 100 - warningLimitPercent;
	return { usedPercent, remainingPercent, isCritical };
}
