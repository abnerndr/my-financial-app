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

	const [expenses, incomes, settings] = await Promise.all([
		prisma.expense.findMany({ where: { userId: session.user.id } }),
		prisma.income.findMany({ where: { userId: session.user.id } }),
		prisma.userSettings.findUnique({
			where: { userId: session.user.id },
		}),
	]);

	const warningPercent = settings?.warningLimitPercent ?? 90;
	const monthlyIncome = totalMonthlyIncome(incomes);
	const saved = totalSaved(incomes);
	const monthlyExpenses = totalMonthlyExpenses(expenses);
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
				{ usedPercent, remainingPercent, warningPercent }
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
	});
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
