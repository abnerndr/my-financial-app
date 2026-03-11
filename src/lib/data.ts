import { createAlert } from "@/app/actions/alerts";
import { getSession } from "@/lib/auth";
import {
	remainingBalance,
	totalMonthlyExpenses,
	totalMonthlyIncome,
	totalSaved,
	usagePercent,
} from "@/lib/calculations";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
	const session = await getSession();
	if (!session?.user?.id) return null;

	const now = new Date();
	const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const [expenses, incomes, settings, paymentsThisMonth] = await Promise.all([
		prisma.expense.findMany({ where: { userId: session.user.id } }),
		prisma.income.findMany({ where: { userId: session.user.id } }),
		prisma.userSettings.findUnique({
			where: { userId: session.user.id },
		}),
		prisma.expensePayment.findMany({
			where: {
				expense: { userId: session.user.id },
				referenceMonth: firstOfMonth,
			},
			include: { expense: { select: { value: true } } },
		}),
	]);

	const warningPercent = settings?.warningLimitPercent ?? 0;
	const monthlyIncome = totalMonthlyIncome(incomes);
	const saved = totalSaved(incomes);
	const monthlyExpenses = totalMonthlyExpenses(expenses);
	const totalPaidThisMonth = paymentsThisMonth.reduce((acc, p) => acc + Number(p.expense.value), 0);
	const balance = remainingBalance(incomes, expenses);
	const { usedPercent, remainingPercent, isCritical } = usagePercent(incomes, expenses, warningPercent);

	if (isCritical && (incomes.length > 0 || expenses.length > 0)) {
		const recentAlert = await prisma.alert.findFirst({
			where: {
				userId: session.user.id,
				type: "LIMIT_WARNING",
				read: false,
				triggeredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
			},
		});
		if (!recentAlert) {
			await createAlert(
				"LIMIT_WARNING",
				`Atenção: você atingiu ${warningPercent}% do limite. Restam ${remainingPercent.toFixed(0)}% do orçamento.`,
				{ usedPercent, remainingPercent, warningPercent },
			);
		}
	}

	return {
		expenses,
		incomes,
		settings,
		monthlyIncome,
		saved,
		monthlyExpenses,
		totalPaidThisMonth,
		balance,
		usedPercent,
		remainingPercent,
		isCritical,
		warningLimitPercent: warningPercent,
	};
}

export async function getExpenses() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.expense.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
		include: { payments: true },
	});
}

/** Retorna gastos com flag indicando se foram pagos no mês/ano informado. */
export async function getExpensesWithPaymentStatus(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];
	const now = new Date();
	const y = year ?? now.getFullYear();
	const m = month ?? now.getMonth();
	const firstOfMonth = new Date(y, m, 1);

	const expenses = await prisma.expense.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
		include: {
			payments: {
				where: { referenceMonth: firstOfMonth },
				take: 1,
			},
		},
	});

	return expenses.map((e) => ({
		id: e.id,
		userId: e.userId,
		title: e.title,
		description: e.description,
		logoUrl: e.logoUrl,
		value: Number(e.value),
		frequency: e.frequency,
		dueDate: e.dueDate?.toISOString() ?? null,
		createdAt: e.createdAt.toISOString(),
		updatedAt: e.updatedAt.toISOString(),
		paidThisMonth: e.payments.length > 0,
	}));
}

/** Histórico de pagamentos concluídos (por mês). */
export async function getPaymentsHistory(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];
	const now = new Date();
	const y = year ?? now.getFullYear();
	const m = month ?? now.getMonth();
	const start = new Date(y, m, 1);
	const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

	const payments = await prisma.expensePayment.findMany({
		where: {
			expense: { userId: session.user.id },
			referenceMonth: start,
		},
		include: { expense: true },
		orderBy: { paidAt: "desc" },
	});

	return payments.map((p) => ({
		id: p.id,
		expenseId: p.expenseId,
		expenseTitle: p.expense.title,
		expenseValue: Number(p.expense.value),
		referenceMonth: p.referenceMonth,
		paidAt: p.paidAt,
	}));
}

export async function getIncomes() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.income.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});
}

export async function getAlerts() {
	const session = await getSession();
	if (!session?.user?.id) return [];
	return prisma.alert.findMany({
		where: { userId: session.user.id },
		orderBy: { triggeredAt: "desc" },
		take: 50,
	});
}

export async function getSettings() {
	const session = await getSession();
	if (!session?.user?.id) return null;
	return prisma.userSettings.findUnique({
		where: { userId: session.user.id },
	});
}
