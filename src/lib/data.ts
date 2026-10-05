import { createAlert } from "@/app/actions/alerts";
import { getSession } from "@/lib/auth";
import {
	remainingBalance,
	totalMonthlyExpenses,
	totalMonthlyIncome,
	totalSaved,
	usagePercent,
} from "@/lib/calculations";
import { formatDateOnly } from "@/lib/date-only";
import { isActiveExpense } from "@/lib/expense-visibility";
import { sendWhatsAppText } from "@/lib/evolution-api";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getMonthRangeInTimeZone } from "@/lib/month";

export async function getDashboardData() {
	const session = await getSession();
	if (!session?.user?.id) return null;

	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone();

	const [allExpenses, incomes, settings, paymentsThisMonth, paidOneTimeIds] = await Promise.all([
		prisma.expense.findMany({ where: { userId: session.user.id } }),
		prisma.income.findMany({ where: { userId: session.user.id } }),
		prisma.userSettings.findUnique({
			where: { userId: session.user.id },
		}),
		prisma.expensePayment.findMany({
			where: {
				expense: { userId: session.user.id },
				referenceMonth: { gte: startOfMonth, lt: endOfMonth },
			},
			include: { expense: { select: { value: true } } },
		}),
		prisma.expensePayment
			.findMany({
				where: { expense: { userId: session.user.id, frequency: "ONE_TIME" } },
				select: { expenseId: true },
			})
			.then((list) => new Set(list.map((p) => p.expenseId))),
	]);

	// Únicos já pagos saem do cálculo do mês (ficam só no histórico).
	const expenses = allExpenses.filter((e) => isActiveExpense(e.frequency, paidOneTimeIds.has(e.id)));

	const warningPercent = settings?.warningLimitPercent ?? 0;
	const monthlyIncome = totalMonthlyIncome(incomes);
	const saved = totalSaved(incomes);
	const monthlyExpenses = totalMonthlyExpenses(expenses);
	const totalPaidThisMonth = paymentsThisMonth.reduce(
		(acc, p) => acc + Number(p.expense.value),
		0
	);
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
				`Atenção: você usou ${usedPercent.toFixed(0)}% do disponível (limite: ${warningPercent}%). Restam ${remainingPercent.toFixed(0)}% do orçamento.`,
				{ usedPercent, remainingPercent, warningPercent },
			);

			// Envia também uma notificação via WhatsApp, se o usuário tiver habilitado
			if (settings?.phone && settings.phoneVerified && settings.whatsappNotificationsEnabled) {
				const remainingMoney = Math.max(0, balance);
				const message = [
					"*Alerta de limite de gastos*",
					"",
					`Você usou *${usedPercent.toFixed(0)}%* do orçamento (limite: *${warningPercent.toFixed(0)}%*).`,
					`Valor ainda disponível para gastar: *${formatCurrency(remainingMoney)}*.`,
					"",
					"Reveja seus gastos para não ultrapassar o limite configurado.",
				].join("\n");

				// Não deixa falha de envio quebrar o dashboard
				try {
					await sendWhatsAppText(settings.phone, message);
				} catch (e) {
					console.error("[dashboard] erro ao enviar alerta de limite via WhatsApp", e);
				}
			}
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
	});
}

/** Retorna gastos ativos do mês: mensais/anuais + únicos ainda não pagos. */
export async function getExpensesWithPaymentStatus(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];
	const baseDate = year != null && month != null ? new Date(year, month, 1) : new Date();
	const { start: startOfMonth, end: endOfMonth } = getMonthRangeInTimeZone(baseDate);

	const [expenses, paidThisMonthIds, everPaidIds] = await Promise.all([
		prisma.expense.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		}),
		prisma.expensePayment
			.findMany({
				where: {
					referenceMonth: { gte: startOfMonth, lt: endOfMonth },
					expense: { userId: session.user.id },
				},
				select: { expenseId: true },
			})
			.then((list) => new Set(list.map((p) => p.expenseId))),
		prisma.expensePayment
			.findMany({
				where: {
					expense: { userId: session.user.id, frequency: "ONE_TIME" },
				},
				select: { expenseId: true },
			})
			.then((list) => new Set(list.map((p) => p.expenseId))),
	]);

	return expenses
		.filter((e) => isActiveExpense(e.frequency, everPaidIds.has(e.id)))
		.map((e) => ({
			id: e.id,
			userId: e.userId,
			title: e.title,
			description: e.description,
			logoUrl: e.logoUrl,
			logoId: e.logoId ?? null,
			value: Number(e.value),
			frequency: e.frequency,
			dueDate: e.dueDate ? formatDateOnly(e.dueDate) : null,
			createdAt: e.createdAt.toISOString(),
			updatedAt: e.updatedAt.toISOString(),
			paidThisMonth: paidThisMonthIds.has(e.id),
		}));
}

/**
 * Histórico de pagamentos concluídos.
 * Sem year/month: retorna todos os meses (histórico persiste ao virar o mês).
 * Com year/month: filtra só aquele mês de referência.
 */
export async function getPaymentsHistory(year?: number, month?: number) {
	const session = await getSession();
	if (!session?.user?.id) return [];

	const monthFilter =
		year != null && month != null
			? (() => {
					const { start, end } = getMonthRangeInTimeZone(new Date(year, month, 1));
					return { gte: start, lt: end };
				})()
			: undefined;

	const payments = await prisma.expensePayment.findMany({
		where: {
			expense: { userId: session.user.id },
			...(monthFilter ? { referenceMonth: monthFilter } : {}),
		},
		include: { expense: true },
		orderBy: [{ referenceMonth: "desc" }, { paidAt: "desc" }],
	});

	return payments.map((p) => ({
		id: p.id,
		expenseId: p.expenseId,
		expenseTitle: p.expense.title,
		expenseValue: Number(p.expense.value),
		expenseFrequency: p.expense.frequency,
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

/** Categorias (próprias + sistema) com seus logos (próprios + sistema). */
export async function getLogoLibrary() {
	const session = await getSession();
	if (!session?.user?.id) return [];

	const categories = await prisma.logoCategory.findMany({
		where: { OR: [{ userId: session.user.id }, { userId: null }] },
		include: {
			logos: {
				where: { OR: [{ userId: session.user.id }, { userId: null }] },
				orderBy: { name: "asc" },
			},
		},
		orderBy: { name: "asc" },
	});

	return categories.map((category: (typeof categories)[number]) => ({
		id: category.id,
		name: category.name,
		isSystem: category.userId === null,
		logos: category.logos.map((logo: (typeof category.logos)[number]) => ({
			id: logo.id,
			name: logo.name,
			url: logo.url,
			source: logo.source,
			isSystem: logo.userId === null,
		})),
	}));
}
